"use client";

import Link from "next/link";
import type { ComponentProps, MouseEvent } from "react";

import { triggerCtaSmartLink } from "./smart-link";
import { trackAdMetric } from "./track";

type SmartLinkLinkProps = Omit<ComponentProps<typeof Link>, "onClick"> & {
  smartLinkSource: string;
  triggerOnClick?: boolean;
  onClick?: (event: MouseEvent<HTMLAnchorElement>) => void;
};

export function SmartLinkLink({
  smartLinkSource,
  triggerOnClick = true,
  onClick,
  ...props
}: SmartLinkLinkProps) {
  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(event);

    if (!triggerOnClick || typeof window === "undefined") return;

    const opened = triggerCtaSmartLink(window.location.pathname, smartLinkSource);
    if (opened) {
      trackAdMetric("ad_smartlink_click", { source: smartLinkSource });
    }
  };

  return <Link {...props} data-no-popunder="true" onClick={handleClick} />;
}
