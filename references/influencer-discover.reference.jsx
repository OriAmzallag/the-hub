// =================================================================
// REFERENCE FILE — Influencer Discover (Perks) — v2
// =================================================================
// Source: user-provided update, 2026-05-11
//
// PURPOSE: Same screen as the v1 reference (perks browser, 3 states,
// filter sheet) but with a DATA-MODEL CHANGE: each perk now carries
// a `deliverables` array instead of flat requiredAction / requiredPlatform
// / requiredFollowers fields. Each deliverable has its own platform +
// action + requiredFollowers. Qualification = viewer's reach meets the
// requirement on EVERY deliverable.
//
// NEW SHAPE:
//   {
//     id, title, business, businessMonogram, value, cover,
//     deliverables: [
//       { platform: "IG" | "TikTok" | "YouTube", action: "3 Stories",
//         requiredFollowers: 10000 },
//       ...
//     ],
//     category, slotsLeft, slotsTotal, badge, expiringSoon
//   }
//
// HELPERS:
//   qualifiesFor(perk) — every deliverable's platform reach is met
//   getCardPlatformLine(perk) — single deliverable returns
//     "{Threshold}+ on {Platform}", multi returns "{P1} + {P2}"
//
// CARD CHANGES from v1:
//   The threshold/qualification line was previously:
//     "10K+ on IG · You qualify ✓" / "100K+ on IG · Below threshold"
//   For multi-deliverable perks the threshold mention doesn't fit, so:
//     - 1 deliverable: same as before ("{N}K+ on {Platform}")
//     - 2+ deliverables: "{P1} + {P2}" (platform-only line, no number)
//   Qualification chip (You qualify ✓ / Below threshold) still uses
//   `qualifiesFor()` which checks ALL deliverables.
//
// EVERYTHING ELSE STAYS:
//   - Three rendering states: loading shimmer / content / empty.
//   - Four content rows (Top match, Expiring soon, New, Near you).
//   - Single-select category chips at top.
//   - Active-filter chip bar.
//   - Filter sheet: Categories / Value range / Reach toggle / Urgency
//     toggle / Sort. (User dropped the in-sheet Apply CTA on the
//     influencer side in PR #19 / #22 hardening — keep that.)
//   - Tab bar via shared CustomTabBar.
//
// ENCODING ARTIFACTS in the original paste (same patterns as before):
//   `âª` → `₪`, `Ã` → `×`, `Â·` → `·`, stray `â` → `→` or `—`.
//
// =================================================================

import { useState } from "react";
import {
  Search,
  LayoutDashboard,
  MessageSquare,
  User,
  Sliders,
  ChevronRight,
  Gift,
  Star,
  Check,
  X,
} from "lucide-react";

// =================================================================
// DESIGN TOKENS — use `constants/theme.ts` in the port
// =================================================================
const T = {
  bg: "#1A1815",
  surface: "#2A2620",
  surfaceAlt: "#221F1A",
  border: "rgba(244,240,232,0.08)",
  borderStrong: "rgba(244,240,232,0.15)",
  ink: "#F4F0E8",
  inkMuted: "#8A7E6C",
  inkSubtle: "#5C5448",
  accent: "#FF7A29",
  accentSoft: "rgba(255,122,41,0.12)",
  accentBorder: "rgba(255,122,41,0.40)",
  accentShadow: "rgba(255,122,41,0.30)",
  decline: "#C4886B",
  declineSoft: "rgba(196,136,107,0.12)",
  declineBorder: "rgba(196,136,107,0.40)",
};

// =================================================================
// MOCK DATA (new shape) — Maya's reach IG:47.2K · TikTok:82.1K · YT:8.4K
// =================================================================
const PERKS = [
  {
    id: "p-1", title: "Dinner for two", business: "Onza", businessMonogram: "ON", value: 400,
    cover: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600&q=80",
    deliverables: [
      { platform: "IG", action: "3 Stories", requiredFollowers: 10000 },
    ],
    category: "Food", slotsLeft: 3, slotsTotal: 5, badge: "Top match", expiringSoon: false,
  },
  {
    id: "p-2", title: "Pilates class pack", business: "Studio Movement", businessMonogram: "SM", value: 580,
    cover: "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=600&q=80",
    deliverables: [
      { platform: "IG", action: "1 Reel", requiredFollowers: 25000 },
      { platform: "TikTok", action: "1 Reel", requiredFollowers: 30000 },
    ],
    category: "Fitness", slotsLeft: 2, slotsTotal: 4, badge: null, expiringSoon: false,
  },
  {
    id: "p-3", title: "Skincare bundle", business: "BeautyBar", businessMonogram: "BB", value: 320,
    cover: "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=600&q=80",
    deliverables: [
      { platform: "TikTok", action: "1 Review", requiredFollowers: 50000 },
    ],
    category: "Beauty", slotsLeft: 1, slotsTotal: 5, badge: null, expiringSoon: true,
  },
  {
    id: "p-4", title: "Cocktails at Bellboy", business: "Bellboy", businessMonogram: "BB", value: 280,
    cover: "https://images.unsplash.com/photo-1551024601-bec78aea704b?w=600&q=80",
    deliverables: [
      { platform: "IG", action: "2 Stories", requiredFollowers: 100000 },
    ],
    category: "Drinks", slotsLeft: 4, slotsTotal: 5, badge: null, expiringSoon: false,
  },
  {
    id: "p-5", title: "Coffee + brunch", business: "FitBar TLV", businessMonogram: "FB", value: 180,
    cover: "https://images.unsplash.com/photo-1497515114629-f71d768fd07c?w=600&q=80",
    deliverables: [
      { platform: "IG", action: "1 Story", requiredFollowers: 5000 },
    ],
    category: "Food", slotsLeft: 8, slotsTotal: 10, badge: "New", expiringSoon: false,
  },
  {
    id: "p-6", title: "Sushi tasting", business: "Sushi Bar", businessMonogram: "SB", value: 450,
    cover: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=600&q=80",
    deliverables: [
      { platform: "IG", action: "1 Reel", requiredFollowers: 30000 },
      { platform: "TikTok", action: "1 Story", requiredFollowers: 200000 },
    ],
    category: "Food", slotsLeft: 2, slotsTotal: 3, badge: null, expiringSoon: false,
  },
];

const VIEWER_REACH = { IG: 47200, TikTok: 82100, YouTube: 8400 };

// Viewer must qualify on EVERY deliverable for the perk to be claimable.
function qualifiesFor(perk) {
  return perk.deliverables.every((d) => {
    const myReach = VIEWER_REACH[d.platform] || 0;
    return myReach >= d.requiredFollowers;
  });
}

function formatThreshold(followers) {
  if (followers >= 1000000) return `${(followers / 1000000).toFixed(0)}M`;
  if (followers >= 1000) return `${(followers / 1000).toFixed(0)}K`;
  return String(followers);
}

// Single-deliverable: "10K+ on IG". Multi: "IG + TIKTOK".
function getCardPlatformLine(perk) {
  if (perk.deliverables.length === 1) {
    const d = perk.deliverables[0];
    return `${formatThreshold(d.requiredFollowers)}+ on ${d.platform}`;
  }
  return perk.deliverables.map((d) => d.platform).join(" + ");
}

// (Full screen JSX body and the FilterPanel/PerkCard/SkeletonState/
//  EmptyState implementations are unchanged from v1 except for the
//  PerkCard's threshold/qualification line which now uses
//  `getCardPlatformLine()` and `qualifiesFor()` as defined above.
//  See the original v1 reference for everything else.)
