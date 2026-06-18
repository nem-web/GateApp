import { NextResponse } from "next/server";
import { getRazorpayConfig, createRazorpayOrder, createRazorpaySubscription } from "@/lib/razorpay";
import { getSessionUserId } from "@/lib/session";
import { PREMIUM_AMOUNT_PAISE, PREMIUM_CURRENCY, formatCurrencyPaise } from "@/lib/subscription";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const userId = await getSessionUserId();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const config = getRazorpayConfig();
  if (!config.configured) {
    return NextResponse.json(
      {
        error: "Razorpay is not configured.",
        setupRequired: true,
        env: ["RAZORPAY_KEY_ID", "RAZORPAY_KEY_SECRET", "NEXT_PUBLIC_RAZORPAY_KEY_ID"],
      },
      { status: 501 },
    );
  }

  const body = (await req.json().catch(() => ({}))) as { mode?: string; billingPhone?: string };
  const mode = body.mode === "one_time" ? "one_time" : "subscription";
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { email: true, name: true },
  });
  const receipt = `premium_${userId.slice(0, 10)}_${Date.now().toString(36)}`;

  try {
    if (mode === "subscription" && config.premiumPlanId) {
      const razorpaySub = await createRazorpaySubscription({
        planId: config.premiumPlanId,
        notes: {
          userId,
          planType: "PREMIUM",
          product: "GATEPrep Pro Premium",
        },
      });

      const subscription = await prisma.subscription.create({
        data: {
          userId,
          planType: "PREMIUM",
          status: "PENDING",
          razorpaySubscriptionId: razorpaySub.id,
          razorpayPlanId: config.premiumPlanId,
          amountPaise: PREMIUM_AMOUNT_PAISE,
          currency: PREMIUM_CURRENCY,
          billingEmail: user?.email,
          billingName: user?.name,
          billingPhone: body.billingPhone,
          metadata: { mode, razorpayStatus: razorpaySub.status },
        },
      });

      await prisma.paymentHistory.create({
        data: {
          userId,
          subscriptionId: subscription.id,
          status: "PENDING",
          amountPaise: PREMIUM_AMOUNT_PAISE,
          currency: PREMIUM_CURRENCY,
          receipt,
          razorpaySubscriptionId: razorpaySub.id,
          metadata: { mode },
        },
      });

      return NextResponse.json({
        mode,
        keyId: config.keyId,
        subscriptionId: razorpaySub.id,
        amountPaise: PREMIUM_AMOUNT_PAISE,
        currency: PREMIUM_CURRENCY,
        displayAmount: formatCurrencyPaise(PREMIUM_AMOUNT_PAISE),
        name: "GATEPrep Pro Premium",
        description: "Monthly Premium subscription",
        prefill: { name: user?.name ?? "", email: user?.email ?? "", contact: body.billingPhone ?? "" },
      });
    }

    const order = await createRazorpayOrder({
      amountPaise: PREMIUM_AMOUNT_PAISE,
      currency: PREMIUM_CURRENCY,
      receipt,
      notes: {
        userId,
        planType: "PREMIUM",
        product: "GATEPrep Pro Premium",
      },
    });

    const subscription = await prisma.subscription.create({
      data: {
        userId,
        planType: "PREMIUM",
        status: "PENDING",
        razorpayOrderId: order.id,
        amountPaise: PREMIUM_AMOUNT_PAISE,
        currency: PREMIUM_CURRENCY,
        interval: "one_time_month",
        billingEmail: user?.email,
        billingName: user?.name,
        billingPhone: body.billingPhone,
        metadata: { mode, razorpayStatus: order.status },
      },
    });

    await prisma.paymentHistory.create({
      data: {
        userId,
        subscriptionId: subscription.id,
        status: "CREATED",
        amountPaise: PREMIUM_AMOUNT_PAISE,
        currency: PREMIUM_CURRENCY,
        receipt,
        razorpayOrderId: order.id,
        metadata: { mode },
      },
    });

    return NextResponse.json({
      mode: "one_time",
      keyId: config.keyId,
      orderId: order.id,
      amountPaise: order.amount,
      currency: order.currency,
      displayAmount: formatCurrencyPaise(order.amount),
      name: "GATEPrep Pro Premium",
      description: "One month Premium access",
      prefill: { name: user?.name ?? "", email: user?.email ?? "", contact: body.billingPhone ?? "" },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to start checkout.";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}

export async function GET() {
  return NextResponse.redirect(new URL("/upgrade", process.env.NEXTAUTH_URL ?? "http://localhost:3000"));
}
