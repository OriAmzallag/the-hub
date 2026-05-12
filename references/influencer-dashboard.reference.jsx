// =================================================================
// REFERENCE FILE — Influencer Dashboard
// =================================================================
// Source: user-provided reference, 2026-05-12
//
// PURPOSE: The Influencer-side dashboard. Same SKELETON as the Business
// Dashboard (top bar + scroll body + sections + tab bar) but with
// Influencer-specific sections and data. Lean heavily on existing
// Business Dashboard primitives where the structure matches.
//
// TERMINOLOGY: the reference uses "TALENT" / "Hunter" everywhere.
// Map to the canonical names in the codebase:
//   - "Talent" → influencer (the current user)
//   - "Hunter" → business (the counterpart)
// Never let "talent" or "hunter" leak into production code.
//
// SCREEN STRUCTURE (top → bottom):
//
//   1. TOP BAR (padding 16/20 + 14)
//      - Left: "Good morning" mono caption (mono 10 / 0.2em / inkMuted /
//        weight 500 / uppercase) + display 26 weight 800 -0.04em
//        "{firstName}." headline (with trailing period).
//      - Right: 38×38 Bell icon-button (surface bg + border) with an
//        absolute-positioned 8×8 accent dot (border 2px bg, accent
//        shadow) at top-right indicating unread notifications.
//
//   2. HERO EARNINGS CARD (padding 0/20 below)
//      Two states:
//      a) DEFAULT (Maya has earnings):
//         - "EARNED THIS MONTH" mono caption (left) + accentSoft pill
//           on the right with ArrowUpRight 11 / strokeWidth 2.6 / accent
//           + "+{trendPercent}%" in mono 9.5 weight 600 accent 0.08em.
//         - Big amount: display 42 weight 800 -0.045em line 1
//           "₪{thisMonth.toLocaleString()}".
//         - Bottom split (1px border-top, padding-top 12): two columns
//           separated by a 1×28 vertical divider.
//           - Left: mono 9 / 0.18em / inkMuted "DEALS" + display 16
//             weight 700 -0.025em ink "{thisMonthCount}".
//           - Right: same mono caption "ALL-TIME" + display 16 weight
//             700 ink "₪{allTime.toLocaleString()}".
//      b) EMPTY (thisMonth === 0):
//         - "THIS MONTH" mono caption.
//         - Display 26 weight 800 -0.04em line 1.1 ink: "Your first
//           deal is\naround the corner."
//         - Body 13 inkMuted 1.5: "Browse perks or sharpen your
//           storefront — opportunities are coming."
//      Card styles: padding 22/20, surface bg, 1px border, radius 18.
//
//   3. NEEDS YOUR ATTENTION (only when ATTENTION_ITEMS.length > 0)
//      - Section header: display 22 weight 700 -0.035em "Needs your
//        attention".
//      - Vertical stack (gap 8) of AttentionItem cards.
//      - First item is "primary" (accentSoft bg + accentBorder, accent
//        text on subtitle + earnings + chevron + kind-icon-overlay).
//      - Rest of items: surface bg + border (default tone).
//      - Each card layout: 44×44 monogram tile (surfaceAlt + borderStrong)
//        with a small kind-icon overlay (20×20 circle bottom-right of
//        the monogram) + title (display 14.5 weight 700 -0.025em) +
//        subtitle (mono 9.5 / 0.15em uppercase) + optional ₪earnings
//        (display 16 weight 700) + ChevronRight 18.
//
//   4. ACTIVE DEALS
//      - Section header row: display 22 "Active deals" (left) + mono
//        9.5 inkMuted uppercase count "{N}" (right).
//      - Vertical list (gap 8) of DealRow cards.
//      - DealRow: 40×40 business monogram tile + business name (display
//        15 weight 700) + mono row: status label (accent if
//        statusAccent, else inkMuted) · 3×3 dot · "{N} services" +
//        ₪earnings (display 16 weight 700) + ChevronRight 16
//        (accent if statusAccent).
//      - Card: padding 14/16, surface + border, radius 14.
//
//   5. QUICK ACTIONS — section header "Quick actions" + 2-up grid.
//      - Left tile (primary): accent bg + accent shadow + bg-colored
//        icon tile (36×36 radius 10 surfaceAlt-tinted overlay) + Gift
//        icon + "Browse perks" / "BARTER" caption.
//      - Right tile (secondary): surface bg + border + ink Edit3 +
//        "Edit storefront" / "PROFILE" caption.
//      - Both 18/16 padding, min height 110, radius 14, gap 24 between
//        icon and label.
//
//   6. ACTIVE CLAIMS
//      - Section header row: display 22 "Active claims" + accent "SEE
//        ALL →" mono 10.5 0.15em link on the right.
//      - List of PerkClaimRow cards (one in the mock).
//      - PerkClaimRow: 40×40 business monogram tile + perk title
//        (display 15 weight 700) + mono accent "DELIVER BY {date}" +
//        ChevronRight 16 accent.
//
//   7. OVERVIEW — section header "Overview" + 3-up StatTile grid.
//      - Active (count), Rating (4.9 + accent Star 11), This month
//        (count + "DEALS" hint mono).
//      - Tile: padding 14, surface + border, radius 14, minHeight 86,
//        space-between with mono label up top, value down bottom
//        (display 24 weight 800 -0.04em + optional Star + mono hint).
//
//   8. TAB BAR — the shared CustomTabBar from components/ui/. NOTHING
//      new to build here.
//
// REUSE PLAN vs the existing Business Dashboard:
//   - `components/business/AttentionBanner.tsx` — Business has its own
//     attention banner; Influencer's AttentionItem has the SAME shape
//     conceptually but different specifics (monogram + kind-icon
//     overlay, ₪ earnings on the right when relevant). Likely better
//     to build a new InfluencerAttentionItem subcomponent rather than
//     force the Business banner to do double duty.
//   - `components/business/DealRow.tsx` — the Business DealRow shows
//     influencer details (photo + name). For Influencer-side, the
//     DealRow shows BUSINESS details (monogram + name). Shape is
//     mirror-image. Tech Lead: decide whether to lift a generic
//     DealRow to a shared location with `counterparty` data OR build
//     an Influencer-specific DealRow. Building separately is fine for
//     MVP — they read different mock shapes anyway.
//   - `components/business/ActionTile.tsx` — already supports a
//     `primary` variant. REUSE directly (cross-folder import) — works
//     for both personas.
//   - `components/business/StatTile.tsx` — has `starred` + `hint`
//     props. REUSE directly.
//   - `components/business/SectionHeader.tsx` — REUSE if it accepts a
//     trailing slot for the count / "SEE ALL →" / etc. Otherwise build
//     the section headers inline (they're trivial).
//
// MOCK DATA SHAPE (in `constants/mockInfluencerDashboard.ts` — NEW):
//
//   export const MAYA_DASHBOARD = {
//     influencer: { name: "Maya Cohen", firstName: "Maya" },
//     earnings: {
//       thisMonth: 2460,
//       thisMonthCount: 4,
//       allTime: 9840,
//       trend: "up",          // "up" | "down" | "flat"
//       trendPercent: 32,
//     },
//     attentionItems: [
//       { id, kind: "new-request" | "rate" | "deliver", title, subtitle,
//         earnings?, monogram, iconKey },
//     ],
//     deals: [
//       { id, business: { name, monogram }, services: "2 services",
//         earnings: 530, status: "in_progress" | "respond" | "rate" |
//                                 "delivered",
//         statusLabel: "IN PROGRESS" | "RESPOND · 67H LEFT" | "RATE NOW"
//                       | "AWAITING REVIEW",
//         statusAccent: true | false },
//     ],
//     perkClaims: [
//       { id, title: "Dinner for two at Onza", business: "Onza",
//         monogram: "ON", actionRequired, deadline: "DELIVER BY MAY 14",
//         status: "to_deliver" },
//     ],
//     stats: { activeDeals: 4, rating: 4.9, thisMonthCount: 4 },
//   };
//
// MOTION: the reference uses the same `fade-up` keyframe + `pulse-dot`
// utility we already have on the Business Dashboard. Reuse the same
// patterns (Reanimated useFadeUpEntrance or inline) — don't introduce
// new animation primitives.
//
// ENCODING ARTIFACTS in the original paste (decoded for the port):
//   `âª` → `₪`,  `Ã` → `×`,  `Â·` → `·`,  stray `â` → `→` / `—`,
//   `cafÃ©` → `café`.
//
// =================================================================

import { useState } from "react";
import {
  Search,
  LayoutDashboard,
  MessageSquare,
  User,
  ChevronRight,
  Star,
  Bell,
  Gift,
  Edit3,
  TrendingUp,
  Inbox,
  Calendar,
  ArrowUpRight,
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
};

// (Mock data sections — TALENT / ATTENTION_ITEMS / EARNINGS / DEALS /
//  PERK_CLAIMS / STATS — match the shapes documented in the header
//  comment. Use the exact values from the original user paste.
//  The full screen JSX bodies — TalentDashboard / EarningsCard /
//  AttentionItem / DealRow / ActionTile / PerkClaimRow / StatTile —
//  follow the pixel values laid out in the structure section.)
