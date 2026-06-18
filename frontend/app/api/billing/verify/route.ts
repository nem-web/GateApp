import { NextResponse } from "next/server";
import { verifyRazorpayPaymentSignature } from "@/lib/razorpay";
import { getSessionUserId } from "@/lib/session";
import { premiumExpiryFromNow } from "@/lib/subscription";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const userId = await getSessionUserId();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = (await req.json().catch(() => null)) as
    | {
        razorpay_order_id?: string;
        razorpay_payment_id?: string;
        razorpay_subscription_id?: string;
        razorpay_signature?: string;
      }
    | null;
  if (!body?.razorpay_payment_id || !body.razorpay_signature) {
    return NextResponse.json({ error: "Missing payment verification fields." }, { status: 400 });
  }

  const verified = verifyRazorpayPaymentSignature({
    orderId: body.razorpay_order_id,
    subscriptionId: body.razorpay_subscription_id,
    paymentId: body.razorpay_payment_id,
    signature: body.razorpay_signature,
  });
  if (!verified) return NextResponse.json({ error: "Invalid Razorpay signature." }, { status: 400 });

  const lookup = [
    body.razorpay_order_id ? { razorpayOrderId: body.razorpay_order_id } : null,
    body.razorpay_subscription_id ? { razorpaySubscriptionId: body.razorpay_subscription_id } : null,
  ].filter(Boolean) as Array<{ razorpayOrderId: string } | { razorpaySubscriptionId: string }>;
  if (lookup.length === 0) {
    return NextResponse.json({ error: "Missing Razorpay order or subscription id." }, { status: 400 });
  }

  const subscription = await prisma.subscription.findFirst({
    where: {
      userId,
      OR: lookup,
    },
    orderBy: { createdAt: "desc" },
  });
  if (!subscription) return NextResponse.json({ error: "Subscription record not found." }, { status: 404 });

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
        razorpayPaymentId: body.razorpay_payment_id,
        razorpaySignature: body.razorpay_signature,
      },
    }),
    prisma.paymentHistory.upsert({
      where: { razorpayPaymentId: body.razorpay_payment_id },
      create: {
        userId,
        subscriptionId: subscription.id,
        status: "CAPTURED",
        amountPaise: subscription.amountPaise,
        currency: subscription.currency,
        razorpayOrderId: body.razorpay_order_id,
        razorpayPaymentId: body.razorpay_payment_id,
        razorpaySubscriptionId: body.razorpay_subscription_id,
        razorpaySignature: body.razorpay_signature,
        paidAt: now,
      },
      update: {
        status: "CAPTURED",
        subscriptionId: subscription.id,
        razorpaySignature: body.razorpay_signature,
        paidAt: now,
      },
    }),
    prisma.user.update({
      where: { id: userId },
      data: { planType: "PREMIUM", subscriptionStatus: "ACTIVE" },
    }),
  ]);

  return NextResponse.json({ ok: true, status: "ACTIVE", expiryDate });
}
