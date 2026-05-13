// =================================================================
// REFERENCE FILE — Rating Flow (2026-05-13)
// =================================================================
// Source: user-provided prototype, 2026-05-13.
//
// SIX LOCKED DECISIONS
// --------------------
// 1. PUBLIC ratings — attributed and shown on the rated person's
//    storefront / profile. Anonymous aggregates are gameable; public
//    ratings are real trust currency.
// 2. STARS REQUIRED, tags + review OPTIONAL — required text fields
//    produce low-quality reviews ("good", "thx"). Optional with good
//    prompts produces better signal.
// 3. MUTUAL REVEAL — neither side sees the other's rating until both
//    submit. Same model as Airbnb. Prevents retaliation, encourages
//    honesty.
// 4. LOCKED ONCE SUBMITTED, FOREVER — no edit, no delete, no appeal.
//    Editable ratings are gameable. Permanence is the signal.
//    Abusive content handled via silent admin moderation (out of scope).
// 5. SINGLE DIMENSION — one overall 1–5 star rating + optional tag
//    chips + optional 200-char review. Multi-dimensional dimensions
//    (comms / quality / timeliness) cause rating fatigue.
// 6. CONVERSATIONAL PROMPT — "How was working with {Name}?" Frames
//    rating as reflection, not judgment.
//
// TWO TAG TAXONOMIES (six each, role-specific)
// -------------------------------------------
// Business rates Influencer:
//   On time, Clear delivery, Great quality, Good comms, Knew the brand,
//   Would book again
// Influencer rates Business:
//   Clear brief, Easy to work with, Fast comms, Trusted my creativity,
//   Fair deal, Would work again
//
// "Would book again" / "Would work again" is the strongest predictive
// signal — store separately for matching.
//
// THREE SCREENS
// -------------
// 1. RATE
//    - Top bar: X close (left) + "RATE YOUR COLLABORATION" mono eyebrow
//    - Hero: 96×96 counterparty avatar (photo for influencer, monogram
//      tile for business), deal summary "{services} · ₪{money}" mono
//      caption, display 30/800/-0.04em headline "How was working\nwith
//      {FirstName}?"
//    - Stars: 5 × 42pt accent-filled stars with star-pop animation on
//      tap. Below: "Poor / Below average / OK / Great / Excellent"
//      label in accent mono 10/0.2em uppercase after first tap.
//    - Tag chips: centered wrap, gap 7. Active chip = accentSoft bg +
//      accentBorder + accent text + Check 12 icon. Inactive = surface
//      bg + border + ink text. "WHAT STOOD OUT · OPTIONAL" caption.
//    - Review textarea: 14px ink, rows 3, max 200 chars, char counter
//      bottom-right (accent when > 180). "ANYTHING ELSE · OPTIONAL".
//    - Mutual-reveal notice card: Clock icon + "You'll see {Name}'s
//      rating once they submit theirs. Ratings reveal at the same time."
//    - Sticky footer: "Submit rating" primary pill (disabled until
//      stars > 0) + ArrowRight 16/2.6.
//
// 2. SUBMITTED · WAITING (first rater)
//    - Hero check (80×80 accent circle, check-pop animation)
//    - Eyebrow: "RATED · {N} STARS" accent mono 10/0.28em
//    - Headline: "Submitted." display 30/800/-0.04em centered
//    - Body: "We'll show you what {FirstName} rated once they submit
//      theirs."
//    - Explainer card: Clock icon + "HOW THIS WORKS" + body copy
//      explaining mutual reveal.
//    - Secondary outline CTA: "Back to Dashboard"
//
// 3. MUTUAL REVEAL (when second rater submits)
//    - Top bar: X close (back to dashboard) + "RATINGS REVEALED" eyebrow
//    - Hero check (72×72 accent circle)
//    - Conditional headline (display 30/800):
//      • myStars === counterpartStars === 5 → "5 stars each. Nice work."
//      • myStars === counterpartStars       → "{N} stars each."
//      • else                                → "You've both rated."
//    - Body: "This collaboration is now part of both your histories."
//    - Two RatingCard primitives stacked with "——— AND ———" separator:
//      - "You rated {counterparty}" — yours, no avatar
//      - "{Counterparty} rated you" — theirs, with their avatar (32×32
//        radius 9)
//      - Each card: 5 stars with numeric "{N}.0" suffix + tag chips
//        (accentSoft) + italic review in quotes
//    - Sticky footer: two pills side by side — "Back" (outline) +
//      "View deal summary" (primary).
//
// BUSINESS RULES
// --------------
// - Rating opens when deal enters COMPLETED (influencer marks done).
// - 7-day rating window; after that, locked at one-sided rating
//   (if any). Deal still transitions to RATED for both sides.
// - Storefront rating tile hidden until ≥ 3 reviews — shows "NEW"
//   instead.
// - Aggregate uses weighted moving average (recent deals weighted
//   higher). Computed server-side; out of scope for this PR.
//
// INTEGRATION WITH DEAL-CARD V0.8
// --------------------------------
// - Entry point: tapping a "RATE NOW" card (COMPLETED state where
//   `getDealCaption(deal, viewer).actionable === true`).
// - After rating: viewer's deal advances to COMPLETED +
//   `{viewer}-rated` sub-state.
// - When both have rated: deal advances to RATED. Rating Flow is the
//   only producer of RATED-state transitions.
// - The destination "rating" from the deal-card prototype is THIS
//   surface.
//
// ENCODING ARTIFACTS in the original paste (decoded here):
//   `Â·` → `·`,  `âª` → `₪`,  `3Ã` → `3×`,  `âââ` → `———`,
//   `cafÃ©` → `café`.
//
// =================================================================

import { useState } from "react";
import {
  ChevronLeft,
  Star,
  Check,
  Clock,
  ArrowRight,
  X,
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
};

// =================================================================
// TAG TAXONOMIES
// =================================================================
const TAGS_BUSINESS_RATES_INFLUENCER = [
  "On time",
  "Clear delivery",
  "Great quality",
  "Good comms",
  "Knew the brand",
  "Would book again",
];

const TAGS_INFLUENCER_RATES_BUSINESS = [
  "Clear brief",
  "Easy to work with",
  "Fast comms",
  "Trusted my creativity",
  "Fair deal",
  "Would work again",
];

// =================================================================
// MOCK DATA (for the prototype)
// =================================================================
const DEAL = {
  id: "d-3",
  influencer: {
    name: "Maya Cohen",
    photo: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&q=80",
  },
  business: {
    name: "FitBar TLV",
    monogram: "FB",
  },
  summary: "Instagram Reel + Story Set",
  services: ["Instagram Reel · ₪350", "Story Set · ₪180"],
  money: 530,
};

const COUNTERPART_RATING = {
  stars: 5,
  tags: ["Clear delivery", "Great quality", "Good comms"],
  review: "Delivered exactly the brief, on time. Engagement was 3× our usual.",
};

const COUNTERPART_RATING_BUSINESS = {
  stars: 5,
  tags: ["Clear brief", "Easy to work with", "Fair deal"],
  review:
    "Professional from first DM. Fast payment, no surprises. Already planning next collab.",
};

// =================================================================
// (The full JSX for RateScreen, SubmittedWaiting, SubmittedReveal,
//  and RatingCard primitives follows the prototype paste. The Tech
//  Lead should port each screen using existing primitives where
//  possible: StepShell-style sticky-footer Pressable for the Submit
//  CTA, ChipGrid for the tag chips, FieldCard for the review
//  textarea, useFadeUpEntrance + withSpring for the check-pop +
//  star-pop animations.)
// =================================================================

function starsLabel(stars) {
  return ["", "Poor", "Below average", "OK", "Great", "Excellent"][stars];
}
