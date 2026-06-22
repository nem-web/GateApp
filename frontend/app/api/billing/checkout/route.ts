import { NextResponse } from "next/server";
import { getSessionUserId } from "@/lib/session";
import {
  PREMIUM_AMOUNT_PAISE,
  PREMIUM_CURRENCY,
  formatCurrencyPaise,
} from "@/lib/subscription";
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

  const body = (await req.json().catch(() => ({}))) as {
    billingPhone?: string;
  };

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      email: true,
      name: true,
    },
  });

  const orderId = `premium_${userId.slice(0, 8)}_${Date.now()}`;

  try {
    const response = await fetch(CASHFREE_BASE, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-client-id": process.env.CASHFREE_CLIENT_ID!,
        "x-client-secret": process.env.CASHFREE_CLIENT_SECRET!,
        "x-api-version": "2023-08-01",
      },
      body: JSON.stringify({
        order_id: orderId,
        order_amount: PREMIUM_AMOUNT_PAISE / 100,
        order_currency: PREMIUM_CURRENCY,

        customer_details: {
          customer_id: userId,
          customer_name: user?.name ?? "Student",
          customer_email: user?.email ?? "",
          customer_phone:
            body.billingPhone ?? "9999999999",
        },

        order_meta: {
          return_url:
            `${process.env.NEXTAUTH_URL}/billing?order_id={order_id}`,
        },
      }),
    });

    const cfOrder = await response.json();

    if (!response.ok) {
      throw new Error(
        cfOrder.message ??
          "Cashfree order creation failed"
      );
    }

    const subscription =
      await prisma.subscription.create({
        data: {
          userId,
          planType: "PREMIUM",
          status: "PENDING",

          // Reusing existing column
          razorpayOrderId: cfOrder.order_id,

          amountPaise: PREMIUM_AMOUNT_PAISE,
          currency: PREMIUM_CURRENCY,

          interval: "one_time_month",

          billingEmail: user?.email,
          billingName: user?.name,
          billingPhone: body.billingPhone,

          metadata: {
            provider: "cashfree",
            cashfreeOrderId: cfOrder.order_id,
          },
        },
      });

    await prisma.paymentHistory.create({
      data: {
        userId,
        subscriptionId: subscription.id,

        status: "CREATED",

        amountPaise: PREMIUM_AMOUNT_PAISE,
        currency: PREMIUM_CURRENCY,

        receipt: orderId,

        // Reusing existing column
        razorpayOrderId: cfOrder.order_id,

        metadata: {
          provider: "cashfree",
          cashfreeOrderId: cfOrder.order_id,
        },
      },
    });

    return NextResponse.json({
      paymentSessionId:
        cfOrder.payment_session_id,

      orderId: cfOrder.order_id,

      amountPaise: PREMIUM_AMOUNT_PAISE,

      currency: PREMIUM_CURRENCY,

      displayAmount:
        formatCurrencyPaise(
          PREMIUM_AMOUNT_PAISE
        ),

      name: "GATEPrep Pro Premium",

      description: "Premium Access",
    });
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Unable to start checkout.";

    return NextResponse.json(
      { error: message },
      { status: 502 }
    );
  }
}

export async function GET() {
  return NextResponse.redirect(
    new URL(
      "/upgrade",
      process.env.NEXTAUTH_URL ??
        "http://localhost:3000"
    )
  );
}