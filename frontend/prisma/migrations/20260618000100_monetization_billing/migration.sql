CREATE TYPE "PlanType" AS ENUM ('TRIAL', 'PREMIUM');
CREATE TYPE "SubscriptionStatus" AS ENUM ('TRIAL', 'ACTIVE', 'PENDING', 'EXPIRED', 'CANCELLED');
CREATE TYPE "BillingProvider" AS ENUM ('RAZORPAY', 'MANUAL');
CREATE TYPE "PaymentStatus" AS ENUM ('CREATED', 'PENDING', 'CAPTURED', 'FAILED', 'REFUNDED', 'CANCELLED');

ALTER TABLE "User" ADD COLUMN "planType" "PlanType" NOT NULL DEFAULT 'TRIAL';
ALTER TABLE "User" ADD COLUMN "subscriptionStatus" "SubscriptionStatus" NOT NULL DEFAULT 'TRIAL';
ALTER TABLE "User" ADD COLUMN "trialStartedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE "User" ADD COLUMN "trialEndsAt" TIMESTAMP(3);

CREATE TABLE "Subscription" (
  "id" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "planType" "PlanType" NOT NULL DEFAULT 'PREMIUM',
  "status" "SubscriptionStatus" NOT NULL DEFAULT 'PENDING',
  "startDate" TIMESTAMP(3),
  "expiryDate" TIMESTAMP(3),
  "renewalDate" TIMESTAMP(3),
  "cancelledAt" TIMESTAMP(3),
  "provider" "BillingProvider" NOT NULL DEFAULT 'RAZORPAY',
  "razorpayCustomerId" TEXT,
  "razorpaySubscriptionId" TEXT,
  "razorpayPlanId" TEXT,
  "razorpayOrderId" TEXT,
  "razorpayPaymentId" TEXT,
  "razorpaySignature" TEXT,
  "amountPaise" INTEGER NOT NULL,
  "currency" TEXT NOT NULL DEFAULT 'INR',
  "interval" TEXT NOT NULL DEFAULT 'monthly',
  "billingEmail" TEXT,
  "billingName" TEXT,
  "billingPhone" TEXT,
  "billingAddress" JSONB,
  "metadata" JSONB,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "Subscription_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "PaymentHistory" (
  "id" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "subscriptionId" TEXT,
  "provider" "BillingProvider" NOT NULL DEFAULT 'RAZORPAY',
  "status" "PaymentStatus" NOT NULL DEFAULT 'CREATED',
  "amountPaise" INTEGER NOT NULL,
  "currency" TEXT NOT NULL DEFAULT 'INR',
  "purpose" TEXT NOT NULL DEFAULT 'premium_subscription',
  "invoiceNumber" TEXT,
  "invoiceUrl" TEXT,
  "receipt" TEXT,
  "razorpayOrderId" TEXT,
  "razorpayPaymentId" TEXT,
  "razorpaySubscriptionId" TEXT,
  "razorpayRefundId" TEXT,
  "razorpaySignature" TEXT,
  "failureCode" TEXT,
  "failureReason" TEXT,
  "paidAt" TIMESTAMP(3),
  "metadata" JSONB,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "PaymentHistory_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "UsageEvent" (
  "id" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "feature" TEXT NOT NULL,
  "quantity" INTEGER NOT NULL DEFAULT 1,
  "metadata" JSONB,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "UsageEvent_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "RazorpayWebhookEvent" (
  "id" TEXT NOT NULL,
  "eventId" TEXT NOT NULL,
  "eventType" TEXT NOT NULL,
  "razorpayEntityId" TEXT,
  "payload" JSONB NOT NULL,
  "processedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "RazorpayWebhookEvent_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "Subscription_razorpaySubscriptionId_key" ON "Subscription"("razorpaySubscriptionId");
CREATE UNIQUE INDEX "Subscription_razorpayOrderId_key" ON "Subscription"("razorpayOrderId");
CREATE INDEX "Subscription_userId_status_idx" ON "Subscription"("userId", "status");
CREATE INDEX "Subscription_renewalDate_idx" ON "Subscription"("renewalDate");
CREATE INDEX "Subscription_createdAt_idx" ON "Subscription"("createdAt");

CREATE UNIQUE INDEX "PaymentHistory_razorpayPaymentId_key" ON "PaymentHistory"("razorpayPaymentId");
CREATE INDEX "PaymentHistory_userId_createdAt_idx" ON "PaymentHistory"("userId", "createdAt");
CREATE INDEX "PaymentHistory_razorpayOrderId_idx" ON "PaymentHistory"("razorpayOrderId");
CREATE INDEX "PaymentHistory_razorpaySubscriptionId_idx" ON "PaymentHistory"("razorpaySubscriptionId");

CREATE INDEX "UsageEvent_userId_feature_createdAt_idx" ON "UsageEvent"("userId", "feature", "createdAt");
CREATE UNIQUE INDEX "RazorpayWebhookEvent_eventId_key" ON "RazorpayWebhookEvent"("eventId");
CREATE INDEX "RazorpayWebhookEvent_eventType_processedAt_idx" ON "RazorpayWebhookEvent"("eventType", "processedAt");

ALTER TABLE "Subscription" ADD CONSTRAINT "Subscription_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "PaymentHistory" ADD CONSTRAINT "PaymentHistory_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "PaymentHistory" ADD CONSTRAINT "PaymentHistory_subscriptionId_fkey" FOREIGN KEY ("subscriptionId") REFERENCES "Subscription"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "UsageEvent" ADD CONSTRAINT "UsageEvent_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
