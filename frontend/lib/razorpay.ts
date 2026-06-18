import crypto from "node:crypto";

const API_BASE = "https://api.razorpay.com/v1";

export function getRazorpayConfig() {
  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;
  return {
    keyId,
    keySecret,
    webhookSecret: process.env.RAZORPAY_WEBHOOK_SECRET,
    premiumPlanId: process.env.RAZORPAY_PREMIUM_PLAN_ID,
    configured: Boolean(keyId && keySecret),
  };
}

function authHeader() {
  const { keyId, keySecret } = getRazorpayConfig();
  if (!keyId || !keySecret) throw new Error("Razorpay credentials are not configured.");
  return `Basic ${Buffer.from(`${keyId}:${keySecret}`).toString("base64")}`;
}

async function razorpayFetch<T>(path: string, init: RequestInit) {
  const res = await fetch(`${API_BASE}${path}`, {
    ...init,
    headers: {
      Authorization: authHeader(),
      "Content-Type": "application/json",
      ...(init.headers ?? {}),
    },
  });
  const data = (await res.json().catch(() => ({}))) as T & { error?: { description?: string } };
  if (!res.ok) {
    throw new Error(data.error?.description || `Razorpay request failed with ${res.status}`);
  }
  return data as T;
}

export type RazorpayOrder = {
  id: string;
  amount: number;
  currency: string;
  receipt?: string;
  status: string;
};

export type RazorpaySubscription = {
  id: string;
  plan_id: string;
  status: string;
  current_start?: number;
  current_end?: number;
  charge_at?: number;
};

export async function createRazorpayOrder(args: {
  amountPaise: number;
  currency: string;
  receipt: string;
  notes: Record<string, string>;
}) {
  return razorpayFetch<RazorpayOrder>("/orders", {
    method: "POST",
    body: JSON.stringify({
      amount: args.amountPaise,
      currency: args.currency,
      receipt: args.receipt,
      notes: args.notes,
    }),
  });
}

export async function createRazorpaySubscription(args: {
  planId: string;
  totalCount?: number;
  notes: Record<string, string>;
}) {
  return razorpayFetch<RazorpaySubscription>("/subscriptions", {
    method: "POST",
    body: JSON.stringify({
      plan_id: args.planId,
      total_count: args.totalCount ?? 120,
      customer_notify: 1,
      notes: args.notes,
    }),
  });
}

export function verifyRazorpayPaymentSignature(args: {
  orderId?: string | null;
  subscriptionId?: string | null;
  paymentId: string;
  signature: string;
}) {
  const { keySecret } = getRazorpayConfig();
  if (!keySecret) return false;
  const base = args.subscriptionId
    ? `${args.paymentId}|${args.subscriptionId}`
    : `${args.orderId}|${args.paymentId}`;
  const expected = crypto.createHmac("sha256", keySecret).update(base).digest("hex");
  return crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(args.signature));
}

export function verifyRazorpayWebhookSignature(body: string, signature: string | null) {
  const { webhookSecret } = getRazorpayConfig();
  if (!webhookSecret || !signature) return false;
  const expected = crypto.createHmac("sha256", webhookSecret).update(body).digest("hex");
  const left = Buffer.from(expected);
  const right = Buffer.from(signature);
  return left.length === right.length && crypto.timingSafeEqual(left, right);
}

export function fromUnixSeconds(value?: number | null) {
  return value ? new Date(value * 1000) : null;
}
