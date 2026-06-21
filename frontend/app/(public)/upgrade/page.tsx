import Link from "next/link";
import type { Metadata } from "next";
import { ArrowRight, ShieldCheck, Sparkles } from "lucide-react";
import { RazorpayCheckoutButton } from "@/components/RazorpayCheckoutButton";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { JsonLd, absoluteUrl, createMetadata } from "@/lib/seo";
import { PLAN_FEATURE_MATRIX, PREMIUM_AMOUNT_PAISE, formatCurrencyPaise } from "@/lib/subscription";

export const metadata: Metadata = createMetadata({
  title: "Upgrade to Premium",
  description: "Upgrade GATEPrep Pro with Razorpay-secured checkout for unlimited study tools, advanced analytics, exports, and study planning.",
  path: "/upgrade",
});

export default function UpgradePage() {
  const price = formatCurrencyPaise(PREMIUM_AMOUNT_PAISE);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "CheckoutPage",
          name: "Upgrade to GATEPrep Pro Premium",
          url: absoluteUrl("/upgrade"),
        }}
      />
      <main className="mx-auto grid w-full max-w-6xl gap-6 px-4 py-10 md:py-14 lg:grid-cols-[1.1fr_0.9fr]">
        <section className="space-y-5">
          <Badge variant="outline" className="w-fit">Secure Razorpay checkout</Badge>
          <h1 className="text-3xl font-semibold tracking-tight md:text-5xl">Unlock the full study system</h1>
          <p className="max-w-2xl text-base leading-7 text-muted-foreground md:text-lg">
            Premium removes trial bottlenecks across AI, notes, flashcards, PYQs, mock tests, timetable generation, analytics, exports, and storage.
          </p>
          <div className="grid gap-3 sm:grid-cols-2">
            {PLAN_FEATURE_MATRIX.slice(0, 6).map((row) => (
              <div key={row.label} className="rounded-lg border border-border bg-card p-4">
                <p className="font-medium">{row.label}</p>
                <p className="mt-1 text-sm text-muted-foreground">{row.premium}</p>
              </div>
            ))}
          </div>
        </section>

        <Card className="h-fit border-primary/40">
          <CardHeader>
            <div className="flex size-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Sparkles />
            </div>
            <CardTitle>Premium</CardTitle>
            <CardDescription>Monthly access. Server-side payment verification.</CardDescription>
            <p className="text-3xl font-semibold">{price}<span className="text-sm font-normal text-muted-foreground"> / month</span></p>
          </CardHeader>
          <CardContent className="space-y-5">
            <RazorpayCheckoutButton />
            <div className="rounded-lg border border-border bg-secondary/40 p-4 text-sm text-muted-foreground">
              <div className="mb-2 flex items-center gap-2 font-medium text-foreground">
                <ShieldCheck size={17} />
                Payment safety
              </div>
              Access is activated only after server-side Razorpay signature verification or a verified webhook. We do not trust client-only payment success.
            </div>
            <Link href="/pricing" className="inline-flex items-center gap-2 text-sm text-primary">
              Compare plans <ArrowRight size={16} />
            </Link>
            <p className="text-xs leading-5 text-muted-foreground">
              By continuing you agree to the <Link href="/subscription-terms" className="underline">Subscription Terms</Link> and{" "}
              <Link href="/refund-cancellation-policy" className="underline">Refund Policy</Link>.
            </p>
          </CardContent>
        </Card>
      </main>    </div>
  );
}
