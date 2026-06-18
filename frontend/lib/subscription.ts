import { NextResponse } from "next/server";
import { ADMIN_ROLE } from "@/lib/admin-config";
import { prisma } from "@/lib/prisma";

export type FeatureKey =
  | "ai_calls"
  | "notes"
  | "flashcards"
  | "pyq_papers"
  | "mock_tests"
  | "timetable_generations"
  | "advanced_analytics"
  | "storage_bytes"
  | "exports"
  | "advanced_ai";

export type PlanTypeName = "TRIAL" | "PREMIUM";
export type SubscriptionStatusName = "TRIAL" | "ACTIVE" | "PENDING" | "EXPIRED" | "CANCELLED";

export const PREMIUM_AMOUNT_PAISE = Number(process.env.RAZORPAY_PREMIUM_AMOUNT_PAISE ?? 29900);
export const PREMIUM_CURRENCY = "INR";

export const PLAN_LIMITS: Record<PlanTypeName, Record<FeatureKey, number>> = {
  TRIAL: {
    ai_calls: 25,
    notes: 20,
    flashcards: 150,
    pyq_papers: 8,
    mock_tests: 5,
    timetable_generations: 6,
    advanced_analytics: 0,
    storage_bytes: 50 * 1024 * 1024,
    exports: 0,
    advanced_ai: 0,
  },
  PREMIUM: {
    ai_calls: Number.MAX_SAFE_INTEGER,
    notes: Number.MAX_SAFE_INTEGER,
    flashcards: Number.MAX_SAFE_INTEGER,
    pyq_papers: Number.MAX_SAFE_INTEGER,
    mock_tests: Number.MAX_SAFE_INTEGER,
    timetable_generations: Number.MAX_SAFE_INTEGER,
    advanced_analytics: 1,
    storage_bytes: 2 * 1024 * 1024 * 1024,
    exports: Number.MAX_SAFE_INTEGER,
    advanced_ai: 1,
  },
};

export const PLAN_FEATURE_MATRIX = [
  { label: "AI coaching", trial: "25 saved AI generations/month", premium: "Unlimited fair-use AI coaching" },
  { label: "Notes", trial: "20 notes", premium: "Unlimited notes" },
  { label: "Flashcards", trial: "150 cards", premium: "Unlimited cards and reviews" },
  { label: "PYQ papers", trial: "8 papers", premium: "Unlimited PYQ uploads" },
  { label: "Mock tests", trial: "5 attempts/created tests", premium: "Unlimited tests" },
  { label: "Timetable generation", trial: "6 AI plans/month", premium: "Unlimited study planner" },
  { label: "Analytics", trial: "Core dashboard", premium: "Advanced analytics and weak-area insights" },
  { label: "Storage", trial: "50 MB", premium: "2 GB included" },
  { label: "Exports", trial: "Locked", premium: "Premium exports" },
];

function monthStart() {
  const now = new Date();
  return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1));
}

function addMonths(date: Date, months: number) {
  const next = new Date(date);
  next.setMonth(next.getMonth() + months);
  return next;
}

export function premiumExpiryFromNow() {
  return addMonths(new Date(), 1);
}

export function formatCurrencyPaise(amountPaise: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: PREMIUM_CURRENCY,
    maximumFractionDigits: 0,
  }).format(amountPaise / 100);
}

export async function getUserPlan(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      planType: true,
      subscriptionStatus: true,
      trialStartedAt: true,
      trialEndsAt: true,
    },
  });

  if (!user) return null;
  if (user.role === ADMIN_ROLE) {
    return {
      ...user,
      planType: "PREMIUM" as PlanTypeName,
      subscriptionStatus: "ACTIVE" as SubscriptionStatusName,
      isPremium: true,
      limits: PLAN_LIMITS.PREMIUM,
    };
  }

  const activeSubscription = await prisma.subscription.findFirst({
    where: {
      userId,
      status: "ACTIVE",
      OR: [{ expiryDate: null }, { expiryDate: { gt: new Date() } }],
    },
    orderBy: { renewalDate: "desc" },
  });

  const isPremium =
    user.planType === "PREMIUM" &&
    user.subscriptionStatus === "ACTIVE" &&
    Boolean(activeSubscription);

  return {
    ...user,
    planType: (isPremium ? "PREMIUM" : "TRIAL") as PlanTypeName,
    subscriptionStatus: (isPremium ? "ACTIVE" : user.subscriptionStatus) as SubscriptionStatusName,
    isPremium,
    activeSubscription,
    limits: isPremium ? PLAN_LIMITS.PREMIUM : PLAN_LIMITS.TRIAL,
  };
}

export async function syncExpiredSubscription(userId: string) {
  const plan = await getUserPlan(userId);
  if (!plan || plan.isPremium) return plan;

  const expired = await prisma.subscription.findFirst({
    where: { userId, status: "ACTIVE", expiryDate: { lte: new Date() } },
    orderBy: { expiryDate: "desc" },
  });
  if (!expired) return plan;

  await prisma.$transaction([
    prisma.subscription.update({ where: { id: expired.id }, data: { status: "EXPIRED" } }),
    prisma.user.update({
      where: { id: userId },
      data: { planType: "TRIAL", subscriptionStatus: "EXPIRED" },
    }),
  ]);
  return getUserPlan(userId);
}

export async function countFeatureUsage(userId: string, feature: FeatureKey) {
  switch (feature) {
    case "ai_calls":
    case "timetable_generations":
    case "exports":
    case "advanced_ai":
      return prisma.usageEvent.aggregate({
        where: { userId, feature, createdAt: { gte: monthStart() } },
        _sum: { quantity: true },
      }).then((row) => row._sum.quantity ?? 0);
    case "notes":
      return prisma.note.count({ where: { userId } });
    case "flashcards":
      return prisma.flashcard.count({ where: { userId } });
    case "pyq_papers":
      return prisma.pyqPaper.count({ where: { userId } });
    case "mock_tests": {
      const [attempts, authoredQuestions] = await Promise.all([
        prisma.testAttempt.count({ where: { userId } }),
        prisma.testPack.count({ where: { questions: { some: { userId } } } }),
      ]);
      return attempts + authoredQuestions;
    }
    case "advanced_analytics":
      return 0;
    case "storage_bytes":
      return 0;
  }
}

export async function recordUsage(userId: string, feature: FeatureKey, quantity = 1, metadata?: Record<string, unknown>) {
  await prisma.usageEvent.create({
    data: { userId, feature, quantity, metadata: metadata ?? undefined },
  });
}

export async function checkFeatureLimit(userId: string, feature: FeatureKey, incoming = 1) {
  const plan = await syncExpiredSubscription(userId);
  if (!plan) return { ok: false as const, status: 401, error: "Unauthorized" };
  if (plan.isPremium) return { ok: true as const, plan, limit: Number.MAX_SAFE_INTEGER, used: 0 };

  const limit = plan.limits[feature];
  if (limit === Number.MAX_SAFE_INTEGER) {
    return { ok: true as const, plan, limit, used: 0 };
  }

  const used = await countFeatureUsage(userId, feature);
  if (used + Math.max(0, incoming) <= limit) {
    return { ok: true as const, plan, limit, used };
  }

  return {
    ok: false as const,
    status: 402,
    error: `Trial ${feature.replace(/_/g, " ")} limit reached. Upgrade to Premium for unlimited access.`,
    feature,
    limit,
    used,
    incoming,
  };
}

export function quotaResponse(result: Exclude<Awaited<ReturnType<typeof checkFeatureLimit>>, { ok: true }>) {
  return NextResponse.json(
    {
      error: result.error,
      quotaExceeded: result.status === 402,
      upgradeRequired: result.status === 402,
      billingUrl: "/upgrade",
      feature: "feature" in result ? result.feature : undefined,
      usage:
        "limit" in result
          ? { used: result.used, incoming: result.incoming, quota: result.limit }
          : undefined,
    },
    { status: result.status },
  );
}

export async function canUseAI(userId: string) {
  return (await checkFeatureLimit(userId, "ai_calls")).ok;
}

export async function canAccessPremiumNotes(userId: string) {
  const plan = await getUserPlan(userId);
  return Boolean(plan?.isPremium);
}

export async function canAccessPremiumTests(userId: string) {
  const plan = await getUserPlan(userId);
  return Boolean(plan?.isPremium);
}

export async function canExportData(userId: string) {
  return (await checkFeatureLimit(userId, "exports")).ok;
}

export async function canUseAdvancedAnalytics(userId: string) {
  const plan = await getUserPlan(userId);
  return Boolean(plan?.isPremium);
}
