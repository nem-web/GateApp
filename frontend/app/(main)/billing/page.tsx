import Link from "next/link";
import { CreditCard, FileText, RefreshCw, ShieldCheck, Sparkles } from "lucide-react";
import { RazorpayCheckoutButton } from "@/components/RazorpayCheckoutButton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getUserMemoryUsage } from "@/lib/memory-quota";
import { prisma } from "@/lib/prisma";
import { getSessionUserId } from "@/lib/session";
import { PLAN_FEATURE_MATRIX, PLAN_LIMITS, countFeatureUsage, formatCurrencyPaise, getUserPlan } from "@/lib/subscription";

export const dynamic = "force-dynamic";

function formatDate(date: Date | string | null | undefined) {
  if (!date) return "Not set";
  return new Intl.DateTimeFormat("en-IN", { dateStyle: "medium", timeStyle: "short" }).format(new Date(date));
}

function formatLimit(value: number, feature: string) {
  if (value === Number.MAX_SAFE_INTEGER) return "Unlimited";
  if (feature === "storage_bytes") return `${Math.round(value / (1024 * 1024))} MB`;
  return value.toLocaleString("en-IN");
}

export default async function BillingPage() {
  const userId = await getSessionUserId();
  if (!userId) {
    return <div className="mx-auto max-w-3xl px-4 py-8">Sign in to view billing.</div>;
  }

  const [plan, memory, payments, subscriptions] = await Promise.all([
    getUserPlan(userId),
    getUserMemoryUsage(userId),
    prisma.paymentHistory.findMany({ where: { userId }, orderBy: { createdAt: "desc" }, take: 25 }),
    prisma.subscription.findMany({ where: { userId }, orderBy: { createdAt: "desc" }, take: 10 }),
  ]);
  const usageEntries = await Promise.all(
    (Object.keys(PLAN_LIMITS.TRIAL) as Array<keyof typeof PLAN_LIMITS.TRIAL>).map(async (feature) => ({
      feature,
      used: feature === "storage_bytes" ? memory.usedBytes : await countFeatureUsage(userId, feature),
      limit: plan?.limits[feature] ?? PLAN_LIMITS.TRIAL[feature],
    })),
  );

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-6 lg:px-8 lg:py-8">
      <header className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm font-medium text-primary">Subscription</p>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">Billing dashboard</h1>
          <p className="text-sm text-muted-foreground">Manage plan access, payment history, invoices, renewals, and quota usage.</p>
        </div>
        {!plan?.isPremium && (
          <Button asChild>
            <Link href="/upgrade">Upgrade</Link>
          </Button>
        )}
      </header>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Sparkles /> Current plan</CardTitle>
            <CardDescription>Plan state is derived server-side from active subscriptions.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-3">
            <div>
              <p className="text-xs text-muted-foreground">Plan</p>
              <p className="text-2xl font-semibold">{plan?.planType ?? "TRIAL"}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Status</p>
              <Badge variant={plan?.isPremium ? "default" : "secondary"}>{plan?.subscriptionStatus ?? "TRIAL"}</Badge>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Renewal / expiry</p>
              <p className="text-sm">{formatDate(plan?.activeSubscription?.renewalDate ?? plan?.activeSubscription?.expiryDate)}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><CreditCard /> Premium</CardTitle>
            <CardDescription>{formatCurrencyPaise(Number(process.env.RAZORPAY_PREMIUM_AMOUNT_PAISE ?? 29900))} monthly</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {plan?.isPremium ? (
              <div className="rounded-lg border border-border p-4 text-sm text-muted-foreground">
                <div className="mb-2 flex items-center gap-2 font-medium text-foreground"><ShieldCheck size={16} /> Active</div>
                Premium access is enabled for this account.
              </div>
            ) : (
              <RazorpayCheckoutButton />
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Trial and plan usage</CardTitle>
          <CardDescription>Trial limits are enforced in API routes, not only in the interface.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {usageEntries.map((entry) => (
              <div key={entry.feature} className="rounded-lg border border-border p-4">
                <p className="text-sm font-medium">{entry.feature.replace(/_/g, " ")}</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  {formatLimit(entry.used, entry.feature)} used of {formatLimit(entry.limit, entry.feature)}
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><RefreshCw /> Subscriptions</CardTitle>
          <CardDescription>Razorpay and manual subscription records.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Status</TableHead>
                <TableHead>Provider id</TableHead>
                <TableHead>Started</TableHead>
                <TableHead>Renewal</TableHead>
                <TableHead>Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {subscriptions.map((sub) => (
                <TableRow key={sub.id}>
                  <TableCell><Badge variant={sub.status === "ACTIVE" ? "default" : "secondary"}>{sub.status}</Badge></TableCell>
                  <TableCell className="font-mono text-xs">{sub.razorpaySubscriptionId ?? sub.razorpayOrderId ?? sub.id}</TableCell>
                  <TableCell>{formatDate(sub.startDate)}</TableCell>
                  <TableCell>{formatDate(sub.renewalDate ?? sub.expiryDate)}</TableCell>
                  <TableCell>{formatCurrencyPaise(sub.amountPaise)}</TableCell>
                </TableRow>
              ))}
              {subscriptions.length === 0 && (
                <TableRow><TableCell colSpan={5} className="text-muted-foreground">No subscriptions yet.</TableCell></TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><FileText /> Payment and invoice history</CardTitle>
          <CardDescription>Payment records from checkout verification and Razorpay webhooks.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Status</TableHead>
                <TableHead>Payment id</TableHead>
                <TableHead>Invoice</TableHead>
                <TableHead>Paid</TableHead>
                <TableHead className="text-right">Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {payments.map((payment) => (
                <TableRow key={payment.id}>
                  <TableCell><Badge variant={payment.status === "CAPTURED" ? "default" : "secondary"}>{payment.status}</Badge></TableCell>
                  <TableCell className="font-mono text-xs">{payment.razorpayPaymentId ?? payment.razorpayOrderId ?? payment.id}</TableCell>
                  <TableCell>
                    {payment.invoiceUrl ? <Link className="text-primary underline" href={payment.invoiceUrl}>Invoice</Link> : payment.invoiceNumber ?? "Pending"}
                  </TableCell>
                  <TableCell>{formatDate(payment.paidAt ?? payment.createdAt)}</TableCell>
                  <TableCell className="text-right">{formatCurrencyPaise(payment.amountPaise)}</TableCell>
                </TableRow>
              ))}
              {payments.length === 0 && (
                <TableRow><TableCell colSpan={5} className="text-muted-foreground">No payments yet.</TableCell></TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Premium feature matrix</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3 md:grid-cols-2">
          {PLAN_FEATURE_MATRIX.map((row) => (
            <div key={row.label} className="rounded-lg border border-border p-4">
              <p className="font-medium">{row.label}</p>
              <p className="mt-1 text-sm text-muted-foreground">Trial: {row.trial}</p>
              <p className="text-sm text-muted-foreground">Premium: {row.premium}</p>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
