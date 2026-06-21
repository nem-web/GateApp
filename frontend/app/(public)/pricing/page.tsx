import Link from "next/link";
import type { Metadata } from "next";
import { Check, Lock, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { JsonLd, absoluteUrl, createMetadata } from "@/lib/seo";
import { PLAN_FEATURE_MATRIX, formatCurrencyPaise, PREMIUM_AMOUNT_PAISE } from "@/lib/subscription";

export const metadata: Metadata = createMetadata({
  title: "Pricing",
  description: "Compare GATEPrep Pro Trial and Premium plans with AI, notes, PYQs, tests, analytics, storage, exports, and study planner access.",
  path: "/pricing",
});

export default function PricingPage() {
  const price = formatCurrencyPaise(PREMIUM_AMOUNT_PAISE);

  return (
    <div className="min-h-screen bg-background text-foreground">
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
      <main className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 py-10 md:py-14">
        <header className="max-w-3xl space-y-4">
          <Badge variant="outline" className="w-fit">Freemium SaaS</Badge>
          <h1 className="text-3xl font-semibold tracking-tight md:text-5xl">Plans for focused GATE EE preparation</h1>
          <p className="text-base leading-7 text-muted-foreground md:text-lg">
            Start with a cost-optimized trial. Upgrade when you need unlimited study tools, advanced analytics, premium exports, and future Premium features.
          </p>
        </header>

        <div className="grid gap-4 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Trial</CardTitle>
              <CardDescription>Included for every account with server-enforced quotas.</CardDescription>
              <p className="text-3xl font-semibold">Free</p>
            </CardHeader>
            <CardContent className="space-y-3">
              {PLAN_FEATURE_MATRIX.map((row) => (
                <div key={row.label} className="flex gap-3 text-sm">
                  <Lock size={16} className="mt-0.5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">{row.label}</p>
                    <p className="text-muted-foreground">{row.trial}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="border-primary/40">
            <CardHeader>
              <Badge className="w-fit">Recommended</Badge>
              <CardTitle>Premium</CardTitle>
              <CardDescription>Unlimited learning workflow for serious preparation.</CardDescription>
              <p className="text-3xl font-semibold">{price}<span className="text-sm font-normal text-muted-foreground"> / month</span></p>
            </CardHeader>
            <CardContent className="space-y-3">
              {PLAN_FEATURE_MATRIX.map((row) => (
                <div key={row.label} className="flex gap-3 text-sm">
                  <Check size={16} className="mt-0.5 text-primary" />
                  <div>
                    <p className="font-medium">{row.label}</p>
                    <p className="text-muted-foreground">{row.premium}</p>
                  </div>
                </div>
              ))}
              <Button asChild className="mt-4 w-full gap-2">
                <Link href="/upgrade"><Sparkles size={18} /> Upgrade</Link>
              </Button>
            </CardContent>
          </Card>
        </div>

        <p className="text-sm text-muted-foreground">
          By upgrading, you agree to the <Link href="/terms-of-service" className="underline">Terms</Link>,{" "}
          <Link href="/subscription-terms" className="underline">Subscription Terms</Link>, and{" "}
          <Link href="/refund-cancellation-policy" className="underline">Refund & Cancellation Policy</Link>.
        </p>
      </main>    </div>
  );
}
