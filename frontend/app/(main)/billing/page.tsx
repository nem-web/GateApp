import Link from "next/link";
import { CreditCard, FileText, RefreshCw, ShieldCheck, Sparkles, Zap, ArrowRight, BarChart3 } from "lucide-react";
import { RazorpayCheckoutButton } from "@/components/RazorpayCheckoutButton";
import { getUserMemoryUsage } from "@/lib/memory-quota";
import { prisma } from "@/lib/prisma";
import { getSessionUserId } from "@/lib/session";
import { PLAN_FEATURE_MATRIX, PLAN_LIMITS, countFeatureUsage, formatCurrencyPaise, getUserPlan, PREMIUM_AMOUNT_PAISE } from "@/lib/subscription";

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
    return (
      <div className="flex min-h-[60vh] items-center justify-center bg-[#0e0f14] text-white">
        <div className="rounded-2xl border border-gray-800 bg-[#111216] p-8 text-center shadow-2xl">
          <ShieldCheck className="mx-auto mb-4 h-12 w-12 text-[#22c55e]" />
          <h2 className="text-xl font-bold">Authentication Required</h2>
          <p className="mt-2 text-sm text-gray-400">Sign in to view and manage your billing.</p>
          <Link href="/login" className="mt-6 inline-flex rounded-lg bg-[#22c55e] px-6 py-2.5 text-sm font-bold text-black transition-all hover:bg-[#22c55e]/90">
            Sign In
          </Link>
        </div>
      </div>
    );
  }

  const [plan, memory, payments, subscriptions] = await Promise.all([
    getUserPlan(userId),
    getUserMemoryUsage(userId),
    prisma.paymentHistory.findMany({ where: { userId }, orderBy: { createdAt: "desc" }, take: 25 }),
    prisma.subscription.findMany({ where: { userId }, orderBy: { createdAt: "desc" }, take: 10 }),
  ]);

  const usageEntries = await Promise.all(
    (Object.keys(PLAN_LIMITS.TRIAL) as Array<keyof typeof PLAN_LIMITS.TRIAL>).map(async (feature) => {
      const used = feature === "storage_bytes" ? memory.usedBytes : await countFeatureUsage(userId, feature);
      const limit = plan?.limits[feature] ?? PLAN_LIMITS.TRIAL[feature];
      const percentage = limit === Number.MAX_SAFE_INTEGER ? 0 : Math.min((used / limit) * 100, 100);
      
      return { feature, used, limit, percentage };
    }),
  );

  return (
    <div className="relative min-h-screen bg-[#0e0f14] text-white font-sans overflow-hidden selection:bg-[#22c55e]/30 pb-24">
      {/* Background Ambient Glows */}
      <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-[#22c55e]/5 blur-[120px] rounded-full pointer-events-none" />
      
      <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 py-10 lg:px-8 lg:py-14">
        
        {/* HEADER */}
        <header className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between border-b border-gray-800/60 pb-8">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-gray-800 bg-gray-800/40 px-3 py-1 mb-4 text-xs font-medium text-gray-300">
              <Sparkles size={14} className="text-[#22c55e]" /> Account Settings
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight md:text-4xl text-white">Billing Dashboard</h1>
            <p className="mt-2 text-sm text-gray-400 max-w-xl">
              Manage your plan access, view payment history, download invoices, and monitor your current quota usage.
            </p>
          </div>
          {!plan?.isPremium && (
            <Link
              href="/upgrade"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-b from-[#2ed166] to-[#1b9c45] px-6 py-3 text-sm font-bold text-black shadow-[0_0_15px_rgba(34,197,94,0.3)] transition-all hover:scale-[1.02] hover:shadow-[0_0_25px_rgba(34,197,94,0.5)] active:scale-95"
            >
              <Zap size={16} className="fill-black/20" /> Upgrade Plan
            </Link>
          )}
        </header>

        {/* TOP ROW: PLAN & UPGRADE */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Current Plan Card */}
          <div className="relative lg:col-span-2 flex flex-col rounded-3xl border border-gray-800 bg-[#111216]/80 p-8 backdrop-blur-xl shadow-lg">
            <div className="absolute inset-0 rounded-3xl border-t border-white/5 pointer-events-none" />
            <div className="flex items-center gap-3 mb-8">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400">
                <ShieldCheck size={20} />
              </div>
              <div>
                <h2 className="text-lg font-bold text-white">Current Plan</h2>
                <p className="text-xs text-gray-400">Derived server-side from active subscriptions.</p>
              </div>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
              <div className="rounded-2xl border border-gray-800/50 bg-[#0B0C10] p-5">
                <p className="text-xs font-medium uppercase tracking-wider text-gray-500 mb-2">Plan</p>
                <p className={`text-2xl font-extrabold ${plan?.isPremium ? 'text-[#22c55e]' : 'text-white'}`}>
                  {plan?.planType ?? "TRIAL"}
                </p>
              </div>
              <div className="rounded-2xl border border-gray-800/50 bg-[#0B0C10] p-5">
                <p className="text-xs font-medium uppercase tracking-wider text-gray-500 mb-2">Status</p>
                <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${plan?.isPremium ? 'bg-[#22c55e]/20 text-[#22c55e]' : 'bg-gray-800 text-gray-300'}`}>
                  {plan?.subscriptionStatus ?? "TRIAL"}
                </div>
              </div>
              <div className="rounded-2xl border border-gray-800/50 bg-[#0B0C10] p-5">
                <p className="text-xs font-medium uppercase tracking-wider text-gray-500 mb-2">Renewal / Expiry</p>
                <p className="text-sm font-semibold text-gray-200">
                  {formatDate(plan?.activeSubscription?.renewalDate ?? plan?.activeSubscription?.expiryDate)}
                </p>
              </div>
            </div>
          </div>

          {/* Premium/Checkout Card */}
          <div className="relative flex flex-col rounded-3xl border border-[#22c55e]/30 bg-gradient-to-br from-[#111216] to-[#0B0C10] p-8 shadow-[0_10px_30px_-15px_rgba(34,197,94,0.2)]">
            <div className="absolute inset-0 rounded-3xl border-t border-[#22c55e]/20 pointer-events-none" />
            <div className="flex items-center gap-3 mb-6">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#22c55e]/20 text-[#22c55e]">
                <CreditCard size={20} />
              </div>
              <div>
                <h2 className="text-lg font-bold text-white">Premium Access</h2>
                <p className="text-xs text-gray-400">{formatCurrencyPaise(PREMIUM_AMOUNT_PAISE)} monthly</p>
              </div>
            </div>

            <div className="mt-auto">
              {plan?.isPremium ? (
                <div className="rounded-xl border border-[#22c55e]/20 bg-[#22c55e]/10 p-5 text-sm">
                  <div className="mb-2 flex items-center gap-2 font-bold text-[#22c55e]">
                    <ShieldCheck size={18} /> Active
                  </div>
                  <p className="text-gray-300 text-xs leading-relaxed">Premium access is securely enabled for this account.</p>
                </div>
              ) : (
                <div className="w-full">
                  <RazorpayCheckoutButton />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* USAGE METRICS */}
        <div className="relative flex flex-col rounded-3xl border border-gray-800 bg-[#111216]/60 p-8 backdrop-blur-xl">
          <div className="absolute inset-0 rounded-3xl border-t border-white/5 pointer-events-none" />
          <div className="flex items-center gap-3 mb-8">
             <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-500/10 text-purple-400">
                <BarChart3 size={20} />
              </div>
            <div>
              <h2 className="text-lg font-bold text-white">Trial & Plan Usage</h2>
              <p className="text-xs text-gray-400">Real-time quotas enforced across API routes.</p>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {usageEntries.map((entry) => (
              <div key={entry.feature} className="rounded-2xl border border-gray-800/50 bg-[#0B0C10] p-5 transition-colors hover:border-gray-700">
                <p className="text-sm font-semibold capitalize text-gray-200 mb-3">{entry.feature.replace(/_/g, " ")}</p>
                
                {/* Progress Bar */}
                <div className="h-1.5 w-full rounded-full bg-gray-800 mb-3 overflow-hidden">
                  <div 
                    className={`h-full rounded-full transition-all duration-500 ${entry.percentage >= 100 ? 'bg-red-500' : entry.percentage > 80 ? 'bg-[#f59e0b]' : 'bg-[#22c55e]'}`} 
                    style={{ width: `${entry.percentage}%` }}
                  />
                </div>

                <p className="text-xs text-gray-400">
                  <span className="font-medium text-white">{formatLimit(entry.used, entry.feature)}</span> used of {formatLimit(entry.limit, entry.feature)}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* TABLES ROW */}
        <div className="grid gap-8 lg:grid-cols-2">
          
          {/* Subscriptions Table */}
          <div className="relative flex flex-col rounded-3xl border border-gray-800 bg-[#111216]/80 p-6 md:p-8 backdrop-blur-xl overflow-hidden">
            <div className="absolute inset-0 rounded-3xl border-t border-white/5 pointer-events-none" />
            <div className="flex items-center gap-3 mb-6">
              <RefreshCw className="h-5 w-5 text-gray-400" />
              <h2 className="text-lg font-bold text-white">Subscriptions</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-[#0B0C10] text-xs uppercase text-gray-500">
                  <tr>
                    <th className="rounded-l-lg p-4 font-medium">Status</th>
                    <th className="p-4 font-medium">Started</th>
                    <th className="p-4 font-medium">Renewal</th>
                    <th className="rounded-r-lg p-4 font-medium">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800/50">
                  {subscriptions.map((sub) => (
                    <tr key={sub.id} className="transition-colors hover:bg-gray-800/20">
                      <td className="p-4">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${sub.status === "ACTIVE" ? 'bg-[#22c55e]/20 text-[#22c55e]' : 'bg-gray-800 text-gray-400'}`}>
                          {sub.status}
                        </span>
                      </td>
                      <td className="p-4 text-gray-300">{formatDate(sub.startDate)}</td>
                      <td className="p-4 text-gray-300">{formatDate(sub.renewalDate ?? sub.expiryDate)}</td>
                      <td className="p-4 text-white font-medium">{formatCurrencyPaise(sub.amountPaise)}</td>
                    </tr>
                  ))}
                  {subscriptions.length === 0 && (
                    <tr><td colSpan={4} className="p-6 text-center text-gray-500">No subscriptions found.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Payments & Invoices Table */}
          <div className="relative flex flex-col rounded-3xl border border-gray-800 bg-[#111216]/80 p-6 md:p-8 backdrop-blur-xl overflow-hidden">
            <div className="absolute inset-0 rounded-3xl border-t border-white/5 pointer-events-none" />
            <div className="flex items-center gap-3 mb-6">
              <FileText className="h-5 w-5 text-gray-400" />
              <h2 className="text-lg font-bold text-white">Payment History</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-[#0B0C10] text-xs uppercase text-gray-500">
                  <tr>
                    <th className="rounded-l-lg p-4 font-medium">Status</th>
                    <th className="p-4 font-medium">Invoice</th>
                    <th className="p-4 font-medium">Paid Date</th>
                    <th className="rounded-r-lg p-4 font-medium text-right">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800/50">
                  {payments.map((payment) => (
                    <tr key={payment.id} className="transition-colors hover:bg-gray-800/20">
                      <td className="p-4">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${payment.status === "CAPTURED" ? 'bg-[#22c55e]/20 text-[#22c55e]' : 'bg-gray-800 text-gray-400'}`}>
                          {payment.status}
                        </span>
                      </td>
                      <td className="p-4">
                        {payment.invoiceUrl ? (
                          <Link className="flex items-center gap-1 text-[#22c55e] hover:underline" href={payment.invoiceUrl}>
                            Download <ArrowRight size={12} />
                          </Link>
                        ) : (
                          <span className="text-gray-500">{payment.invoiceNumber ?? "Pending"}</span>
                        )}
                      </td>
                      <td className="p-4 text-gray-300">{formatDate(payment.paidAt ?? payment.createdAt)}</td>
                      <td className="p-4 text-right text-white font-medium">{formatCurrencyPaise(payment.amountPaise)}</td>
                    </tr>
                  ))}
                  {payments.length === 0 && (
                    <tr><td colSpan={4} className="p-6 text-center text-gray-500">No payments recorded.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}