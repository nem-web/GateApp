import { NextResponse } from "next/server";
import { getSessionUserId } from "@/lib/session";
import { premiumExpiryFromNow } from "@/lib/subscription";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

const CASHFREE_BASE =
  process.env.CASHFREE_ENV === "PRODUCTION"
    ? "https://api.cashfree.com/pg/orders"
    : "https://sandbox.cashfree.com/pg/orders";

export async function POST(req: Request) {
  const userId = await getSessionUserId();

  if (!userId) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  const body = (await req.json().catch(() => null)) as
    | {
        orderId?: string;
      }
    | null;

  if (!body?.orderId) {
    return NextResponse.json(
      { error: "Missing orderId." },
      { status: 400 }
    );
  }

  try {
    const response = await fetch(
      `${CASHFREE_BASE}/${body.orderId}`,
      {
        method: "GET",
        headers: {
          "x-client-id":
            process.env.CASHFREE_CLIENT_ID!,
          "x-client-secret":
            process.env.CASHFREE_CLIENT_SECRET!,
          "x-api-version":
            "2023-08-01",
        },
      }
    );

    const order = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        {
          error:
            order.message ??
            "Unable to verify payment.",
        },
        { status: 400 }
      );
    }

    if (order.order_status !== "PAID") {
      return NextResponse.json(
        {
          error:
            "Payment not completed.",
        },
        { status: 400 }
      );
    }

    const subscription =
      await prisma.subscription.findFirst({
        where: {
          userId,
          razorpayOrderId:
            body.orderId,
        },
        orderBy: {
          createdAt: "desc",
        },
      });

    if (!subscription) {
      return NextResponse.json(
        {
          error:
            "Subscription record not found.",
        },
        { status: 404 }
      );
    }

    const now = new Date();
    const expiryDate =
      premiumExpiryFromNow();

    const paymentId =
      order.cf_order_id ??
      order.order_id;

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

          // Reusing existing DB column
          razorpayPaymentId:
            paymentId,

          metadata: {
            ...(subscription.metadata as object),
            provider:
              "cashfree",
            cashfreeOrderId:
              order.order_id,
          },
        },
      }),

      prisma.paymentHistory.updateMany({
        where: {
          razorpayOrderId:
            body.orderId,
        },
        data: {
          status: "CAPTURED",

          // Reusing existing DB column
          razorpayPaymentId:
            paymentId,

          paidAt: now,
        },
      }),

      prisma.user.update({
        where: {
          id: userId,
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
      status: "ACTIVE",
      expiryDate,
    });
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Verification failed.";

    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}