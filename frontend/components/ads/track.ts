"use client";

type MetricPayload = Record<string, string | number | boolean | null | undefined>;

declare global {
  interface Window {
    dataLayer?: Array<Record<string, unknown>>;
    gtag?: (...args: unknown[]) => void;
  }
}

export function trackAdMetric(eventName: string, payload: MetricPayload = {}) {
  if (typeof window === "undefined") return;

  const eventPayload = {
    event: eventName,
    ...payload,
  };

  window.dataLayer?.push(eventPayload);

  if (typeof window.gtag === "function") {
    window.gtag("event", eventName, payload);
  }
}
