"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

import { isPopunderExcludedPath } from "@/lib/ad-inventory";

import { triggerPopunder } from "./smart-link";
import { trackAdMetric } from "./track";

export function PopunderController() {
  const pathname = usePathname() ?? "/";
  const triggeredRef = useRef(false);

  useEffect(() => {
    triggeredRef.current = false;
  }, [pathname]);

  useEffect(() => {
    if (isPopunderExcludedPath(pathname)) return;

    const onFirstClick = (event: MouseEvent) => {
      if (triggeredRef.current) return;
      if (event.button !== 0) return;

      const target = event.target as HTMLElement | null;
      if (target?.closest("[data-no-popunder='true']")) return;

      const triggered = triggerPopunder(pathname, "public-first-click");
      if (triggered) {
        triggeredRef.current = true;
        trackAdMetric("ad_popunder_trigger", { pathname, trigger: "first-click" });
      }
    };

    document.addEventListener("click", onFirstClick, { capture: true });
    return () => document.removeEventListener("click", onFirstClick, { capture: true });
  }, [pathname]);

  return null;
}
