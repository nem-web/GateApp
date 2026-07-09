"use client";

import { AD_INVENTORY, SMART_LINK_URL, isPopunderExcludedPath } from "@/lib/ad-inventory";

const STORAGE_PREFIX = "gateapp.ad.";

type TriggerOptions = {
  source: string;
  pathname: string;
  storageKey: "popunder" | "smart-link" | "social-bar";
  cooldownMinutes: number;
  perDayCap: number;
};

type FrequencyState = {
  dayKey: string;
  dailyCount: number;
  lastTriggeredAt: number;
};

function readFrequencyState(storageKey: string): FrequencyState {
  if (typeof window === "undefined") {
    return { dayKey: "", dailyCount: 0, lastTriggeredAt: 0 };
  }

  try {
    const raw = localStorage.getItem(`${STORAGE_PREFIX}${storageKey}`);
    if (!raw) return { dayKey: "", dailyCount: 0, lastTriggeredAt: 0 };
    const parsed = JSON.parse(raw) as FrequencyState;
    return {
      dayKey: parsed.dayKey ?? "",
      dailyCount: parsed.dailyCount ?? 0,
      lastTriggeredAt: parsed.lastTriggeredAt ?? 0,
    };
  } catch {
    return { dayKey: "", dailyCount: 0, lastTriggeredAt: 0 };
  }
}

function writeFrequencyState(storageKey: string, state: FrequencyState) {
  if (typeof window === "undefined") return;

  localStorage.setItem(`${STORAGE_PREFIX}${storageKey}`, JSON.stringify(state));
}

function canTriggerWithCaps({
  storageKey,
  cooldownMinutes,
  perDayCap,
}: Omit<TriggerOptions, "pathname" | "source">): boolean {
  const state = readFrequencyState(storageKey);
  const now = Date.now();
  const today = new Date().toISOString().slice(0, 10);
  const isSameDay = state.dayKey === today;
  const dailyCount = isSameDay ? state.dailyCount : 0;
  const cooldownMs = cooldownMinutes * 60 * 1000;

  if (dailyCount >= perDayCap) return false;
  if (state.lastTriggeredAt && now - state.lastTriggeredAt < cooldownMs) return false;
  return true;
}

function markTriggered(storageKey: TriggerOptions["storageKey"]) {
  const state = readFrequencyState(storageKey);
  const today = new Date().toISOString().slice(0, 10);
  const isSameDay = state.dayKey === today;

  writeFrequencyState(storageKey, {
    dayKey: today,
    dailyCount: isSameDay ? state.dailyCount + 1 : 1,
    lastTriggeredAt: Date.now(),
  });
}

export function triggerSmartLink({
  source,
  pathname,
  storageKey,
  cooldownMinutes,
  perDayCap,
}: TriggerOptions): boolean {
  if (typeof window === "undefined") return false;
  if (isPopunderExcludedPath(pathname) && storageKey === "popunder") return false;
  if (!canTriggerWithCaps({ storageKey, cooldownMinutes, perDayCap })) return false;

  const opened = window.open(SMART_LINK_URL, "_blank", "noopener,noreferrer");
  if (!opened) return false;

  markTriggered(storageKey);
  window.dataLayer?.push({
    event: "ad_smartlink_open",
    source,
    storageKey,
    pathname,
  });

  return true;
}

export function triggerPopunder(pathname: string, source: string) {
  const cap = AD_INVENTORY.popunder.frequencyCap;
  return triggerSmartLink({
    source,
    pathname,
    storageKey: "popunder",
    cooldownMinutes: cap.cooldownMinutes ?? 720,
    perDayCap: cap.perDay ?? 2,
  });
}

export function triggerCtaSmartLink(pathname: string, source: string) {
  const cap = AD_INVENTORY.smartLink.frequencyCap;
  return triggerSmartLink({
    source,
    pathname,
    storageKey: "smart-link",
    cooldownMinutes: cap.cooldownMinutes ?? 45,
    perDayCap: cap.perDay ?? 6,
  });
}

export function triggerSocialBarSmartLink(pathname: string, source: string) {
  const cap = AD_INVENTORY.socialBar.frequencyCap;
  return triggerSmartLink({
    source,
    pathname,
    storageKey: "social-bar",
    cooldownMinutes: cap.cooldownMinutes ?? 10,
    perDayCap: cap.perDay ?? 12,
  });
}
