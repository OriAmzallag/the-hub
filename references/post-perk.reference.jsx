// =================================================================
// REFERENCE FILE — Post a Perk (Business-side creation flow)
// =================================================================
// Source: user-provided reference, 2026-05-12
//
// PURPOSE: The Business-side flow for creating + publishing a new perk
// that Influencers can claim from the Influencer Discover screen. The
// flow has three states:
//
//   1. form    — multi-section form for filling in the perk
//   2. preview — what Influencers will see (REUSES the Perk Detail
//                layout we just shipped in PR #23 — same hero, identity,
//                stats, deliverables, "the offer" — wrapped in a
//                "PREVIEW · WHAT INFLUENCERS SEE" banner)
//   3. success — published, with "Your perk is live." headline +
//                summary card + "View live perk" / "Back to dashboard"
//                CTAs (mirrors the ClaimedSuccess pattern from
//                components/influencer/perk-detail/ClaimedSuccess.tsx)
//
// FORM SECTIONS (in order):
//   • Cover image (REQUIRED). Empty state = dashed 4:3 tile with Camera
//     icon + "Add cover image". Filled = the image with a small frosted
//     "Camera · Change" pill at bottom-right.
//   • Basics. Two TextField rows: Title (max 60), Description (max 300,
//     multiline). Char counter on each.
//   • Categories. Multi-select pill grid (max 3). First selected gets a
//     mono accent "01" prefix INSIDE the pill (same pattern as the
//     existing storefront-editor CategoryChipsEditor's primary chip).
//     CATEGORY_OPTIONS in the reference is: Food, Fitness, Beauty,
//     Lifestyle, Wellness, Drinks, Fashion, Tech (8 options).
//   • Value (₪ number). Big display 22 weight 800 input with leading ₪.
//   • What you ask for (DELIVERABLES). List of compact buttons, each
//     showing mono index "01" / "02" + display 14.5 "{action} on
//     {platform}" + mono "{threshold}+ on {platform}" + Edit pencil.
//     Tap a row to edit, tap dashed "+ Add deliverable" to create new.
//     Both routes open the DELIVERABLE SHEET.
//   • Logistics. Three fields: Max claims (NumberField), Deadline to
//     deliver (TextField, free-form like "7 days after claiming"),
//     Perk expires on (DateField — uses Calendar icon prefix; for the
//     port a simple text input is fine, real date picker is a follow-up).
//
// DELIVERABLE SHEET (bottom sheet, used for both Add + Edit):
//   Header: mono accent "NEW DELIVERABLE" or "EDIT DELIVERABLE" + display
//   26 "What & where". Close (X) on the right.
//   Body sections:
//     1. Platform — 3 large tappable tiles with brand icon: Instagram,
//        TikTok, YouTube. Active = accentSoft / accentBorder / accent.
//     2. Action — preset chips per platform (e.g. IG: "1 Story",
//        "2 Stories", "3 Stories", "1 Reel", "1 Post"), plus a "Or
//        custom" TextField underneath. Selecting a preset fills the
//        text field.
//     3. Minimum reach — NumberField. Hint shows live "{N}K+ on {P}".
//     4. Brief — multiline TextField, "What to include". 200 char cap.
//   Sticky footer:
//     - Add mode: outline "Cancel" + accent "Add deliverable"
//     - Edit mode: decline-tone outline "Remove" + accent "Save"
//   The sheet MUST use the canonical pattern:
//     • Native <Modal transparent animationType="none" statusBarTranslucent>
//     • Inner <GestureHandlerRootView> so pan-down works on iOS
//     • Local isMounted state, RAF-deferred entrance, withTiming
//       completion callback to unmount AFTER the exit animation
//     • Footer paddingBottom = Math.max(insets.bottom, 22)
//     • Pan-down threshold 0.25 / velocity 800 (consistent with all
//       other sheets in the codebase)
//
// PREVIEW SCREEN (the second state of the flow):
//   Wraps the Perk Detail layout in a "preview" chrome:
//     - Top: accentSoft banner with mono accent "PREVIEW · WHAT
//       INFLUENCERS SEE" + mono accent "BACK TO EDIT" affordance.
//     - Body: SAME hero / identity / stats / "What you ask for"
//       (deliverables tiles, with the per-deliverable description and
//       reach footer) / "The offer" description as the real Perk
//       Detail. REUSE existing primitives — DO NOT duplicate
//       PerkHero / PerkIdentity / PerkStatsRow / DeliverableTile /
//       DeadlinePill from components/influencer/perk-detail/.
//     - The header chrome (back / share / heart) is rendered as
//       DISABLED faded ghosts so the user understands it's not yet
//       interactive — pointerEvents none, opacity ~0.6.
//     - Sticky footer: outline "Edit" + accent "Publish" with arrow.
//
// SUCCESS SCREEN:
//   Mirror the existing ClaimedSuccess pattern:
//     - 80×80 accent circle with Check + check-pop spring (0.5s
//       cubic-bezier(0.32, 0.72, 0, 1)).
//     - Mono accent "PUBLISHED".
//     - Display L "Your perk is live."
//     - Subtext: "Influencers can start claiming now. You'll be
//       notified when someone does."
//     - Summary card (Perk · Value · Slots {N}/{N} available).
//     - Primary "View live perk →" + outline "Back to dashboard".
//
// ROUTING (PM to confirm):
//   Suggested: /perks/new (top-level, outside the tab group — same
//   pattern as /perks/[id], /inquiries/[threadId], /influencer/[id]).
//   Entry: a "Post a perk" CTA on the Business Dashboard or Business
//   Profile (PM picks). Per CLAUDE.md memory we don't add to perks
//   tab navigation since the Business side already has 4 tabs.
//   After publish, "View live perk" routes to /perks/{newId}; "Back
//   to dashboard" pops to /(business).
//
// CRITICAL CONSTRAINTS:
//   • Terminology — production code uses business / influencer.
//     NEVER "hunter" / "talent".
//   • Design tokens — constants/theme.ts is the only source. The
//     decline tone (colors.decline*) is for the Remove button in
//     Edit mode of the deliverable sheet — NEVER red.
//   • Mono = system voice (labels, captions, indices, thresholds).
//   • Numbers paired with labels (₪{value}, {N}+ on {Platform},
//     char counter "N/MAX").
//   • Avatar tiles are 12-radius rounded squares, never circles
//     (already a fixed convention; the business monogram tile in
//     the preview reuses the existing PerkIdentity component).
//
// ENCODING ARTIFACTS in the original paste:
//   `âª` → `₪`,  `Â·` → `·`,  `â` → `→` or `—`.
//   "Preview Â· what Influencers see" → "Preview · what Influencers see".
//   "âª400" → "₪400".  "âª" in the value-field prefix → "₪".
//
// =================================================================

import { useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  X,
  Plus,
  Camera,
  Calendar,
  Edit3,
  Check,
  Clock,
  Instagram,
  Music2,
  Youtube,
  CheckCircle2,
  Star,
  ArrowRight,
  Share,
  Heart,
  AlertCircle,
} from "lucide-react";

// =================================================================
// DESIGN TOKENS — use constants/theme.ts in the port.
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
// CONSTANTS
// =================================================================
const CATEGORY_OPTIONS = [
  "Food", "Fitness", "Beauty", "Lifestyle", "Wellness", "Drinks",
  "Fashion", "Tech",
];

const PLATFORM_OPTIONS = [
  { id: "IG",      label: "Instagram", icon: "Instagram" },
  { id: "TikTok",  label: "TikTok",    icon: "Music2"    },
  { id: "YouTube", label: "YouTube",   icon: "Youtube"   },
];

const ACTION_PRESETS = {
  IG:      ["1 Story", "2 Stories", "3 Stories", "1 Reel", "1 Post"],
  TikTok:  ["1 Reel",  "1 Story",   "1 Review"],
  YouTube: ["1 Short", "1 Video",   "1 Review"],
};

// (The full screen JSX bodies — PerkForm, PreviewScreen, DeliverableSheet,
//  SuccessState — plus the form-helper primitives (FormSection,
//  TextField with char counter, NumberField, DateField) follow the
//  exact pixel values in the original user paste. Every fontFamily /
//  fontSize / letterSpacing / padding / borderRadius / lineHeight is
//  verbatim from the reference. The visual character is best learned
//  by reading the original paste — this header documents the
//  structure, the open questions, and the reuse guidance.)
