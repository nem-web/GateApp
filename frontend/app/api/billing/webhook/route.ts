import { NextResponse } from "next/server";
import crypto from "crypto";
import { prisma } from "@/lib/prisma";
import { premiumExpiryFromNow } from "@/lib/subscription";

export const runtime = "nodejs";

function verifyCashfreeSignature(
  rawBody: string,
  signature: string | null
) {
  if (!signature) return false;

  const expected = crypto
    .createHmac(
      "sha256",
      process.env.CASHFREE_WEBHOOK_SECRET!
    )
    .update(rawBody)
    .digest("base64");

  return expected === signature;
}

export async function POST(req: Request) {
  const rawBody = await req.text();

  const signature =
    req.headers.get("x-webhook-signature");

  if (
    !verifyCashfreeSignature(
      rawBody,
      signature
    )
  ) {
    return NextResponse.json(
      {
        error:
          "Invalid webhook signature.",
      },
      {
        status: 400,
      }
    );
  }

  const payload = JSON.parse(rawBody);

  const eventType =
    payload.type ?? "";

  if (
    eventType !==
    "PAYMENT_SUCCESS_WEBHOOK"
  ) {
    return NextResponse.json({
      ok: true,
      ignored: true,
    });
  }

  const orderId =
    payload.data?.order?.order_id;

  const paymentId =
    payload.data?.payment
      ?.cf_payment_id;

  if (!orderId) {
    return NextResponse.json(
      {
        error:
          "Missing order id.",
      },
      {
        status: 400,
      }
    );
  }

  const subscription =
    await prisma.subscription.findFirst({
      where: {
        razorpayOrderId:
          orderId,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

  if (!subscription) {
    return NextResponse.json(
      {
        error:
          "Subscription not found.",
      },
      {
        status: 404,
      }
    );
  }

  const now = new Date();

  const expiryDate =
    premiumExpiryFromNow();

  await prisma.$transaction([
    prisma.subscription.update({
      where: {
        id: subscription.id,
      },
      data: {
        status: "ACTIVE",
        startDate:
          subscription.startDate ??
          now,
        expiryDate,
        renewalDate:
          expiryDate,

        razorpayPaymentId:
          paymentId,

        metadata: {
          ...(subscription.metadata as object),
          provider:
            "cashfree",
          cashfreeOrderId:
            orderId,
        },
      },
    }),

    prisma.paymentHistory.updateMany({
      where: {
        razorpayOrderId:
          orderId,
      },
      data: {
        status: "CAPTURED",
        razorpayPaymentId:
          paymentId,
        paidAt: now,
      },
    }),

    prisma.user.update({
      where: {
        id: subscription.userId,
      },
      data: {
        planType:
          "PREMIUM",
        subscriptionStatus:
          "ACTIVE",
      },
    }),
  ]);

  return NextResponse.json({
    ok: true,
  });
}