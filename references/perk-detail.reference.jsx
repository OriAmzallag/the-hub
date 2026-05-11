// =================================================================
// REFERENCE FILE — Perk Detail Screen
// =================================================================
// Source: user-provided reference, 2026-05-11
//
// PURPOSE: The screen that opens when an influencer taps a PerkCard
// on the Discover screen. Three render states:
//
//   1. detail-qualified  — viewer qualifies on ALL deliverables.
//      Primary accent "Claim this perk" CTA + ArrowRight icon.
//   2. detail-below      — viewer qualifies on NONE (or partial — see
//      below). CTA replaced with a decline-tone "Below threshold ·
//      Can't claim" / "Partial match · Can't claim" pill.
//   3. claimed           — success state after the user confirms in
//      the ConfirmSheet. Big check pop, "It's yours.", summary card,
//      "Open inquiry" + "Back to perks" CTAs.
//
// PARTIAL MATCH:
//   When the perk has 2+ deliverables and the viewer qualifies on some
//   but not all, the banner is "PARTIAL MATCH" (decline tone). The
//   sticky CTA reads "Partial match · Can't claim". Each deliverable
//   tile shows its own qualified/below chip so the user can see
//   exactly where they fall short.
//
// ROUTING:
//   /perks/[id]  — top-level (outside the tab group, like /influencer/[id]
//                  and /inquiries/[threadId]).
//   Entry: PerkCard tap on the influencer Discover.
//   After claim → "Open inquiry" routes to /inquiries/{newThreadId} or
//                 the inquiries tab (TODO until real backend).
//
// SCREEN STRUCTURE (top → bottom, on the detail view):
//   1. Sticky top bar — back button (frosted dark pill on hero, surface
//      pill on scrolled state). Title appears only after scroll past
//      the hero. Right side: Share + Heart (favorite toggle, accent
//      when active).
//   2. Hero image — 4:3 aspect, optional top-left badge ("Top match",
//      "New", "EXPIRING"), bottom-left ₪value frosted chip, bottom
//      gradient scrim for legibility.
//   3. Identity block — mono accent category caption, display 36
//      title (weight 800 -0.045em), then a non-tappable business
//      info tile (40×40 monogram, name + verified badge, mono row:
//      star+rating · N deals · location).
//   4. Qualification banner — one of three variants:
//        - QualifiedBanner       (accent fill check + "You qualify")
//        - PartialMatchBanner    (decline circle + AlertCircle + a body
//                                  copy explaining the partial state)
//        - BelowThresholdBanner  (decline circle + "Below threshold"
//                                  + "Keep growing — or browse perks
//                                  that match your current reach.")
//   5. Bento stats — 3-up grid: "SLOTS" / "VALUE" / "EXPIRES". Same
//      StatTile pattern used elsewhere (display 22, label 9.5px mono
//      tracked).
//   6. "What you'll deliver" — section header (display 22, weight 700)
//      + one DeliverableTile per item. Tile:
//        - mono 9px index "01" / "02" + mono 10px accent
//          "{ACTION} on {PLATFORM}"
//        - small accentSoft "QUALIFIED ✓" chip OR declineSoft "BELOW"
//          chip (right-aligned in the top row)
//        - 14px ink description, 1.5 line-height
//        - footer (border top) with mono labels: "Need {N}+ on {P}"
//          inkMuted + "You: {viewerCount}" accent (qualified) or
//          decline (below)
//      Below the list: a single "deadline" pill — mono inkMuted
//      "Clock icon · Within 7 days of claiming".
//   7. Description — section header "The offer" + body L paragraph.
//   8. Sticky claim CTA — accent pill "Claim this perk →" OR
//      decline-tone disabled pill when not qualifying.
//
// CONFIRM SHEET (opens on Claim tap):
//   Bottom sheet with overlay scrim, drag handle, header (mono accent
//   "CONFIRM CLAIM" + display 26 "Ready to claim?"), summary card
//   with three rows (Perk · You deliver (stacked deliverables) ·
//   Deadline), disclaimer copy, sticky footer with outline "Cancel" +
//   accent "Yes, claim →" pills. Tapping Yes transitions the screen
//   into the Claimed state.
//
// CLAIMED SUCCESS SCREEN:
//   Replaces the detail view entirely (no nested chrome).
//   - 80×80 accent circle with a big white Check, with a `check-pop`
//     spring animation (cubic-bezier(0.32, 0.72, 0, 1), 0.5s).
//   - Mono accent "CLAIMED" caption.
//   - Display L "It's yours." headline (52 → 36 weight 800 -0.045em).
//   - Subtext: "{Business} has been notified. You have until
//     {deadline lowercased} to deliver."
//   - Summary card (Perk · Business · Value).
//   - Primary "Open inquiry" pill (accent + MessageSquare icon) +
//     secondary outline "Back to perks" pill.
//
// MOTION:
//   - Sheet rise: existing motion.duration.slow + motion.easing.sheet
//     tokens (defer-one-frame pattern same as filter sheets).
//   - check-pop: spring-y scale 0 → 1.15 → 1, 0.5s.
//   - fade-up: opacity + translateY 8→0, 0.4s ease-out.
//
// DESIGN-SYSTEM DISCIPLINE (must hold):
//   - One accent (#FF7A29). Decline tone (#C4886B) for "Below threshold",
//     "Partial match", and the disabled CTA — NEVER red.
//   - Mono = system voice (caption, labels, indices, thresholds).
//   - Numbers always paired with a label / unit (₪{value}, {N}+ on {P}).
//   - Use tokens from `constants/theme.ts`.
//
// ENCODING ARTIFACTS in the original paste:
//   `âª` → `₪`,  `Â·` → `·`,  `â` → `—` (em dash) or arrow depending on
//   context. "Detail · Qualified" / "Detail · Below" / "Claimed ·
//   Success" use `·`. The arrow → on the claim button is `→` (chevron
//   ArrowRight icon — already covered).
//
// =================================================================

import { useState, useRef, useEffect } from "react";
import {
  ChevronLeft,
  Share,
  Heart,
  Star,
  CheckCircle2,
  Check,
  Clock,
  Calendar,
  TrendingUp,
  ArrowRight,
  X,
  AlertCircle,
  MessageSquare,
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
// MOCK DATA — full perk shape for the detail screen. Includes a
// `business` sub-object with rating + deals + location, a deadline
// string, a longer `description`, slot counts + expiresOn, and the
// deliverables array per the new model.
// =================================================================
const PERK_QUALIFIED = {
  id: "p-1",
  title: "Dinner for two",
  category: "Food",
  business: {
    name: "Onza",
    monogram: "ON",
    verified: true,
    rating: 4.7,
    deals: 24,
    location: "Tel Aviv",
  },
  value: 400,
  cover: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1200&q=80",
  deliverables: [
    {
      platform: "IG",
      action: "3 Stories",
      requiredFollowers: 10000,
      description: "Three Instagram Stories featuring your meal at Onza. Tag @onza_tlv and use #onzatlv.",
    },
    {
      platform: "TikTok",
      action: "1 Reel",
      requiredFollowers: 30000,
      description: "One TikTok showcasing the tasting experience. Tag @onzatlv in the caption.",
    },
  ],
  deadline: "Within 7 days of claiming",
  description: "A multi-course tasting menu for two at Onza, including a glass of natural wine each. Dietary preferences accommodated with 48h notice.",
  slotsLeft: 3, slotsTotal: 5,
  expiresOn: "May 18",
  badge: "Top match", expiringSoon: false,
};

// PERK_BELOW (same shape, requiredFollowers values raised above Maya's
// reach so qualification falls. Used for the "below"/"partial" demo state.)

const VIEWER_REACH = { IG: 47200, TikTok: 82100, YouTube: 8400 };

function formatThreshold(followers) {
  if (followers >= 1000000) return `${(followers / 1000000).toFixed(0)}M`;
  if (followers >= 1000) return `${(followers / 1000).toFixed(0)}K`;
  return String(followers);
}

function deliverableQualifies(d) {
  const myReach = VIEWER_REACH[d.platform] || 0;
  return myReach >= d.requiredFollowers;
}

// Overall qualification across all deliverables.
function overallQualification(perk) {
  const results = perk.deliverables.map(deliverableQualifies);
  const passed = results.filter(Boolean).length;
  if (passed === results.length) return "full";
  if (passed === 0) return "none";
  return "partial";
}

// =================================================================
// (Body JSX in the original reference walks through PerkDetailView,
//  QualifiedBanner / PartialMatchBanner / BelowThresholdBanner,
//  DeliverableTile, StatTile, SectionHeader, ConfirmSheet, ClaimedSuccess.
//  Pixel values in each subcomponent are verbatim from the user paste.)
// =================================================================

// Note on `deliverable.description` — the discover-side mock perks DO
// NOT include a `description` per-deliverable today; only the detail
// view needs it. Either:
//   (a) extend the Perk model so every deliverable carries `description`,
//       or
//   (b) keep `description` only on the detail-loaded perk (the Discover
//       list doesn't render it). Tech Lead to call which is cleaner.
