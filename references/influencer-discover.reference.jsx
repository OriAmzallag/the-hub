// =================================================================
// REFERENCE FILE — Influencer Discover (Perks)
// =================================================================
// Source: user-provided reference, 2026-05-11
//
// PURPOSE: Visual + behavioral reference for the Influencer-side
// Discover tab. THIS IS NOT THE BUSINESS DISCOVER. The Business
// Discover is "find an influencer to book". The Influencer Discover
// is "browse perks (offers from businesses) I can claim in exchange
// for a defined social action".
//
// React Native + Reanimated + StyleSheet only. Use existing tokens
// from constants/theme.ts. Honor the locked design-system rules:
//   - one accent (#FF7A29) only — no red anywhere; for the "Below
//     threshold" qualification status use `colors.decline` per
//     reference (decline = warm muted, not red)
//   - mono = system voice (uppercase, tracked) — used here for the
//     row subtitles, badges, business names on cards, required action,
//     follower thresholds, and the "filters active" status line
//   - numbers ALWAYS paired with a label — value chip is ₪{n} with
//     no naked numbers (followers chip = "{N}K+ on {Platform}")
//   - avatars / image tiles are rounded squares; the perk cover is
//     a 4:5 image with radius 14 (matches `radii.card`)
//
// SCREEN STATES (three):
//   1. loading  — skeleton shimmer rows (use the standard shimmer
//                 recipe; 2 skeleton cards visible per row, 3 rows)
//   2. content  — real perk rows (default)
//   3. empty    — when filters/category combination yields no perks.
//                 Centered display-L headline "Try widening / your
//                 search." (two lines), mono caption "NO PERKS MATCH",
//                 body copy explaining what to drop, primary accent
//                 pill "Reset filters" that clears everything.
//
// SCREEN STRUCTURE (top → bottom):
//
//   - Header bar (NOT shared ScreenHeader because of the filter
//     button + badge; can either use ScreenHeader + a right slot, or
//     a bespoke header that copies the same vertical metrics as
//     ScreenHeader for parity). Title "Discover" (sectionTitle), 38×38
//     accent-soft filter button on the right with a count badge when
//     filters are active.
//
//   - Category chips (horizontal scroll, single-select). Default chips:
//     ["All", "Food", "Fitness", "Beauty", "Lifestyle", "Wellness",
//      "Drinks"]. Active chip = solid accent + accent shadow + bg
//     text; inactive = surface + border + ink text.
//
//   - Active filter chip bar (only rendered when hasActiveFilters AND
//     not loading). Mono accent "{N} FILTERS ACTIVE" with a mono
//     inkMuted "CLEAR ALL" affordance on the right. Below: horizontal
//     scroll of accentSoft pills, each "Label × " removable by tap.
//     Sources of chips: each selected category, value range (when not
//     default 0/1000), "I qualify", "Expiring soon", any non-default
//     sort selection.
//
//   - Body (ScrollView): a stack of PerkRow sections. Each row =
//     display title (20/700/-0.035em) + optional mono accent subtitle
//     + mono inkMuted "SEE ALL →" button. Below: horizontal scroll
//     of PerkCards.
//
//   - Tab bar — uses the shared CustomTabBar already in place. NO new
//     work needed there.
//
//   - Filter sheet (bottom sheet, 92% max height) — described in
//     detail below.
//
// PERK CARD (200px wide):
//   - Cover: 4:5 aspect, radius 14, 1px borderStrong.
//     - Top-left badge: when `badge` is set OR `expiringSoon` is true.
//       Frosted dark pill (`bg` at 0.85 alpha + blur) with accentBorder
//       and mono accent label (9px / 0.18em / 600). Labels: the perk's
//       own `badge` string ("Top match", "New") OR the literal
//       "EXPIRING" when `expiringSoon`.
//     - Bottom scrim gradient (linear, 0 → 0.75 alpha black) for
//       legibility.
//     - Bottom-left value chip: frosted dark pill, display 13 / 700
//       / -0.025em, ink, "₪{value}".
//   - Caption block under the image:
//     - Title (display 14.5 / 700, ink, 1.15 line-height, ellipsize 1 line).
//     - Business name (mono 9 / 0.15em uppercase inkMuted, ellipsize).
//     - Required action (mono 9 / 0.12em uppercase ink, e.g. "3 IG STORIES"
//       or "TIKTOK REVIEW").
//     - Threshold + qualification line (one mono row): "{Threshold}+
//       on {Platform}" inkMuted + 3×3 inkSubtle separator dot + then
//       either:
//         - `colors.accent` + "You qualify ✓" (Check icon 9px)
//         - `colors.decline` + "Below threshold"
//       Determined by comparing viewer's `reach[platform]` to the
//       perk's `requiredFollowers`.
//
// FILTER SHEET (Filters):
//   - Backdrop scrim (black 55% alpha + blur 2px) + sheet rises from
//     bottom with cubic-bezier(0.32, 0.72, 0, 1) ~420ms. Drag-handle
//     bar at top. Header row: mono accent caption ("X ACTIVE" when any,
//     else "REFINE PERKS") + display title "Filters" (display 26 / 800
//     / -0.04em). Close button (X) 38×38 surface circle on the right.
//   - Sections (each with FilterSection — display 16 / 700 title + an
//     optional mono accent hint on the right):
//       1. Categories (multi-select pills — same chip styling as the
//          top category chips but never includes "All"; selected =
//          accentSoft + accentBorder + accent text). Hint shows
//          "{N} selected" when any chosen.
//       2. Value range (two NumberInput tiles side-by-side: Min / Max,
//          each with a "MIN"/"MAX" mono caption + a leading "₪" prefix
//          on the input). Hint shows "₪{min} → ₪{max}" live.
//       3. Reach — single full-width toggle row "Show only perks I
//          qualify for". When on: accentSoft tile + accent checkbox.
//       4. Urgency — single full-width toggle row "Expiring soon only".
//          Same on/off styling.
//       5. Sort by — list of full-width radio rows. Options:
//             - Recommended (default)
//             - Value: high → low
//             - Newest
//             - Expiring soonest
//          Active row shows accent-filled circle with a check on the
//          right.
//   - Sticky footer: outline "Reset" pill (flex 1) + solid accent
//     "Apply filters" pill (flex 1.5) with accent shadow.
//   - "Apply" closes the sheet. Filter state lives in the parent
//     screen so the active-chip bar updates immediately.
//
// VIEWER REACH (for qualification):
//   For the mock, hardcode Maya's reach: { IG: 47200, TikTok: 82100,
//   YouTube: 8400 }. In production this comes from the influencer's
//   storefront `platforms` data via a small helper.
//
// SORT BEHAVIOR (when filters are applied):
//   - "Recommended" preserves the row-based layout (existing rows).
//   - The other sorts collapse the row layout into a single flat
//     grid of perks ordered by the chosen criterion. (Designer +
//     PM to confirm; reference doesn't show the sorted-grid state
//     but this is the natural UX expectation.)
//
// FILTERED OUT → empty state:
//   - When category chip + filters + qualify/expiring toggles yield
//     zero perks, render the EmptyState component with "Reset filters"
//     primary CTA. The "Reset filters" CTA must clear EVERYTHING —
//     category chip ("All"), all filter state.
//
// ENCODING ARTIFACTS in this reference (already known patterns):
//   `âª`  → `₪`
//   `Ã`   → `×`
//   `Â·`  → `·`
//   `â`   → `→` (arrow) — appears in row "SEE ALL →" and in sort
//          labels "Value: high → low"
//   `â` standalone in `âª{min}ââª{max}` → the dash between min and max
//   value chip label is `→` (canonical "min → max") in this codebase.
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
// DESIGN TOKENS
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
  fontDisplay: "'Inter Tight', system-ui, sans-serif",
  fontBody: "'Inter Tight', system-ui, sans-serif",
  fontMono: "'JetBrains Mono', monospace",
};

// =================================================================
// MOCK DATA — Perks
// Maya's reach (for qualification check):
//   IG: 47.2K · TikTok: 82.1K · YouTube: 8.4K
// =================================================================
const PERKS = [
  { id: "p-1", title: "Dinner for two", business: "Onza", businessMonogram: "ON", value: 400, cover: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600&q=80", requiredAction: "3 IG Stories", requiredPlatform: "IG", requiredFollowers: 10000, category: "Food", slotsLeft: 3, slotsTotal: 5, badge: "Top match", expiringSoon: false },
  { id: "p-2", title: "Pilates class pack", business: "Studio Movement", businessMonogram: "SM", value: 580, cover: "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=600&q=80", requiredAction: "1 IG Reel", requiredPlatform: "IG", requiredFollowers: 25000, category: "Fitness", slotsLeft: 2, slotsTotal: 4, badge: null, expiringSoon: false },
  { id: "p-3", title: "Skincare bundle", business: "BeautyBar", businessMonogram: "BB", value: 320, cover: "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=600&q=80", requiredAction: "TikTok review", requiredPlatform: "TikTok", requiredFollowers: 50000, category: "Beauty", slotsLeft: 1, slotsTotal: 5, badge: null, expiringSoon: true },
  { id: "p-4", title: "Cocktails at Bellboy", business: "Bellboy", businessMonogram: "BB", value: 280, cover: "https://images.unsplash.com/photo-1551024601-bec78aea704b?w=600&q=80", requiredAction: "2 IG Stories", requiredPlatform: "IG", requiredFollowers: 100000, category: "Drinks", slotsLeft: 4, slotsTotal: 5, badge: null, expiringSoon: false },
  { id: "p-5", title: "Coffee + brunch", business: "FitBar TLV", businessMonogram: "FB", value: 180, cover: "https://images.unsplash.com/photo-1497515114629-f71d768fd07c?w=600&q=80", requiredAction: "1 IG Story", requiredPlatform: "IG", requiredFollowers: 5000, category: "Food", slotsLeft: 8, slotsTotal: 10, badge: "New", expiringSoon: false },
  { id: "p-6", title: "Sushi tasting", business: "Sushi Bar", businessMonogram: "SB", value: 450, cover: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=600&q=80", requiredAction: "1 IG Reel", requiredPlatform: "IG", requiredFollowers: 30000, category: "Food", slotsLeft: 2, slotsTotal: 3, badge: null, expiringSoon: false },
];

const VIEWER_REACH = { IG: 47200, TikTok: 82100, YouTube: 8400 };

const PERK_ROWS = [
  { id: "row-match",    title: "Top match for Maya", subtitle: "Based on your categories", perkIds: ["p-1","p-2","p-5"] },
  { id: "row-expiring", title: "Expiring soon",      subtitle: null,                       perkIds: ["p-3","p-6"] },
  { id: "row-new",      title: "New perks",          subtitle: null,                       perkIds: ["p-5","p-4","p-2"] },
  { id: "row-tlv",      title: "Near you in Tel Aviv", subtitle: null,                     perkIds: ["p-1","p-4","p-6","p-3","p-5"] },
];

const CATEGORIES_CHIPS = ["All","Food","Fitness","Beauty","Lifestyle","Wellness","Drinks"];
const CATEGORIES_FILTER = ["Food","Fitness","Beauty","Lifestyle","Wellness","Drinks"]; // no "All" in the filter sheet

const SORT_OPTIONS = [
  { id: "recommended", label: "Recommended" },
  { id: "value_high",  label: "Value: high → low" },
  { id: "newest",      label: "Newest" },
  { id: "expiring",    label: "Expiring soonest" },
];

// (The full JSX body in the original reference walks through the
//  header, category chips, active filter bar, body states, filter
//  sheet, and the in-component helpers — FilterSection, NumberInput,
//  PerkRow, PerkCard, EmptyState, SkeletonState, ActiveFilterChipBar,
//  FilterPanel. Every pixel/typography value above is verbatim from
//  the user-supplied reference. Use the original file in chat history
//  for any details not captured here.)
