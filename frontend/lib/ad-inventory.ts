export type AdFormat =
  | "popunder"
  | "smart-link"
  | "native-banner-4x1"
  | "social-bar"
  | "banner-468x60"
  | "banner-160x300"
  | "banner-320x50"
  | "banner-728x90"
  | "banner-160x600"
  | "banner-300x250";

export type DeviceTarget = "mobile" | "tablet" | "desktop" | "all";

type FrequencyCap = {
  perSession?: number;
  perDay?: number;
  cooldownMinutes?: number;
};

type AdInventoryItem = {
  format: AdFormat;
  allowedPages: string[];
  deviceTarget: DeviceTarget;
  frequencyCap: FrequencyCap;
  notes: string;
};

export const SMART_LINK_URL =
  "https://contributionhobblenewlywed.com/pjtunbqg?key=b68676a7db6a4e11212b741582e8bc38";

export const AD_INVENTORY: Record<string, AdInventoryItem> = {
  popunder: {
    format: "popunder",
    allowedPages: ["/", "/blog", "/resources", "/features", "/about", "/pricing"],
    deviceTarget: "all",
    frequencyCap: { perSession: 1, perDay: 2, cooldownMinutes: 720 },
    notes: "First-click only and disabled on auth, checkout, and study flows.",
  },
  smartLink: {
    format: "smart-link",
    allowedPages: ["/", "/blog", "/resources", "/features", "/pricing"],
    deviceTarget: "all",
    frequencyCap: { perSession: 2, perDay: 6, cooldownMinutes: 45 },
    notes: "Attached to selected public CTAs only.",
  },
  socialBar: {
    format: "social-bar",
    allowedPages: ["/", "/blog", "/resources", "/features", "/pricing"],
    deviceTarget: "all",
    frequencyCap: { perSession: 3, perDay: 12, cooldownMinutes: 10 },
    notes: "Sticky low-height bar in public layout.",
  },
  native4x1: {
    format: "native-banner-4x1",
    allowedPages: ["/blog", "/resources"],
    deviceTarget: "all",
    frequencyCap: { perSession: 4, perDay: 20, cooldownMinutes: 0 },
    notes: "Placed inside content feeds to match card flow.",
  },
  banner728x90: {
    format: "banner-728x90",
    allowedPages: ["/"],
    deviceTarget: "desktop",
    frequencyCap: { perSession: 3, perDay: 20, cooldownMinutes: 0 },
    notes: "Primary homepage leaderboard.",
  },
  banner320x50: {
    format: "banner-320x50",
    allowedPages: ["/"],
    deviceTarget: "mobile",
    frequencyCap: { perSession: 4, perDay: 20, cooldownMinutes: 0 },
    notes: "Mobile fallback for leaderboard positions.",
  },
  banner468x60: {
    format: "banner-468x60",
    allowedPages: ["/"],
    deviceTarget: "tablet",
    frequencyCap: { perSession: 3, perDay: 20, cooldownMinutes: 0 },
    notes: "Mid-page inline placement between sections.",
  },
  banner300x250: {
    format: "banner-300x250",
    allowedPages: ["/"],
    deviceTarget: "all",
    frequencyCap: { perSession: 3, perDay: 20, cooldownMinutes: 0 },
    notes: "Inline content block placement.",
  },
  banner160x600: {
    format: "banner-160x600",
    allowedPages: ["/blog", "/resources"],
    deviceTarget: "desktop",
    frequencyCap: { perSession: 2, perDay: 12, cooldownMinutes: 0 },
    notes: "Large-screen side rail primary slot.",
  },
  banner160x300: {
    format: "banner-160x300",
    allowedPages: ["/blog", "/resources"],
    deviceTarget: "desktop",
    frequencyCap: { perSession: 2, perDay: 12, cooldownMinutes: 0 },
    notes: "Large-screen side rail secondary slot.",
  },
};

const POPUNDER_EXCLUDED_PREFIXES = [
  "/login",
  "/billing",
  "/dashboard",
  "/study-plan",
  "/test",
  "/notes",
  "/lectures",
  "/flashcards",
  "/todos",
  "/admin",
  "/api",
];

export function isPopunderExcludedPath(pathname: string): boolean {
  return POPUNDER_EXCLUDED_PREFIXES.some((prefix) =>
    pathname.startsWith(prefix)
  );
}
