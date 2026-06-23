"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";

// Updated to expect Cashfree's session ID and your internal Order ID
type CheckoutResponse = {
  orderId: string;
  paymentSessionId: string;
};

declare global {
  interface Window {
    Cashfree?: (config: { mode: "sandbox" | "production" }) => {
      checkout: (options: { paymentSessionId: string; redirectTarget?: string }) => Promise<any>;
    };
  }
}

// Loads Cashfree v3 JS SDK
function loadCashfreeScript() {
  return new Promise<boolean>((resolve) => {
    if (window.Cashfree) return resolve(true);
    const script = document.createElement("script");
    script.src = "https://sdk.cashfree.com/js/v3/cashfree.js";
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

// Component name kept intact as requested
export function RazorpayCheckoutButton({ mode = "subscription" }: { mode?: "subscription" | "one_time" }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function startCheckout() {
    setLoading(true);
    setError(null);
    try {
      const scriptLoaded = await loadCashfreeScript();
      if (!scriptLoaded || !window.Cashfree) throw new Error("Cashfree checkout could not be loaded.");

      // 1. Call your backend to create a Cashfree Order
      const checkoutRes = await fetch("/api/billing/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mode }),
      });
      const checkout = (await checkoutRes.json()) as CheckoutResponse & { error?: string };
      if (!checkoutRes.ok) throw new Error(checkout.error ?? "Unable to start checkout.");

      // 2. Initialize Cashfree (Use "production" for live mode)
      const cashfree = window.Cashfree({
        mode: process.env.NEXT_PUBLIC_CASHFREE_ENV?.toUpperCase() === "PRODUCTION" ? "production" : "sandbox",
      });

      // 3. Open the Cashfree Modal
      const result = await cashfree.checkout({
        paymentSessionId: checkout.paymentSessionId,
        redirectTarget: "_modal", // Opens as a popup instead of redirecting the page
      });

      if (result.error) {
        setError(result.error.message ?? "Payment failed or was closed.");
        return;
      }

      // 4. Verify payment via backend once modal closes successfully
      const verifyRes = await fetch("/api/billing/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId: checkout.orderId }),
      });
      const verify = (await verifyRes.json()) as { error?: string };
      
      if (!verifyRes.ok) {
        setError(verify.error ?? "Payment verification failed.");
        return;
      }
      
      router.push("/billing?upgraded=1");
      router.refresh();
      
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
        {loading ? "Starting checkout..." : "Upgrade with Cashfree"}
      </Button>
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  );
}