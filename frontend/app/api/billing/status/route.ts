import { NextResponse } from "next/server";
import { getSessionUserId } from "@/lib/session";
import { getUserMemoryUsage } from "@/lib/memory-quota";
import {
  getUserPlan,
  PLAN_FEATURE_MATRIX,
  PLAN_LIMITS,
  countFeatureUsage,
  formatCurrencyPaise,
  PREMIUM_AMOUNT_PAISE,
} from "@/lib/subscription";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const userId = await getSessionUserId();

  if (!userId) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  const [
    plan,
    memory,
    payments,
    subscriptions,
  ] = await Promise.all([
    getUserPlan(userId),

    getUserMemoryUsage(userId),

    prisma.paymentHistory.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: 20,
    }),

    prisma.subscription.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: 5,
    }),
  ]);

  if (!plan) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  const usagePairs = await Promise.all(
    (
      Object.keys(
        PLAN_LIMITS.TRIAL
      ) as Array<
        keyof typeof PLAN_LIMITS.TRIAL
      >
    ).map(async (feature) => [
      feature,

      feature === "storage_bytes"
        ? memory.usedBytes
        : await countFeatureUsage(
            userId,
            feature
          ),
    ])
  );

  return NextResponse.json({
    plan: {
      planType: plan.planType,
      status:
        plan.subscriptionStatus,

      isPremium:
        plan.isPremium,

      trialStartedAt:
        plan.trialStartedAt,

      trialEndsAt:
        plan.trialEndsAt,

      activeSubscription:
        plan.activeSubscription ??
        null,

      limits: plan.limits,
    },

    pricing: {
      amountPaise:
        PREMIUM_AMOUNT_PAISE,

      displayAmount:
        formatCurrencyPaise(
          PREMIUM_AMOUNT_PAISE
        ),

      currency: "INR",
    },

    usage:
      Object.fromEntries(
        usagePairs
      ),

    memory,

    featureMatrix:
      PLAN_FEATURE_MATRIX,

    payments,

    subscriptions,
  });
}