import Link from "next/link";
import type { Metadata } from "next";
import { Check, Lock, Sparkles, Zap, ShieldCheck } from "lucide-react";
import { JsonLd, absoluteUrl, createMetadata } from "@/lib/seo";
import { PLAN_FEATURE_MATRIX, formatCurrencyPaise, PREMIUM_AMOUNT_PAISE } from "@/lib/subscription";

export const metadata: Metadata = createMetadata({
  title: "Pricing | GATEPrep Pro",
  description: "Compare GATEPrep Pro Trial and Premium plans with AI, notes, PYQs, tests, analytics, storage, exports, and study planner access.",
  path: "/pricing",
});

export default function PricingPage() {
  const price = formatCurrencyPaise(PREMIUM_AMOUNT_PAISE);

  return (
    <div className="relative min-h-screen bg-[#0e0f14] text-white font-sans overflow-hidden selection:bg-[#22c55e]/30">
      
      {/* Background 3D Ambient "Sprinkle" Gradients */}
      <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-[#22c55e]/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-5%] w-[600px] h-[400px] bg-blue-500/10 blur-[150px] rounded-full pointer-events-none" />

      {/* Structured Data for SEO */}
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Product",
          name: "GATEPrep Pro Premium",
          description: "Premium SaaS study plan for GATE Electrical Engineering preparation.",
          offers: {
            "@type": "Offer",
            priceCurrency: "INR",
            price: PREMIUM_AMOUNT_PAISE / 100,
            url: absoluteUrl("/upgrade"),
            availability: "https://schema.org/InStock",
          },
        }}
      />

      <main className="relative z-10 mx-auto flex w-full max-w-6xl flex-col items-center gap-12 px-4 py-16 md:py-24">
        
        {/* Header Section */}
        <header className="max-w-3xl space-y-6 text-center flex flex-col items-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#22c55e]/30 bg-[#22c55e]/10 px-4 py-1.5 text-xs font-semibold text-[#22c55e] shadow-[0_0_15px_rgba(34,197,94,0.2)]">
            <Zap size={14} className="fill-[#22c55e]" /> Freemium SaaS
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight md:text-6xl bg-gradient-to-b from-white to-gray-400 bg-clip-text text-transparent pb-2">
            Plans for focused <br className="hidden md:block" /> GATE EE preparation
          </h1>
          <p className="text-base leading-relaxed text-gray-400 md:text-lg max-w-2xl mx-auto">
            Start with a cost-optimized trial. Upgrade when you need unlimited study tools, advanced analytics, premium exports, and AI features.
          </p>
        </header>

        {/* Pricing Cards Grid */}
        <div className="grid w-full gap-8 lg:grid-cols-2 max-w-5xl mt-8">
          
          {/* TRIAL PLAN CARD (3D Subdued Style) */}
          <div className="group relative flex flex-col rounded-[2.5rem] border border-gray-800 bg-[#111216]/80 p-8 md:p-10 backdrop-blur-xl transition-all duration-500 hover:-translate-y-2 hover:border-gray-700 hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.5)]">
            {/* 3D Top Inner Edge Highlight */}
            <div className="absolute inset-0 rounded-[2.5rem] border-t border-white/5 pointer-events-none" />
            
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-white mb-2">Trial</h2>
              <p className="text-sm text-gray-400 min-h-[40px]">Included for every account with server-enforced quotas.</p>
              <div className="mt-6 flex items-baseline gap-2">
                <span className="text-5xl font-extrabold tracking-tight text-white">Free</span>
              </div>
            </div>

            <div className="flex-1 space-y-5">
              {PLAN_FEATURE_MATRIX.map((row) => (
                <div key={row.label} className="flex gap-4">
                  <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-gray-800/50 text-gray-400">
                    <Lock size={12} />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-200">{row.label}</p>
                    <p className="mt-0.5 text-xs leading-relaxed text-gray-500">{row.trial}</p>
                  </div>
                </div>
              ))}
            </div>

            <Link
              href="/login"
              className="mt-10 flex w-full items-center justify-center gap-2 rounded-xl border border-gray-700 bg-gray-800/50 py-4 text-sm font-bold text-white transition-all duration-300 hover:bg-gray-700 hover:shadow-lg active:scale-[0.98]"
            >
              Start Trial
            </Link>
          </div>

          {/* PREMIUM PLAN CARD (3D Neon/Gradient Style) */}
          <div className="group relative flex flex-col rounded-[2.5rem] border border-[#22c55e]/40 bg-[#111216] p-8 md:p-10 transition-all duration-500 hover:-translate-y-4 hover:border-[#22c55e]/70 hover:shadow-[0_40px_80px_-20px_rgba(34,197,94,0.3)] z-10">
            {/* Ambient inner gradient sprinkle */}
            <div className="absolute inset-0 rounded-[2.5rem] bg-gradient-to-br from-[#22c55e]/10 via-transparent to-transparent opacity-60 pointer-events-none" />
            {/* 3D Top Inner Edge Highlight */}
            <div className="absolute inset-0 rounded-[2.5rem] border-t border-white/10 pointer-events-none" />
            
            {/* 'Recommended' Floating Badge */}
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-[#22c55e] to-[#16a34a] px-4 py-1 text-xs font-bold uppercase tracking-wider text-black shadow-[0_0_20px_rgba(34,197,94,0.4)]">
              <ShieldCheck size={14} /> Recommended
            </div>

            <div className="mb-8 relative z-10">
              <h2 className="text-2xl font-bold text-white mb-2">Premium</h2>
              <p className="text-sm text-[#22c55e]/80 min-h-[40px]">Unlimited learning workflow for serious preparation.</p>
              <div className="mt-6 flex items-baseline gap-2">
                <span className="text-5xl font-extrabold tracking-tight text-white">{price}</span>
                <span className="text-sm font-medium text-gray-400">/ month</span>
              </div>
            </div>

            <div className="flex-1 space-y-5 relative z-10">
              {PLAN_FEATURE_MATRIX.map((row) => (
                <div key={row.label} className="flex gap-4">
                  <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#22c55e]/10 text-[#22c55e]">
                    <Check size={14} strokeWidth={3} />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white">{row.label}</p>
                    <p className="mt-0.5 text-xs leading-relaxed text-gray-400">{row.premium}</p>
                  </div>
                </div>
              ))}
            </div>

            <Link
              href="/upgrade"
              className="relative z-10 mt-10 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-b from-[#2ed166] to-[#1b9c45] py-4 text-sm font-bold text-black shadow-[0_0_20px_rgba(34,197,94,0.3)] transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_0_30px_rgba(34,197,94,0.5)] active:scale-[0.98]"
            >
              <Sparkles size={18} className="fill-black/20" /> Upgrade to Premium
            </Link>
          </div>

        </div>

        {/* Legal Footer Links */}
        <div className="mt-8 text-center text-sm text-gray-500 max-w-xl">
          By upgrading, you agree to the{" "}
          <Link href="/terms-of-service" className="text-gray-400 hover:text-white underline decoration-gray-700 underline-offset-4 transition-colors">Terms</Link>,{" "}
          <Link href="/subscription-terms" className="text-gray-400 hover:text-white underline decoration-gray-700 underline-offset-4 transition-colors">Subscription Terms</Link>, and{" "}
          <Link href="/refund-cancellation-policy" className="text-gray-400 hover:text-white underline decoration-gray-700 underline-offset-4 transition-colors">Refund & Cancellation Policy</Link>.
        </div>

      </main>
    </div>
  );
}