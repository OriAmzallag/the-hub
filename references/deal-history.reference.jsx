// =================================================================
// REFERENCE FILE — Deal History (2026-05-14)
// =================================================================
// Source: user-provided prototype, 2026-05-14.
//
// PURPOSE
// -------
// Tab entered from Profile that lists all closed (terminal-state)
// deals. Three filter sub-tabs by terminal state. Tapping any row
// routes to the Deal Summary archive.
//
// ENTRY POINT
// -----------
// Profile screen → "Deal history" row (both personas).
//
// LAYOUT
// ------
// 1. **Top bar**: ChevronLeft 36×36 back button + "Deal history"
//    display 18/800/-0.035em title.
//
// 2. **Hero**: mono 10/0.22em/accent "{N} CLOSED DEALS" eyebrow
//    + display 30/800/-0.04em "Everything\nthat's wrapped." headline.
//
// 3. **Filter tabs** (3 buttons, equal flex):
//    - Completed (RATED state)
//    - Declined  (DECLINED state)
//    - Expired   (EXPIRED state)
//    Each tab: display 13/700 label + mono 9.5/0.18em count below.
//    Active = accentSoft bg + accentBorder + accent text.
//    Inactive = surface + border + ink text.
//
// 4. **Deal list** — scrolling list of HistoryRow cards (gap 8).
//    Empty state per tab when no deals match.
//
// HISTORY ROW VISUAL RECIPE
// -------------------------
// Padding 13/14, radius 12, gap 12, surface bg + border, press scale 0.99.
//
// - **Avatar**: 40×40, radius 11, borderStrong.
//   - Business POV → influencer photo
//   - Influencer POV → business monogram tile (surfaceAlt + borderStrong)
//   - For EXPIRED + DECLINED: photo desaturated 60%
//     (`filter: saturate(0.6)`)
// - **Middle column**:
//   - Counterparty name display 14/700/-0.025em, ellipsis
//   - Caption mono 8.5/0.16em/uppercase 600 — color follows tone
//     (muted for RATED, decline for EXPIRED/DECLINED)
//   - Summary "{services} · ₪{money}" body 11.5/inkMuted, ellipsis
// - **Right column**: mono 9/0.12em/inkSubtle uppercase date label
//   ("MAY 3", "APR 30", etc.) — the relevant terminal date depending
//   on state (ratedDate / declinedDate / expiredDate).
//
// EMPTY STATES (per tab)
// ----------------------
// - Completed (business): "Completed deals will appear here once
//   you've rated them."
// - Completed (influencer): "Your completed deals will appear here
//   once both sides have rated."
// - Declined (business): "Influencers who declined your requests
//   will appear here."
// - Declined (influencer): "Requests you've declined will appear here."
// - Expired (business): "Requests that timed out without a response
//   will appear here."
// - Expired (influencer): "Requests you didn't respond to in time
//   will appear here."
//
// Empty-state copy is mono 10/0.22em "NOTHING HERE YET" eyebrow +
// body 13/inkMuted explanation centered.
//
// INTEGRATION
// -----------
// - Reached from Profile (add a "Deal history" ProfileRow to the
//   MANAGE section on both BusinessProfileScreen and
//   InfluencerProfileScreen).
// - Tapping any HistoryRow routes to
//   `/deals/{dealId}/summary?viewerRole={role}` (or whatever the
//   Tech Lead lands on).
// - Mutual Reveal's "View deal summary →" CTA must be updated to
//   route to the same target instead of going back to dashboard.
//
// CANONICAL CAPTION RESOLVER
// --------------------------
// Use `getDealCaption(deal, viewerRole)` from `lib/dealLifecycle.ts` —
// same source of truth as everywhere else. No local string literals
// for state labels.
//
// ENCODING ARTIFACTS (decoded here):
//   `Â·` → `·`,  `âª` → `₪`,  `â` in `RATED â N` → `★`,
//   `3Ã` → `3×`.
//
// =================================================================

import { useState } from "react";
import {
  ChevronLeft,
  Star,
  MessageCircle,
  ArrowRight,
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
  decline: "#C4886B",
  declineSoft: "rgba(196,136,107,0.12)",
  declineBorder: "rgba(196,136,107,0.40)",
};

// (Full HistoryView + HistoryRow + EmptyState JSX bodies follow the
//  layout described in the header. The Tech Lead should reuse
//  components from the deal-card v0.8 work where possible — the row
//  shape closely mirrors DealRow but is read-only and includes a
//  date instead of a tap hint.)
