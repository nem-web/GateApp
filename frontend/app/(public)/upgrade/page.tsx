import Link from "next/link";
import type { Metadata } from "next";
import { ArrowRight, ShieldCheck, Sparkles, LockKeyhole } from "lucide-react";
import { RazorpayCheckoutButton } from "@/components/RazorpayCheckoutButton";
import { JsonLd, absoluteUrl, createMetadata } from "@/lib/seo";
import { PLAN_FEATURE_MATRIX, PREMIUM_AMOUNT_PAISE, formatCurrencyPaise } from "@/lib/subscription";

export const metadata: Metadata = createMetadata({
  title: "Upgrade to Premium | GATEPrep Pro",
  description: "Upgrade GATEPrep Pro with Razorpay-secured checkout for unlimited study tools, advanced analytics, exports, and study planning.",
  path: "/upgrade",
});

export default function UpgradePage() {
  const price = formatCurrencyPaise(PREMIUM_AMOUNT_PAISE);

  return (
    <div className="relative min-h-screen bg-[#0e0f14] text-white font-sans overflow-hidden selection:bg-[#22c55e]/30">
      
      {/* Background 3D Ambient "Sprinkle" Gradients */}
      <div className="absolute top-[-10%] left-[-10%] w-[800px] h-[600px] bg-[#22c55e]/10 blur-[150px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[500px] bg-blue-500/10 blur-[150px] rounded-full pointer-events-none" />

      {/* Structured Data for SEO */}
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "CheckoutPage",
          name: "Upgrade to GATEPrep Pro Premium",
          url: absoluteUrl("/upgrade"),
        }}
      />

      <main className="relative z-10 mx-auto grid w-full max-w-6xl gap-12 px-4 py-16 md:py-24 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16 items-start">
        
        {/* LEFT COLUMN: Info & Feature Grid */}
        <section className="space-y-8">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-gray-700 bg-gray-800/50 px-4 py-1.5 text-xs font-semibold text-gray-300 shadow-sm backdrop-blur-md">
              <LockKeyhole size={14} className="text-[#22c55e]" /> Secure Cashfree checkout
            </div>
            <h1 className="text-4xl font-extrabold tracking-tight md:text-5xl lg:text-6xl bg-gradient-to-br from-white to-gray-400 bg-clip-text text-transparent pb-2">
              Unlock the full <br /> study system
            </h1>
            <p className="max-w-xl text-base leading-relaxed text-gray-400 md:text-lg">
              Premium removes trial bottlenecks across AI, notes, flashcards, PYQs, mock tests, timetable generation, analytics, exports, and storage.
            </p>
          </div>

          {/* 3D Glassmorphic Feature Grid */}
          <div className="grid gap-4 sm:grid-cols-2 pt-2">
            {PLAN_FEATURE_MATRIX.slice(0, 6).map((row) => (
              <div 
                key={row.label} 
                className="group relative overflow-hidden rounded-2xl border border-gray-800 bg-[#111216]/60 p-5 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-[#22c55e]/30 hover:bg-[#111216] hover:shadow-[0_10px_30px_-10px_rgba(34,197,94,0.15)]"
              >
                {/* Inner Top Edge Highlight for 3D effect */}
                <div className="absolute inset-0 rounded-2xl border-t border-white/5 pointer-events-none" />
                <p className="font-semibold text-white">{row.label}</p>
                <p className="mt-1.5 text-xs leading-relaxed text-gray-400 group-hover:text-gray-300 transition-colors">
                  {row.premium}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* RIGHT COLUMN: Premium Checkout Card */}
        <div className="relative group perspective-1000">
          <div className="relative flex flex-col rounded-[2.5rem] border border-[#22c55e]/40 bg-[#111216] p-8 md:p-10 transition-all duration-500 hover:-translate-y-2 hover:border-[#22c55e]/60 shadow-[0_20px_60px_-15px_rgba(34,197,94,0.2)] hover:shadow-[0_40px_80px_-20px_rgba(34,197,94,0.3)] z-10">
            
            {/* Ambient inner gradient sprinkle */}
            <div className="absolute inset-0 rounded-[2.5rem] bg-gradient-to-br from-[#22c55e]/10 via-transparent to-transparent opacity-60 pointer-events-none" />
            
            {/* 3D Top Inner Edge Highlight */}
            <div className="absolute inset-0 rounded-[2.5rem] border-t border-white/10 pointer-events-none" />

            <div className="relative z-10 space-y-8">
              
              {/* Card Header */}
              <div>
                <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-[#22c55e] to-[#16a34a] text-black shadow-[0_0_20px_rgba(34,197,94,0.4)]">
                  <Sparkles size={24} className="fill-black/20" />
                </div>
                <h2 className="text-2xl font-bold text-white">Premium Access</h2>
                <p className="mt-2 text-sm text-[#22c55e]/80">Monthly access. Server-side payment verification.</p>
                <div className="mt-6 flex items-baseline gap-2">
                  <span className="text-5xl font-extrabold tracking-tight text-white">{price}</span>
                  <span className="text-sm font-medium text-gray-400">/ month</span>
                </div>
              </div>

              {/* Action & Verification Box */}
              <div className="space-y-6 pt-2">
                <div className="w-full relative z-20">
                  <RazorpayCheckoutButton />
                </div>

                <div className="relative overflow-hidden rounded-xl border border-gray-800 bg-[#0B0C10] p-5">
                  <div className="absolute inset-0 border-t border-white/5 pointer-events-none" />
                  <div className="mb-2 flex items-center gap-2 text-sm font-bold text-white">
                    <ShieldCheck size={18} className="text-[#22c55e]" />
                    Payment safety
                  </div>
                  <p className="text-xs leading-relaxed text-gray-400">
                    Access is activated only after server-side Cashfree signature verification or a verified webhook. We do not trust client-only payment success.
                  </p>
                </div>
              </div>

              {/* Footer Links */}
              <div className="pt-4 border-t border-gray-800/60 space-y-4">
                <Link 
                  href="/pricing" 
                  className="group inline-flex items-center gap-2 text-sm font-semibold text-[#22c55e] transition-colors hover:text-[#22c55e]/80"
                >
                  Compare plans <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
                </Link>
                <p className="text-xs leading-relaxed text-gray-500">
                  By continuing you agree to the{" "}
                  <Link href="/subscription-terms" className="text-gray-400 hover:text-white underline decoration-gray-700 underline-offset-4 transition-colors">Subscription Terms</Link> and{" "}
                  <Link href="/refund-cancellation-policy" className="text-gray-400 hover:text-white underline decoration-gray-700 underline-offset-4 transition-colors">Refund Policy</Link>.
                </p>
              </div>

            </div>
          </div>
        </div>

      </main>
    </div>
  );
}