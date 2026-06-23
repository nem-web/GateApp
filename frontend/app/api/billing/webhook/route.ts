import { NextResponse } from "next/server";
import crypto from "crypto";
import { prisma } from "@/lib/prisma";
import { premiumExpiryFromNow } from "@/lib/subscription";

export const runtime = "nodejs";

// Cashfree Webhook Signature requires combining the timestamp and the raw body
function verifyCashfreeSignature(
  rawBody: string,
  signature: string | null,
  timestamp: string | null
) {
  if (!signature || !timestamp) return false;

  const expected = crypto
    .createHmac("sha256", process.env.CASHFREE_WEBHOOK_SECRET!)
    .update(timestamp + rawBody)
    .digest("base64");

  return expected === signature;
}

export async function POST(req: Request) {
  const rawBody = await req.text();

  const signature = req.headers.get("x-webhook-signature");
  const timestamp = req.headers.get("x-webhook-timestamp");

  if (!verifyCashfreeSignature(rawBody, signature, timestamp)) {
    return NextResponse.json(
      { error: "Invalid webhook signature." },
      { status: 400 }
    );
  }

  const payload = JSON.parse(rawBody);
  const eventType = payload.type ?? "";

  // Cashfree event for successful payment
  if (eventType !== "PAYMENT_SUCCESS_WEBHOOK") {
    return NextResponse.json({
      ok: true,
      ignored: true,
    });
  }

  const orderId = payload.data?.order?.order_id;
  
  // cf_payment_id is often a number in Cashfree v3, converting to string for DB storage
  const paymentId = payload.data?.payment?.cf_payment_id?.toString(); 

  if (!orderId) {
    return NextResponse.json(
      { error: "Missing order id." },
      { status: 400 }
    );
  }

  // Using razorpayOrderId to match your existing Prisma schema
  const subscription = await prisma.subscription.findFirst({
    where: {
      razorpayOrderId: orderId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  if (!subscription) {
    return NextResponse.json(
      { error: "Subscription not found." },
      { status: 404 }
    );
  }

  const now = new Date();
  const expiryDate = premiumExpiryFromNow();

  await prisma.$transaction([
    prisma.subscription.update({
      where: {
        id: subscription.id,
      },
      data: {
        status: "ACTIVE",
        startDate: subscription.startDate ?? now,
        expiryDate,
        renewalDate: expiryDate,

        // Using razorpayPaymentId to match your existing Prisma schema
        razorpayPaymentId: paymentId,

        metadata: {
          ...(subscription.metadata as object),
          provider: "cashfree",
          cashfreeOrderId: orderId,
        },
      },
    }),

    prisma.paymentHistory.updateMany({
      where: {
        razorpayOrderId: orderId,
      },
      data: {
        status: "CAPTURED",
        razorpayPaymentId: paymentId,
        paidAt: now,
      },
    }),

    prisma.user.update({
      where: {
        id: subscription.userId,
      },
      data: {
        planType: "PREMIUM",
        subscriptionStatus: "ACTIVE",
      },
    }),
  ]);

  return NextResponse.json({
    ok: true,
  });
}