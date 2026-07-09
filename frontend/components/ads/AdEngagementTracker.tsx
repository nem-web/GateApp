"use client";

import { useEffect } from "react";

import { trackAdMetric } from "./track";

const DEPTH_MARKS = [25, 50, 75, 100];

export function AdEngagementTracker() {
  useEffect(() => {
    const startedAt = Date.now();
    const reachedDepth = new Set<number>();
    let maxDepth = 0;

    const checkDepth = () => {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const viewport = window.innerHeight;
      const height = document.documentElement.scrollHeight;
      const denominator = Math.max(height - viewport, 1);
      const percent = Math.min(100, Math.round((scrollTop / denominator) * 100));

      maxDepth = Math.max(maxDepth, percent);

      for (const mark of DEPTH_MARKS) {
        if (percent >= mark && !reachedDepth.has(mark)) {
          reachedDepth.add(mark);
          trackAdMetric("ad_scroll_depth", { depth: mark });
        }
      }
    };

    const reportBounce = () => {
      const seconds = Math.round((Date.now() - startedAt) / 1000);
      const isBounce = seconds < 15 && maxDepth < 25;

      trackAdMetric("ad_bounce", {
        sessionSeconds: seconds,
        maxDepth,
        isBounce,
      });
    };

    const onVisibilityChange = () => {
      if (document.visibilityState === "hidden") {
        reportBounce();
      }
    };

    checkDepth();
    window.addEventListener("scroll", checkDepth, { passive: true });
    window.addEventListener("beforeunload", reportBounce);
    document.addEventListener("visibilitychange", onVisibilityChange);

    return () => {
      window.removeEventListener("scroll", checkDepth);
      window.removeEventListener("beforeunload", reportBounce);
      document.removeEventListener("visibilitychange", onVisibilityChange);
    };
  }, []);

  return null;
}
