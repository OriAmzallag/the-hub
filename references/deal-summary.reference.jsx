// =================================================================
// REFERENCE FILE — Deal Summary (2026-05-14)
// =================================================================
// Source: user-provided prototype, 2026-05-14.
//
// CORE PRINCIPLE
// --------------
// Deal Summary is the **comprehensive archive** of a terminal deal —
// the complete record that exists nowhere else in the app. Deliberately
// distinct from Mutual Reveal (which already showed the ratings).
//
// **Headline content is the TIMELINE, not the ratings.**
//
// ENTRY POINTS
// ------------
// - Tap on a History row (any terminal state)
// - Mutual Reveal's "View deal summary →" CTA
// - Deep link from a future notification
//
// Cannot route to the active Coordination Thread — only to the
// read-only archive view (deferred).
//
// LAYOUT (top to bottom)
// ---------------------
// 1. **Top bar** — back button + "DEAL SUMMARY · ARCHIVED" mono caption.
//    NO counterparty name in the top bar (it's in the hero below).
//
// 2. **Compact hero** — one row, not dominant:
//    - 56px counterparty avatar (radius 14). Influencer photo or
//      business monogram tile.
//    - For EXPIRED + DECLINED: avatar desaturated to 60%
//      (CSS `filter: saturate(0.6)`).
//    - Canonical caption (RATED ★ 5 / EXPIRED / DECLINED · {REASON}
//      from `getDealCaption`), accent for RATED, decline for the rest.
//    - Counterparty name display 18/800/-0.035em.
//    - Service summary + total ("Instagram Reel + Story Set · ₪530")
//      body 12 inkMuted.
//
//    NOTE: earlier draft had a 72px hero — it competed with the
//    timeline for attention. 56px establishes context without stealing
//    focus from the story.
//
// 3. **"The story" timeline** (headline content) — vertical
//    chronological event list. Each event:
//    - 24px circle with a small icon. Accent-soft + accentBorder for
//      happy-path events; decline-soft + declineBorder for expired/
//      declined.
//    - 1px connector line running vertically between circles
//      (positioned absolute, left:27, top:36, bottom:-2).
//    - Display 13.5/700/-0.02em title on the left — POV-aware
//      ("You sent the request" / "FitBar TLV sent the request").
//    - Mono 9/0.1em/inkSubtle date + time caption on the right
//      ("APR 28 · 14:22").
//    - Optional body 12/inkMuted detail line underneath
//      ("Accepted in 1h 46m", "Content shared via WhatsApp",
//      "5★ · 3 tags · written review").
//
//    **Event types (LOCKED — 8 total):**
//      request_sent, viewed, accepted, marked_done, rated, deal_closed,
//      expired, declined
//
//    **Timeline lengths by terminal state:**
//      RATED    = 6 events (request → accept → marked_done → both rated → deal_closed)
//      EXPIRED  = 3 events (request → viewed → auto-expired)
//      DECLINED = 2 events (request → declined)
//
// 4. **"The deal" card** — just the facts:
//    - Services list (each line display 14/600/-0.02em)
//    - Total in display 17/800/-0.035em
//    - Deal ID in mono (`#D-RATED`)
//
// 5. **State-specific block**:
//    - RATED → "Ratings exchanged" card with both ratings in COMPACT
//      format (13px stars, 10.5px tag pills, italic review). Smaller
//      than Mutual Reveal — user already saw them there. This is a
//      permanent record, not a celebration.
//    - DECLINED → "Decline note" decline-tone tile with italic quoted
//      note + "REASON: {reason}" mono footer. Falls back to "No note
//      was added." if Influencer didn't write one.
//    - EXPIRED → nothing. The timeline already tells the story.
//
// 6. **Coordination block** — single CTA tile:
//    - 40px accent-soft message-circle icon (radius 12)
//    - Display 14.5/700 "Open archived thread"
//    - Mono 9/0.18em "READ-ONLY · {N} MESSAGES"
//    - ArrowRight 16 accent
//    Tap → read-only thread view (deferred surface).
//    For EXPIRED + DECLINED with no messages: replace with dashed-
//    border tile saying "No messages exchanged. The request expired
//    before a conversation started." / "...declined right away."
//
// 7. **Sticky footer** — "← Back to history" outlined button. Single
//    action only.
//
// EXPLICITLY NOT HERE
// -------------------
// - No re-contact CTA (deferred to v2)
// - No dispute, report, share, export, delete actions
// - No editing of any kind — terminal means terminal
// - No celebration framing — terminal deals are records, not moments
//
// POV AWARENESS
// -------------
// All event titles, decline-note labels, and explanatory copy adapt to
// whether viewer is business or influencer. Same data, role-aware
// copy. Flows through a `viewerRole` prop like `getDealCaption`.
//
// Examples:
//   - request_sent (business viewer): "You sent the request"
//   - request_sent (influencer viewer): "FitBar TLV sent the request"
//   - accepted (business viewer): "Maya accepted"
//   - accepted (influencer viewer): "You accepted"
//
// IMMUTABILITY
// ------------
// Deal record is locked. Once a deal lands in Summary, NOTHING changes
// about it. Same invariant as Rating Flow.
//
// ENCODING ARTIFACTS (decoded here):
//   `Â·` → `·`,  `âª` → `₪`,  `â` in `RATED â N` → `★`,
//   `3Ã` → `3×`,  `â` in prose → `→` / `—`.
//
// =================================================================

import { useState } from "react";
import {
  ChevronLeft,
  Star,
  Check,
  ArrowRight,
  MessageCircle,
  Send,
  CheckCircle2,
  XCircle,
  Clock,
  Hash,
  Inbox,
  Sparkles,
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
// EVENT-META RESOLVER — single source of truth for timeline event
// rendering. Returns icon, title (POV-aware), and tone.
// =================================================================
function getEventMeta(event, deal, viewerRole) {
  const isBusiness = viewerRole === "business";
  const youOrThem = (actor) =>
    actor === "business"
      ? isBusiness
        ? "You"
        : deal.business.name
      : actor === "influencer"
        ? isBusiness
          ? deal.influencer.name.split(" ")[0]
          : "You"
        : null;

  switch (event.type) {
    case "request_sent":
      return {
        icon: <Send size={11} strokeWidth={2.4} color={T.accent} />,
        title: `${youOrThem(event.actor)} sent the request`,
        tone: "accent",
      };
    case "accepted":
      return {
        icon: <Check size={12} strokeWidth={3} color={T.accent} />,
        title: `${youOrThem(event.actor)} accepted`,
        tone: "accent",
      };
    case "viewed":
      return {
        icon: <Inbox size={11} strokeWidth={2.4} color={T.accent} />,
        title: `${youOrThem(event.actor)} opened the request`,
        tone: "accent",
      };
    case "marked_done":
      return {
        icon: <CheckCircle2 size={13} strokeWidth={2.4} color={T.accent} />,
        title: `${youOrThem(event.actor)} marked it done`,
        tone: "accent",
      };
    case "rated":
      return {
        icon: <Star size={11} fill={T.accent} color={T.accent} strokeWidth={1.5} />,
        title: `${youOrThem(event.actor)} rated`,
        tone: "accent",
      };
    case "deal_closed":
      return {
        icon: <Sparkles size={11} strokeWidth={2.2} color={T.accent} />,
        title: "Deal closed",
        tone: "accent",
      };
    case "expired":
      return {
        icon: <Clock size={11} strokeWidth={2.4} color={T.decline} />,
        title: "Request expired",
        tone: "decline",
      };
    case "declined":
      return {
        icon: <XCircle size={12} strokeWidth={2.4} color={T.decline} />,
        title: `${youOrThem(event.actor)} declined`,
        tone: "decline",
      };
    default:
      return {
        icon: <Hash size={11} strokeWidth={2.4} color={T.inkMuted} />,
        title: event.type,
        tone: "muted",
      };
  }
}

// (Full screen JSX bodies — DealSummaryScreen, Timeline, TimelineEvent,
//  RatingsArchive, DeclineDetail, CoordinationSnapshot, NoCoordinationTile —
//  follow the layout described in the header comment. The Tech Lead
//  should port each section using existing primitives from
//  components/rating/ where possible (CheckHero for celebrations is
//  NOT used here — Summary is intentionally non-celebratory).)
