"use client";

import { useEffect, useMemo, useRef, useState } from "react";

import type { AdFormat } from "@/lib/ad-inventory";

import { triggerCtaSmartLink } from "./smart-link";
import { trackAdMetric } from "./track";

export type AdVariant = {
  width: number;
  height: number;
  minViewport?: number;
  maxViewport?: number;
};

type AdSlotProps = {
  slotId: string;
  format: AdFormat;
  variants: AdVariant[];
  className?: string;
  title?: string;
  smartLinkSource?: string;
};

function pickVariant(variants: AdVariant[], viewportWidth: number | null): AdVariant {
  if (viewportWidth === null) {
    return variants[0];
  }

  const match = variants.find((variant) => {
    const minOk = variant.minViewport === undefined || viewportWidth >= variant.minViewport;
    const maxOk = variant.maxViewport === undefined || viewportWidth <= variant.maxViewport;
    return minOk && maxOk;
  });

  return match ?? variants[0];
}

export function AdSlot({
  slotId,
  format,
  variants,
  className = "",
  title = "Advertisement",
  smartLinkSource,
}: AdSlotProps) {
  const slotRef = useRef<HTMLDivElement | null>(null);
  const viewedRef = useRef(false);
  const [viewportWidth, setViewportWidth] = useState<number | null>(null);

  useEffect(() => {
    const updateWidth = () => setViewportWidth(window.innerWidth);
    updateWidth();
    window.addEventListener("resize", updateWidth);
    return () => window.removeEventListener("resize", updateWidth);
  }, []);

  const activeVariant = useMemo(
    () => pickVariant(variants, viewportWidth),
    [variants, viewportWidth]
  );

  useEffect(() => {
    if (!slotRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting && entry.intersectionRatio >= 0.5 && !viewedRef.current) {
            viewedRef.current = true;
            trackAdMetric("ad_viewability", {
              slotId,
              format,
              ratio: Number(entry.intersectionRatio.toFixed(2)),
            });
          }
        }
      },
      { threshold: [0.5] }
    );

    observer.observe(slotRef.current);
    return () => observer.disconnect();
  }, [format, slotId]);

  const onClick = () => {
    if (typeof window !== "undefined") {
      triggerCtaSmartLink(window.location.pathname, smartLinkSource ?? `slot-${slotId}`);
    }
    trackAdMetric("ad_click", { slotId, format });
  };

  return (
    <div className={`mx-auto flex flex-col items-center ${className}`}>
      <p className="mb-2 text-[10px] font-semibold uppercase tracking-widest text-gray-500">
        {title}
      </p>
      <div
        ref={slotRef}
        className="overflow-hidden rounded-lg border border-gray-800 bg-[#0B0C10]"
        style={{
          width: `${activeVariant.width}px`,
          maxWidth: "100%",
          minHeight: `${activeVariant.height}px`,
          height: `${activeVariant.height}px`,
        }}
      >
        <button
          type="button"
          onClick={onClick}
          className="flex h-full w-full items-center justify-center text-xs font-semibold text-gray-300 transition-colors hover:bg-[#15161b] hover:text-white"
          data-no-popunder="true"
          aria-label={`${format} ad slot`}
        >
          {format} • {activeVariant.width}x{activeVariant.height}
        </button>
      </div>
    </div>
  );
}
