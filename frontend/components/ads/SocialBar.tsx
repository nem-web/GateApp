"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { X } from "lucide-react";

import { triggerSocialBarSmartLink } from "./smart-link";
import { trackAdMetric } from "./track";

export function SocialBar() {
  const [dismissed, setDismissed] = useState(false);
  const pathname = usePathname() ?? "/";

  if (dismissed) return null;

  const onOfferClick = () => {
    const opened = triggerSocialBarSmartLink(pathname, "social-bar-cta");
    if (opened) {
      trackAdMetric("ad_social_bar_click", { pathname });
    }
  };

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-gray-800 bg-[#0B0C10]/95 backdrop-blur">
      <div className="mx-auto flex h-12 w-full max-w-7xl items-center justify-between gap-3 px-4 sm:px-6 lg:px-8">
        <p className="truncate text-xs font-medium text-gray-200 sm:text-sm">
          New prep deals live now — tap to unlock curated offers.
        </p>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onOfferClick}
            className="rounded-md bg-[#22c55e] px-3 py-1.5 text-xs font-semibold text-black transition-colors hover:bg-[#22c55e]/90"
            data-no-popunder="true"
          >
            Open
          </button>
          <button
            type="button"
            onClick={() => setDismissed(true)}
            className="rounded-md p-1 text-gray-400 transition-colors hover:bg-gray-800 hover:text-white"
            aria-label="Dismiss social bar"
            data-no-popunder="true"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
