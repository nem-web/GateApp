"use client";

import { useState, useTransition, useRef } from "react";
import { submitContactForm } from "./actions";
import { Send, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { Turnstile } from "@marsidev/react-turnstile";

export default function ContactForm() {
  const [isPending, startTransition] = useTransition();
  const [status, setStatus] = useState<{ type: "success" | "error" | null; message: string }>({ type: null, message: "" });
  const formRef = useRef<HTMLFormElement>(null);
  const [token, setToken] = useState("");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus({ type: null, message: "" });
    
    const formData = new FormData(e.currentTarget);

    if (!token) {
        setStatus({
            type: "error",
            message: "Please complete verification.",
        });
        return;
    }

    //uncomment the above lines to enable turnstile verification

    startTransition(async () => {
      const result = await submitContactForm(formData);
      
      if (result.error) {
        setStatus({ type: "error", message: result.error });
      } else if (result.success) {
        setStatus({ type: "success", message: result.message || "Sent!" });
        formRef.current?.reset(); // Clear the form on success
      }
    });
  };

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
      
      {/* Status Banner */}
      {status.type === "error" && (
        <div className="flex items-center gap-3 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
          <AlertCircle size={18} />
          <p>{status.message}</p>
        </div>
      )}
      {status.type === "success" && (
        <div className="flex items-center gap-3 p-4 rounded-xl bg-[#22C55E]/10 border border-[#22C55E]/20 text-[#22C55E] text-sm">
          <CheckCircle2 size={18} />
          <p>{status.message}</p>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label htmlFor="name" className="text-sm font-medium text-[#9CA3AF]">Full Name</label>
          <input
            id="name"
            name="name"
            type="text"
            required
            placeholder="John Doe"
            className="w-full rounded-xl border border-white/10 bg-[#0F1117] px-4 py-3.5 text-sm text-white placeholder-gray-600 transition-all focus:border-[#6C63FF]/50 focus:outline-none focus:ring-1 focus:ring-[#6C63FF]/50"
          />
        </div>
        <div className="space-y-2">
          <label htmlFor="email" className="text-sm font-medium text-[#9CA3AF]">Email Address</label>
          <input
            id="email"
            name="email"
            type="email"
            required
            placeholder="john@example.com"
            className="w-full rounded-xl border border-white/10 bg-[#0F1117] px-4 py-3.5 text-sm text-white placeholder-gray-600 transition-all focus:border-[#6C63FF]/50 focus:outline-none focus:ring-1 focus:ring-[#6C63FF]/50"
          />
        </div>
      </div>

      <div className="space-y-2">
        <label htmlFor="subject" className="text-sm font-medium text-[#9CA3AF]">Subject</label>
        <input
          id="subject"
          name="subject"
          type="text"
          required
          placeholder="How can we help you?"
          className="w-full rounded-xl border border-white/10 bg-[#0F1117] px-4 py-3.5 text-sm text-white placeholder-gray-600 transition-all focus:border-[#6C63FF]/50 focus:outline-none focus:ring-1 focus:ring-[#6C63FF]/50"
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="message" className="text-sm font-medium text-[#9CA3AF]">Message</label>
        <textarea
          id="message"
          name="message"
          required
          rows={5}
          placeholder="Tell us more about your query..."
          className="w-full rounded-xl border border-white/10 bg-[#0F1117] px-4 py-3.5 text-sm text-white placeholder-gray-600 transition-all focus:border-[#6C63FF]/50 focus:outline-none focus:ring-1 focus:ring-[#6C63FF]/50 resize-y"
        />
      </div>

      <Turnstile
        siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY!}
        onSuccess={(token) => setToken(token)}
        />

        <input
        type="hidden"
        name="cf-turnstile-response"
        value={token}
        />

      <button
        type="submit"
        disabled={isPending}
        className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-xl bg-[#6C63FF] px-8 py-3.5 text-sm font-bold text-white transition-all hover:bg-[#6C63FF]/90 hover:shadow-[0_0_20px_rgba(108,99,255,0.3)] disabled:opacity-50 disabled:cursor-not-allowed active:scale-95"
      >
        {isPending ? (
          <>
            <Loader2 size={18} className="animate-spin" /> Sending...
          </>
        ) : (
          <>
            Send Message <Send size={18} />
          </>
        )}
      </button>
    </form>
  );
}