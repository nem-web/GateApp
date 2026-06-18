"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";

type CheckoutResponse = {
  mode: "subscription" | "one_time";
  keyId: string;
  orderId?: string;
  subscriptionId?: string;
  amountPaise: number;
  currency: string;
  name: string;
  description: string;
  prefill?: { name?: string; email?: string; contact?: string };
};

declare global {
  interface Window {
    Razorpay?: new (options: Record<string, unknown>) => { open: () => void };
  }
}

function loadRazorpayScript() {
  return new Promise<boolean>((resolve) => {
    if (window.Razorpay) return resolve(true);
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

export function RazorpayCheckoutButton({ mode = "subscription" }: { mode?: "subscription" | "one_time" }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function startCheckout() {
    setLoading(true);
    setError(null);
    try {
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded || !window.Razorpay) throw new Error("Razorpay checkout could not be loaded.");

      const checkoutRes = await fetch("/api/billing/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mode }),
      });
      const checkout = (await checkoutRes.json()) as CheckoutResponse & { error?: string };
      if (!checkoutRes.ok) throw new Error(checkout.error ?? "Unable to start checkout.");

      const rz = new window.Razorpay({
        key: checkout.keyId,
        name: checkout.name,
        description: checkout.description,
        amount: checkout.amountPaise,
        currency: checkout.currency,
        order_id: checkout.orderId,
        subscription_id: checkout.subscriptionId,
        prefill: checkout.prefill,
        notes: { product: "GATEPrep Pro Premium" },
        theme: { color: "#6c63ff" },
        handler: async (response: Record<string, string>) => {
          const verifyRes = await fetch("/api/billing/verify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(response),
          });
          const verify = (await verifyRes.json()) as { error?: string };
          if (!verifyRes.ok) {
            setError(verify.error ?? "Payment verification failed.");
            return;
          }
          router.push("/billing?upgraded=1");
          router.refresh();
        },
        modal: {
          ondismiss: () => setLoading(false),
        },
      });
      rz.open();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Checkout failed.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <Button type="button" onClick={startCheckout} disabled={loading} className="gap-2">
        <CreditCard size={18} />
        {loading ? "Starting checkout..." : "Upgrade with Razorpay"}
      </Button>
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  );
}
