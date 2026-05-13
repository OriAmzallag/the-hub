// =================================================================
// REFERENCE FILE — Deal Card (v0.8 lifecycle, both POVs)
// =================================================================
// Source: user-provided prototype, 2026-05-13.
//
// THIS IS THE CANONICAL DESIGN REFERENCE for the Deal Card feature.
// Renders the SAME mock deals from both Business and Influencer
// perspectives side-by-side, so reviewers can verify caption parity
// against the v0.8 enum.
//
// KEY DESIGN PRIMITIVES introduced here:
//
// 1. THE DEAL SHAPE
//    Each deal carries both counterparties + a unified state machine:
//      {
//        id, state, summary, money,
//        influencer: { name, photo },        // counterparty for business
//        business:   { name, monogram },     // counterparty for influencer
//        hoursLeft?: number,                  // PENDING only
//        completedSubstate?:                  // COMPLETED only
//          "neither-rated" | "business-rated" | "influencer-rated",
//        rating?: number,                     // RATED only
//        declineReason?: string,              // DECLINED only (uppercase)
//      }
//
// 2. CANONICAL RESOLVER — getDealCaption(deal, viewerRole)
//    Returns a richer shape than the v0.8 spec's bare {text, tone,
//    actionable} — also includes destination routing + hint copy:
//      {
//        text: string,
//        tone: "accent" | "muted" | "decline",
//        actionable: boolean,
//        destination: "incoming-request" | "thread" | "rating" | "summary",
//        destinationLabel: string,            // human-readable, for top bars
//        hint: string | null,                 // "Tap to respond" | "Tap to rate"
//      }
//    Tech Lead decides whether this stays one resolver or splits into
//    getDealCaption (pure text+tone+actionable) + getDealDestination.
//
// 3. DASHBOARD STRUCTURE
//    Two sections, no Earnings hero, no Quick Actions, no Stats grid:
//      - "Needs your attention" — actionable deals only (filter on
//        caption.actionable === true)
//      - "All deals" — everything else (actionable === false)
//    Section header is a SectionHeader with title + count chip.
//
// 4. COUNTERPARTY DISPLAY RULE
//    Business POV → sees Influencer counterparty (photo avatar 38×38).
//    Influencer POV → sees Business counterparty (monogram tile 38×38).
//    Same 10pt radius rounded square either way — never circles.
//
// 5. DEAL ROW VISUAL RECIPE (per row, 11/13 padding, radius 12, gap 11)
//    - Avatar 38×38 (radius 10).
//    - Middle column:
//      - Name: display 13.5 / weight 700 / -0.025em.
//      - Caption: mono 8.5 / 0.16em / uppercase / weight 600,
//        color = tone (accent | decline | inkMuted).
//      - Body: "{summary} · ₪{money}" body 11 inkMuted.
//    - Right column:
//      - If actionable + hint: hint mono 8 accent 0.12em uppercase
//        + ArrowRight 9 / 2.6.
//      - Else: ArrowRight 13 / 2.2 inkSubtle.
//    - Card fill:
//      - Actionable → accentSoft + accentBorder.
//      - Passive    → surface + border.
//    - Press: scale 0.98.
//
// 6. DESTINATION STUBS (where each card routes)
//    - "incoming-request" — PENDING (Business): the brief-review
//      surface where business accepts / declines / asks for clarity.
//    - "thread" — IN_PROGRESS, COMPLETED-awaiting-their-rating, and
//      Influencer's PENDING (awaiting response): the Coordination
//      Thread.
//    - "rating" — COMPLETED rate-now: the rating flow.
//    - "summary" — RATED, EXPIRED, DECLINED: read-only.
//    The prototype renders a stub destination screen with provenance
//    ("From card state {CAPTION}") for the kickoff demo; production
//    wires these to the real surfaces.
//
// CONFIRMED COPY DECISIONS:
//   - PENDING (Business): hint = "Tap to respond"
//   - COMPLETED rate-now:  hint = "Tap to rate"
//
// ENCODING ARTIFACTS in the original paste (decoded here):
//   `Â·` → `·`,  `âª` → `₪`,  `â` in `RATED â {N}` → `★`,
//   `â` in prose copy → `→` (action arrow) or `—` (em dash) or
//   `–` (en dash) depending on context.
//
// =================================================================

import { useState } from "react";
import {
  Bell,
  Star,
  Inbox,
  ArrowRight,
  ChevronLeft,
  MessageCircle,
  CheckCheck,
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
// MOCK DATA — same deals, viewed from both sides.
// Every state + sub-state has at least one fixture so the prototype
// exhaustively exercises the resolver.
// =================================================================
const DEALS = [
  {
    id: "d-1",
    state: "PENDING",
    influencer: { name: "Maya Cohen", photo: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&q=80" },
    business: { name: "Onza", monogram: "ON" },
    summary: "Instagram Reel",
    money: 350,
    hoursLeft: 47,
  },
  {
    id: "d-2",
    state: "IN_PROGRESS",
    influencer: { name: "Noa Berman", photo: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&q=80" },
    business: { name: "FitBar TLV", monogram: "FB" },
    summary: "Story Set",
    money: 180,
  },
  {
    id: "d-3",
    state: "COMPLETED",
    completedSubstate: "neither-rated",
    influencer: { name: "Daniel Levi", photo: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&q=80" },
    business: { name: "Sushi Bar", monogram: "SB" },
    summary: "Reel + Stories",
    money: 530,
  },
  {
    id: "d-4",
    state: "COMPLETED",
    completedSubstate: "influencer-rated",
    influencer: { name: "Yael Mizrahi", photo: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&q=80" },
    business: { name: "BeautyBar", monogram: "BB" },
    summary: "Story Set",
    money: 180,
  },
  {
    id: "d-4b",
    state: "COMPLETED",
    completedSubstate: "business-rated",
    influencer: { name: "Roni Kaplan", photo: "https://images.unsplash.com/photo-1554151228-14d9def656e4?w=200&q=80" },
    business: { name: "Studio Movement", monogram: "SM" },
    summary: "Pilates content",
    money: 290,
  },
  {
    id: "d-5",
    state: "RATED",
    rating: 5,
    influencer: { name: "Tomer Avraham", photo: "https://images.unsplash.com/photo-1463453091185-61582044d556?w=200&q=80" },
    business: { name: "Bellboy", monogram: "BB" },
    summary: "Event Appearance",
    money: 900,
  },
  {
    id: "d-6",
    state: "EXPIRED",
    influencer: { name: "Adi Shoham", photo: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=200&q=80" },
    business: { name: "Onza", monogram: "ON" },
    summary: "TikTok Native",
    money: 420,
  },
  {
    id: "d-7",
    state: "DECLINED",
    declineReason: "WRONG FIT",
    influencer: { name: "Maya Cohen", photo: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&q=80" },
    business: { name: "FitBar TLV", monogram: "FB" },
    summary: "Instagram Reel",
    money: 350,
  },
];

// =================================================================
// CANONICAL RESOLVER — v0.8 lifecycle (4 + 2 states)
// Single source of truth. Returns caption + tone + actionable +
// destination + destinationLabel + hint.
// =================================================================
function getDealCaption(deal, viewerRole) {
  const isBusiness = viewerRole === "business";

  if (deal.state === "PENDING") {
    return isBusiness
      ? {
          text: `RESPOND BY ${deal.hoursLeft}H`,
          tone: "accent",
          actionable: true,
          destination: "incoming-request",
          destinationLabel: "Incoming Request",
          hint: "Tap to respond",
        }
      : {
          text: "AWAITING RESPONSE",
          tone: "muted",
          actionable: false,
          destination: "thread",
          destinationLabel: "Coordination Thread",
          hint: null,
        };
  }

  if (deal.state === "IN_PROGRESS") {
    return {
      text: "IN PROGRESS",
      tone: "muted",
      actionable: false,
      destination: "thread",
      destinationLabel: "Coordination Thread",
      hint: null,
    };
  }

  if (deal.state === "COMPLETED") {
    const sub = deal.completedSubstate || "neither-rated";
    const iAlreadyRated =
      (isBusiness && sub === "business-rated") ||
      (!isBusiness && sub === "influencer-rated");
    if (iAlreadyRated) {
      return {
        text: "AWAITING THEIR RATING",
        tone: "muted",
        actionable: false,
        destination: "thread",
        destinationLabel: "Coordination Thread",
        hint: null,
      };
    }
    return {
      text: "RATE NOW",
      tone: "accent",
      actionable: true,
      destination: "rating",
      destinationLabel: "Rating Flow",
      hint: "Tap to rate",
    };
  }

  if (deal.state === "RATED") {
    return {
      text: `RATED ★ ${deal.rating || "5.0"}`,
      tone: "muted",
      actionable: false,
      destination: "summary",
      destinationLabel: "Read-only Summary",
      hint: null,
    };
  }

  if (deal.state === "EXPIRED") {
    return {
      text: "EXPIRED",
      tone: "decline",
      actionable: false,
      destination: "summary",
      destinationLabel: "Read-only Summary",
      hint: null,
    };
  }

  if (deal.state === "DECLINED") {
    const text =
      !isBusiness && deal.declineReason
        ? `DECLINED · ${deal.declineReason}`
        : "DECLINED";
    return {
      text,
      tone: "decline",
      actionable: false,
      destination: "summary",
      destinationLabel: "Read-only Summary",
      hint: null,
    };
  }

  return {
    text: "—",
    tone: "muted",
    actionable: false,
    destination: "thread",
    destinationLabel: "Coordination Thread",
    hint: null,
  };
}

// =================================================================
// DEAL ROW (the primitive)
//
// Same component, role-driven via getDealCaption().
// =================================================================
function DealRow({ deal, viewerRole, onTap }) {
  const caption = getDealCaption(deal, viewerRole);
  const isBusiness = viewerRole === "business";
  const captionColor =
    caption.tone === "accent"
      ? T.accent
      : caption.tone === "decline"
      ? T.decline
      : T.inkMuted;

  // Counterparty: business sees influencer (photo); influencer sees
  // business (monogram).
  const counterparty = isBusiness ? deal.influencer : deal.business;
  const counterpartyHasPhoto = isBusiness;

  return (
    <button
      onClick={onTap}
      style={{
        width: "100%",
        padding: "11px 13px",
        background: caption.actionable ? T.accentSoft : T.surface,
        border: `1px solid ${caption.actionable ? T.accentBorder : T.border}`,
        borderRadius: 12,
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        gap: 11,
        textAlign: "left",
        transition: "transform 0.12s ease",
      }}
    >
      {/* Avatar */}
      {counterpartyHasPhoto ? (
        <div
          style={{
            width: 38,
            height: 38,
            borderRadius: 10,
            overflow: "hidden",
            flexShrink: 0,
            border: `1px solid ${T.borderStrong}`,
          }}
        >
          <img
            src={counterparty.photo}
            alt=""
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        </div>
      ) : (
        <div
          style={{
            width: 38,
            height: 38,
            borderRadius: 10,
            background: T.surfaceAlt,
            border: `1px solid ${T.borderStrong}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <span
            style={{
              fontSize: 13,
              fontWeight: 800,
              color: T.ink,
              letterSpacing: "-0.04em",
            }}
          >
            {counterparty.monogram}
          </span>
        </div>
      )}

      {/* Middle column: name, caption, summary */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{
            fontSize: 13.5,
            fontWeight: 700,
            color: T.ink,
            letterSpacing: "-0.025em",
            marginBottom: 2,
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {counterparty.name}
        </div>
        <div
          style={{
            fontSize: 8.5,
            color: captionColor,
            letterSpacing: "0.16em",
            textTransform: "uppercase",
            fontWeight: 600,
            marginBottom: 3,
          }}
        >
          {caption.text}
        </div>
        <div style={{ fontSize: 11, color: T.inkMuted }}>
          {deal.summary} · ₪{deal.money}
        </div>
      </div>

      {/* Right column: hint OR chevron */}
      {caption.hint && caption.actionable ? (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 3,
            fontSize: 8,
            color: T.accent,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            fontWeight: 600,
            whiteSpace: "nowrap",
          }}
        >
          {caption.hint}
          <ArrowRight size={9} strokeWidth={2.6} />
        </div>
      ) : (
        <ArrowRight size={13} strokeWidth={2.2} color={T.inkSubtle} />
      )}
    </button>
  );
}

// (Dashboard + DestinationStub shells follow the pattern shown in the
// prototype paste. The Tech Lead should decide whether the destination
// surfaces in production wire to existing screens or get their own
// stubs in the first PR.)
