import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { verifyRazorpayWebhookSignature, fromUnixSeconds } from "@/lib/razorpay";
import { premiumExpiryFromNow } from "@/lib/subscription";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

type RazorpayWebhookPayload = {
  event?: string;
  created_at?: number;
  payload?: {
    payment?: { entity?: Record<string, unknown> };
    order?: { entity?: Record<string, unknown> };
    subscription?: { entity?: Record<string, unknown> };
    invoice?: { entity?: Record<string, unknown> };
    refund?: { entity?: Record<string, unknown> };
  };
};

function stringField(entity: Record<string, unknown> | undefined, field: string) {
  const value = entity?.[field];
  return typeof value === "string" ? value : undefined;
}

function numberField(entity: Record<string, unknown> | undefined, field: string) {
  const value = entity?.[field];
  return typeof value === "number" ? value : undefined;
}

function notes(entity: Record<string, unknown> | undefined) {
  const value = entity?.notes;
  return value && typeof value === "object" ? (value as Record<string, unknown>) : {};
}

async function activateSubscriptionByRazorpay(args: {
  userId?: string;
  orderId?: string;
  subscriptionId?: string;
  paymentId?: string;
  amountPaise?: number;
  invoiceUrl?: string;
  invoiceNumber?: string;
}) {
  const subscription = await prisma.subscription.findFirst({
    where: {
      OR: [
        ...(args.orderId ? [{ razorpayOrderId: args.orderId }] : []),
        ...(args.subscriptionId ? [{ razorpaySubscriptionId: args.subscriptionId }] : []),
      ],
      ...(args.userId ? { userId: args.userId } : {}),
    },
    orderBy: { createdAt: "desc" },
  });
  if (!subscription) return;

  const now = new Date();
  const expiryDate = premiumExpiryFromNow();
  await prisma.$transaction([
    prisma.subscription.update({
      where: { id: subscription.id },
      data: {
        status: "ACTIVE",
        startDate: subscription.startDate ?? now,
        expiryDate,
        renewalDate: expiryDate,
        razorpayPaymentId: args.paymentId ?? subscription.razorpayPaymentId,
      },
    }),
    prisma.paymentHistory.upsert({
      where: { razorpayPaymentId: args.paymentId ?? `webhook-${subscription.id}-${Date.now()}` },
      create: {
        userId: subscription.userId,
        subscriptionId: subscription.id,
        status: "CAPTURED",
        amountPaise: args.amountPaise ?? subscription.amountPaise,
        currency: subscription.currency,
        razorpayOrderId: args.orderId,
        razorpayPaymentId: args.paymentId,
        razorpaySubscriptionId: args.subscriptionId,
        invoiceUrl: args.invoiceUrl,
        invoiceNumber: args.invoiceNumber,
        paidAt: now,
      },
      update: {
        status: "CAPTURED",
        invoiceUrl: args.invoiceUrl,
        invoiceNumber: args.invoiceNumber,
        paidAt: now,
      },
    }),
    prisma.user.update({
      where: { id: subscription.userId },
      data: { planType: "PREMIUM", subscriptionStatus: "ACTIVE" },
    }),
  ]);
}

export async function POST(req: Request) {
  const raw = await req.text();
  const signature = req.headers.get("x-razorpay-signature");
  if (!verifyRazorpayWebhookSignature(raw, signature)) {
    return NextResponse.json({ error: "Invalid webhook signature." }, { status: 400 });
  }

  const payload = JSON.parse(raw) as RazorpayWebhookPayload;
  const eventType = payload.event ?? "unknown";
  const payment = payload.payload?.payment?.entity;
  const order = payload.payload?.order?.entity;
  const subscriptionEntity = payload.payload?.subscription?.entity;
  const invoice = payload.payload?.invoice?.entity;
  const refund = payload.payload?.refund?.entity;
  const eventId =
    req.headers.get("x-razorpay-event-id") ??
    `${eventType}:${stringField(payment, "id") ?? stringField(subscriptionEntity, "id") ?? payload.created_at ?? Date.now()}`;

  try {
    await prisma.razorpayWebhookEvent.create({
      data: {
        eventId,
        eventType,
        razorpayEntityId: stringField(payment, "id") ?? stringField(subscriptionEntity, "id") ?? stringField(order, "id"),
        payload: payload as unknown as Prisma.InputJsonValue,
      },
    });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      return NextResponse.json({ ok: true, duplicate: true });
    }
    throw error;
  }

  const paymentId = stringField(payment, "id");
  const orderId = stringField(payment, "order_id") ?? stringField(order, "id");
  const subscriptionId = stringField(payment, "subscription_id") ?? stringField(subscriptionEntity, "id");
  const userId = String(notes(payment).userId ?? notes(order).userId ?? notes(subscriptionEntity).userId ?? "");

  if (eventType === "payment.captured" || eventType === "subscription.charged" || eventType === "invoice.paid") {
    await activateSubscriptionByRazorpay({
      userId: userId || undefined,
      orderId,
      subscriptionId,
      paymentId,
      amountPaise: numberField(payment, "amount") ?? numberField(invoice, "amount"),
      invoiceUrl: stringField(invoice, "short_url"),
      invoiceNumber: stringField(invoice, "invoice_number"),
    });
  }

  if (eventType === "payment.failed") {
    await prisma.paymentHistory.updateMany({
      where: {
        OR: [
          ...(paymentId ? [{ razorpayPaymentId: paymentId }] : []),
          ...(orderId ? [{ razorpayOrderId: orderId }] : []),
          ...(subscriptionId ? [{ razorpaySubscriptionId: subscriptionId }] : []),
        ],
      },
      data: {
        status: "FAILED",
        failureCode: stringField(payment, "error_code"),
        failureReason: stringField(payment, "error_description") ?? stringField(payment, "error_reason"),
      },
    });
  }

  if (eventType === "subscription.cancelled") {
    const cancelledAt = fromUnixSeconds(numberField(subscriptionEntity, "ended_at")) ?? new Date();
    await prisma.subscription.updateMany({
      where: { razorpaySubscriptionId: subscriptionId },
      data: { status: "CANCELLED", cancelledAt, renewalDate: null },
    });
    await prisma.user.updateMany({
      where: { subscriptions: { some: { razorpaySubscriptionId: subscriptionId } } },
      data: { planType: "TRIAL", subscriptionStatus: "CANCELLED" },
    });
  }

  if (eventType === "refund.processed") {
    await prisma.paymentHistory.updateMany({
      where: { razorpayPaymentId: stringField(refund, "payment_id") },
      data: { status: "REFUNDED", razorpayRefundId: stringField(refund, "id") },
    });
  }

  return NextResponse.json({ ok: true });
}
