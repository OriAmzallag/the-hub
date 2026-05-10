// =================================================================
// REFERENCE FILE — Booking Request bottom sheet
// =================================================================
// Source: Tom-provided reference, 2026-05-10
//
// PURPOSE: Visual reference ONLY. Do NOT port 1:1.
// React Native + NativeWind + Reanimated + StyleSheet only — no inline
// styles, no CSS @keyframes, no <input>/<textarea>/<img>, no
// `backdropFilter` strings, no phone-frame wrapper.
//
// The booking-request sheet rises over the Influencer Storefront when the
// Business taps "Request a booking" on the storefront's StickyCTA. The
// storefront stays dimmed in the background, providing context — this
// is NOT a separate route, it's an overlay on the storefront screen.
// (PRD v0.3 §2.3.3 is the canonical spec for this surface.)
//
// Structure:
//   <Storefront below, dimmed>          (existing screen, behind a scrim)
//   <Scrim>                              (rgba(0,0,0,0.55) + blur(2))
//   <Sheet>                              (rises 100% → 0% in 420ms)
//     ├─ Drag handle (pan-down dismiss, same pattern as FilterSheet)
//     ├─ Header: mono "BOOKING · {NAME}" + display "Request" + close X
//     ├─ Scrollable body:
//     │    Services section          — line items with "01"/"02" badges, removable
//     │    When section              — 2×2 chip grid (This week, Next week, In 2 weeks, Pick a date)
//     │    The brief section         — textarea, 300 char hard cap, counter appears after typing
//     │    Total section             — line items + total + budget confirmation checkbox
//     │    Footer note               — mono "{NAME} RESPONDS WITHIN 72H"
//     └─ Sticky submit               — "Send request →", disabled unless all required fields valid
//
// Validation — submit enabled when ALL of:
//   - At least 1 service in the list
//   - Date chip selected
//   - Brief has non-empty content (after trim)
//   - Budget confirmation checkbox is checked
//
// On submit → the SAME sheet morphs in place to a success state:
//   ├─ Hero check icon (72px accent circle) with success-pop animation
//   ├─ Mono "REQUEST SENT"
//   ├─ Display "On its way to {first name}." (38px, 800)
//   ├─ Sub copy "She typically responds within 72 hours…"
//   ├─ Summary card (services count + total)
//   ├─ Primary CTA "View request status →" (TODO route, future PR)
//   └─ Secondary CTA "Back to discovery" — closes the sheet
// During the success state the scrim is NOT dismissable — only the
// CTAs close the sheet (intentional anchor; user must acknowledge).
//
// Behaviors:
//   - Service removal updates the order badges (01, 02 → 01 if you remove
//     the first one, etc.).
//   - All services removed → empty state in the sheet:
//     "ALL SERVICES REMOVED — GO BACK TO ADD SOME" mono caption inside a
//     dashed-border surface. Submit disabled.
//   - Brief is hard-clipped via slice(300) so paste doesn't blow past the
//     cap. Counter shows accent color when at the cap.
//   - "Pick a date" chip opens a calendar picker — out of scope this PR.
//     Tapping it just selects the chip; calendar component lands later.
//
// Animations (use react-native-reanimated, NOT CSS keyframes):
//   - sheetRise        420ms cubic-bezier(0.32, 0.72, 0, 1), translateY 100%→0%
//   - sheetFall        320ms same easing, reverse
//   - overlayFade      300ms ease-out, opacity 0→1
//   - successPop       500ms cubic-bezier(0.34, 1.56, 0.64, 1), scale 0.6→1.05→1, opacity 0→1
//   - fadeUp           400ms ease-out, opacity 0→1, translateY 8→0 (success state copy + line items)
//   - pulse-dot        2s ease-in-out infinite, opacity 1↔0.4 (storefront's existing dot)
//
// Mojibake note: source had encoding artifacts:
//   `âª`  → `₪`
//   `Ã`   → `×`
//   `→`   → `→` (sometimes shown as `â`)
// In this file the correct Unicode characters are used.
//
// =================================================================

// (full body retained below — design tokens, mock data, all subcomponents)

import { useState, useRef, useEffect } from "react";
import {
  ChevronLeft,
  Share,
  Heart,
  Star,
  MapPin,
  Instagram,
  Music2,
  Youtube,
  CheckCircle2,
  Clock,
  ArrowRight,
  X,
  Calendar,
  Check,
} from "lucide-react";

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

  fontDisplay: "'Inter Tight', system-ui, sans-serif",
  fontBody: "'Inter Tight', system-ui, sans-serif",
  fontMono: "'JetBrains Mono', monospace",
};

const INFLUENCER = {
  name: "Maya Cohen",
  services: [
    { id: 1, name: "Instagram Reel", platform: "IG REEL", price: 350, delivery: "48h" },
    { id: 2, name: "Story Set", platform: "IG STORY", price: 180, delivery: "24h" },
    { id: 3, name: "TikTok Native", platform: "TIKTOK", price: 420, delivery: "3 days" },
    { id: 4, name: "Event Appearance", platform: "EVENT", price: 900, delivery: "Custom" },
  ],
};

// Date chips — first 3 are computed week-relative; "Pick a date" opens calendar (future)
const QUICK_DATES = [
  { id: "this", label: "This week", days: "May 9 – May 16" },
  { id: "next", label: "Next week", days: "May 16 – May 23" },
  { id: "two",  label: "In 2 weeks", days: "May 23 – May 30" },
  { id: "pick", label: "Pick a date", days: null },
];

const MAX_BRIEF = 300;

// =================================================================
// SECTIONS — one paragraph each on what to take from the original
// =================================================================
//
// SERVICES SECTION
// ----------------
// Padding 14×16, surface bg, border, radius 14, gap between rows = 8.
// Each row: 24×24 accent circle with mono "01"/"02" centered, then
// flex:1 column with name (display 15 weight 700, lineHeight 1.1) +
// platform/delivery line (mono 9.5, inkMuted, 0.15em, "PLATFORM · DELIVERY"),
// then ₪price (display 18 weight 700), then 28×28 borderless circle with
// X icon — tap to remove. fade-up animation on each row.
//
// EMPTY STATE for services: padded surface with dashed-border
// (`borderStrong`), mono uppercase "ALL SERVICES REMOVED — GO BACK TO ADD SOME"
// centered. The sheet's submit stays disabled.
//
// WHEN SECTION
// ------------
// 2×2 grid (gap 8), each chip is 14×14 padding, surface bg, radius 14.
// Active chip: accentSoft bg, accentBorder, plus a 4px accentSoft ring
// shadow. Display 14 weight 700 label on top, mono 9.5 inkMuted
// uppercase day-range below. "Pick a date" shows Calendar icon next to
// label and "CALENDAR" in the day-range slot.
//
// BRIEF SECTION
// -------------
// Surface card with border that subtly tints (`borderStrong`) once the
// user has typed. Padding 14 16 8 inside. TextInput multiline rows=5,
// body 14, ink color, lineHeight 1.5. Counter mono 9.5 at bottom-right,
// only visible after typing, switches to accent color at the 300 cap.
// Use `slice(300)` on input to hard-clip pastes.
//
// TOTAL SECTION
// -------------
// Surface card padding 18×18, radius 14. Line items (gap 10) showing
// service name (body 13.5 inkMuted) + ₪price (display 14 ink). Hairline
// divider, then "TOTAL" mono uppercase label + ₪total (display 28
// weight 800). Below: budget confirmation checkbox (22×22 rounded square,
// transparent w/ borderStrong when unchecked, accent w/ Check icon when
// checked) + label "I confirm the total budget of ₪{total}".
//
// FOOTER NOTE
// -----------
// Mono 9.5, inkSubtle, 0.12em, uppercase, centered: "{first name} RESPONDS
// WITHIN 72H". Sits between the Total card and the sticky button.
//
// STICKY SUBMIT
// -------------
// Pill button, full-width, 18×22 padding. Active = accent bg + bg-color
// label + 8px·24px accentShadow glow. Disabled = surface bg, border,
// inkMuted text, no shadow. On press → morph to success state.
//
// SUCCESS STATE
// -------------
// Replaces the form contents inside the same sheet (no route change).
// 32×22 padding, vertical layout. Drag handle stays at top.
//   - 72×72 accent circle with Check icon, success-pop animation, drop
//     shadow `0 12px 36px accentShadow`.
//   - Mono accent "REQUEST SENT", letterSpacing 0.25em.
//   - Display 38 weight 800: "On its way\nto {first name}." (centered,
//     line-break before name).
//   - Sub copy 14.5, ink @0.8 opacity, max 30ch, centered.
//   - Summary card: services count + total, divided.
//   - Primary "View request status →" CTA + secondary "Back to discovery"
//     mono ghost button.
