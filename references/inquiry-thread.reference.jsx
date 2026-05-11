// =================================================================
// REFERENCE FILE — Inquiry Thread Screen (Business + Influencer)
// =================================================================
// Source: user-provided reference, 2026-05-11
//
// PURPOSE: Visual + behavioral reference. Same screen for both personas
// (Business / Influencer). The viewer role decides:
//   - Which bubbles align right (current user) vs. left (counterpart)
//   - Whose name + monogram/avatar shows in the top bar (the other side)
//   - Which template chip set is used at the bottom (role-specific)
//
// React Native + Reanimated + StyleSheet only. Use existing tokens from
// constants/theme.ts. Honor the design-system discipline rules:
//   - one accent (#FF7A29); no red anywhere (use decline tones for
//     negative actions if needed)
//   - mono = system voice (uppercase, tracked)
//   - numbers always paired with a label / unit (e.g. ₪530, the deal
//     count + total in the context card)
//   - avatars are 12px rounded squares, never circles (the monogram
//     tile in the top bar follows this — 36×36, radius 10 ≈ avatar)
//
// IMPORTANT — TERMINOLOGY
// The reference uses the old terms "hunter" and "talent" everywhere.
// In this codebase those map to:
//   hunter → business
//   talent → influencer
// All ported code must use the canonical names. The constants and
// types should not leak "hunter"/"talent" into the implementation.
//
// SCREENS / SUBCOMPONENTS:
//   1. TopBar          — back button + counterpart's monogram + name +
//                         verified badge.
//   2. DealContextCard — collapsible card showing the underlying deal
//                         (status pill, services, total, date range,
//                         calendar icon). Tappable header expands/
//                         collapses; uses accent-soft surface when
//                         expanded? — see expanded vs collapsed treatments.
//   3. Message thread  — chronological list of:
//        - SystemMessage   (centered pill — "Deal accepted · May 9 14:32")
//        - Message bubble  (left for counterpart, right for current user;
//                            attachments rendered as a tile with icon +
//                            filename + "IMAGE" mono caption)
//        - HandoffOfferCard (when current user proposed WhatsApp handoff:
//                            accentSoft surface, "You suggested WhatsApp",
//                            "Pending" pulsing dot)
//        - HandoffAcceptedCard (after both sides accepted: surface card
//                            with WhatsApp icon tile, primary accent CTA
//                            linking to wa.me/<phone>)
//   4. Template chips  — horizontal scroll of quick-reply chips.
//                         Templates differ by role:
//          Influencer side: ["Confirmed ✓", "Drafts ready",
//                            "All delivered ✓", "Let's hop on WhatsApp"]
//          Business side:   (mirror — designer to decide canonical set,
//                            likely: ["Got it", "When can you start?",
//                            "Send the draft", "Let's hop on WhatsApp"])
//        The "Let's hop on WhatsApp" chip is the handoff trigger and
//        uses accentSoft + accent text + MessageCircle icon.
//   5. Input bar       — paperclip (attach), single-line growing
//                         textarea, send button. Send is disabled (no
//                         accent glow) when draft is empty; active state
//                         is accent w/ shadow.
//
// ROUTING:
//   - /inquiries/[threadId]  (universal — both personas reach it from
//                              their own Inquiries tab)
//   - Inquiries → tap a ThreadRow → push to /inquiries/[threadId]
//
// VIEWER-ROLE DETECTION:
//   - Pass via route param or derive from a persona store. The thread
//     data itself carries both `business` and `influencer` parties;
//     the screen renders depending on which one is the current user.
//
// READ RECEIPTS:
//   - `me`-side bubbles show a CheckCheck icon under the timestamp:
//        muted gray (inkSubtle) = sent
//        accent = read
//
// HANDOFF STATE MACHINE:
//   null → "pending" (current user offered, waiting on counterpart) →
//   "accepted" (both shared numbers, WhatsApp CTA card appears).
//   In the reference the demo auto-accepts after 2.5s — real impl will
//   wait for the counterpart's tap.
//
// ENCODING ARTIFACTS in this file (already known from previous refs):
//   `âª`   → `₪`
//   `Ã`    → `×`
//   `Â·`   → `·`
//   `â`    → `→` or `—` (em-dash) depending on context — see lines
//             where it sits between two words ("acceptedAt: May 9 Â· 14:32"
//             vs. trailing "Confirmed â" / "Sending now â" which are
//             checkmarks → use ✓ for the confirmation labels and an
//             arrow only where one clearly fits the sentence)
//   `ð`    → emoji (likely 👋). The "Hey Maya ð" greeting can be left
//             as plain text in production copy; emoji is reference-only.
//
// =================================================================

import { useState, useRef, useEffect } from "react";
import {
  ChevronLeft,
  Star,
  CheckCircle2,
  Send,
  Paperclip,
  ImageIcon,
  X,
  ChevronDown,
  ChevronUp,
  Calendar,
  Phone,
  MessageCircle,
  Check,
  CheckCheck,
} from "lucide-react";

// =================================================================
// DESIGN TOKENS — Metal × Sunset Orange (locked, from system)
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

  fontDisplay: "'Inter Tight', system-ui, sans-serif",
  fontBody: "'Inter Tight', system-ui, sans-serif",
  fontMono: "'JetBrains Mono', monospace",
};

// =================================================================
// MOCK DATA
// =================================================================
const DEAL = {
  id: "deal_4f8a",
  status: "active",
  hunter: {
    name: "FitBar TLV",
    monogram: "FB",
    verified: true,
    phone: "+972501234567",
  },
  talent: {
    name: "Maya Cohen",
    firstName: "Maya",
    phone: "+972529876543",
  },
  services: [
    { name: "Instagram Reel", platform: "IG REEL", price: 350 },
    { name: "Story Set", platform: "IG STORY", price: 180 },
  ],
  total: 530,
  date: { label: "Next week", range: "May 16 → May 23" },
  acceptedAt: "May 9 · 14:32",
};

// "Maya" is the current user — her bubbles align right; FitBar's align left.
const TEMPLATES_TALENT = [
  { id: "confirmed", label: "Confirmed ✓" },
  { id: "drafts", label: "Drafts ready" },
  { id: "delivered", label: "All delivered ✓" },
  { id: "whatsapp", label: "Let's hop on WhatsApp", isHandoff: true },
];

const INITIAL_MESSAGES = [
  {
    id: "sys-1",
    type: "system",
    icon: "check",
    text: "Deal accepted",
    timestamp: "May 9 · 14:32",
  },
  {
    id: "msg-1",
    type: "message",
    side: "them", // FitBar
    text: "Hey Maya 👋 Super excited to work together. Just sent the brief through booking — let me know if anything's missing.",
    timestamp: "14:35",
    read: true,
  },
  {
    id: "msg-2",
    type: "message",
    side: "me", // Maya
    text: "Thanks! Brief looks great. Quick question — do you have a high-res logo I can drop in for the story sticker?",
    timestamp: "14:48",
    read: true,
  },
  {
    id: "msg-3",
    type: "message",
    side: "them",
    text: "Sending now →",
    timestamp: "14:51",
    read: true,
  },
  {
    id: "msg-4",
    type: "message",
    side: "them",
    attachment: { kind: "image", label: "fitbar-logo.png" },
    timestamp: "14:51",
    read: true,
  },
];

// =================================================================
// MAIN
// =================================================================
export default function InquiryThreadScreen() {
  const [messages, setMessages] = useState(INITIAL_MESSAGES);
  const [draft, setDraft] = useState("");
  const [contextExpanded, setContextExpanded] = useState(true);
  const [whatsappHandoff, setWhatsappHandoff] = useState(null);
  // null | 'pending' (Maya offered, waiting for FitBar) | 'accepted' (numbers shared)

  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, whatsappHandoff]);

  const sendMessage = (text) => {
    if (!text.trim()) return;
    setMessages((prev) => [
      ...prev,
      {
        id: `msg-${Date.now()}`,
        type: "message",
        side: "me",
        text: text.trim(),
        timestamp: now(),
        read: false,
      },
    ]);
    setDraft("");
  };

  const handleTemplateClick = (template) => {
    if (template.isHandoff) {
      // Open handoff flow
      offerWhatsAppHandoff();
      return;
    }
    sendMessage(template.label);
  };

  const offerWhatsAppHandoff = () => {
    setMessages((prev) => [
      ...prev,
      {
        id: `sys-${Date.now()}`,
        type: "handoff-offer",
        side: "me",
        timestamp: now(),
      },
    ]);
    setWhatsappHandoff("pending");
  };

  // Demo: simulate FitBar accepting after 2.5 seconds
  useEffect(() => {
    if (whatsappHandoff === "pending") {
      const timer = setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          {
            id: `sys-${Date.now()}`,
            type: "handoff-accepted",
            timestamp: now(),
          },
        ]);
        setWhatsappHandoff("accepted");
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, [whatsappHandoff]);

  // (full JSX body matches the original reference — Phone Frame wrap,
  //  TopBar, DealContextCard, scrollable messages, template chips,
  //  input bar. See subcomponent definitions below.)
  return null;
}

// =================================================================
// SUBCOMPONENTS — see full reference body for the exact JSX & pixel
// values. Key bits each one MUST preserve when ported to RN:
// =================================================================
//
// TopBar
//   - Back button: 38×38 circle, `surface` bg + `border`, ChevronLeft 20.
//   - Counterpart monogram tile: 36×36, radius 10, `surfaceAlt` +
//     `borderStrong`. Letters use displayXl rules (-0.04em, weight 800,
//     13px in the reference).
//   - Name line: rowTitle (15px, weight 700, -0.025em) + CheckCircle2
//     13px filled with accent (verified badge).
//   - Bottom border `border` 1px.
//
// DealContextCard (collapsible)
//   - Outer: `surface` card, 14px radius, 1px `border`.
//   - Header row: "ACTIVE" mono (9.5px / 0.2em, accent), 3×3 inkSubtle
//     dot separator, "{services.length} services · ₪{total}" in
//     display 13.5px weight 700 -0.02em. Chevron up/down on the right.
//   - Expanded body: stacked service rows (name in inkMuted 13px / 500,
//     price in display weight 700 -0.02em with ₪ prefix). Date row
//     with Calendar icon 11px + mono 9.5px / 0.15em inkMuted uppercase.
//
// SystemMessage
//   - Centered pill, surfaceAlt + border, padding 6×12, radius 100.
//   - Check icon 11px accent + mono 9.5px / 0.18em inkMuted upper "TEXT · TIMESTAMP".
//
// Message bubble
//   - Bubble: max 78% width.
//   - `me`: background `ink`, color `bg`, asymmetric radius
//     "18 18 4 18" (sharp bottom-right corner). Font weight 500.
//   - `them`: background `surface`, color `ink`, 1px `border`,
//     radius "18 18 18 4" (sharp bottom-left corner). Font weight 400.
//   - Both 14.5px / line-height 1.4, word-break.
//   - Below bubble: mono 9px / 0.1em inkSubtle timestamp + CheckCheck
//     icon (11px) coloured `accent` when read, `inkSubtle` when sent
//     only. CheckCheck only on `me` bubbles.
//
// ImageAttachment
//   - Same bubble shape/colors as the corresponding text bubble.
//   - 36×36 icon tile (surface or surfaceAlt) with ImageIcon 16px.
//   - Filename in display 13 / weight 600 / -0.02em. "IMAGE" mono caption
//     beneath, 9px / 0.12em uppercase inkMuted.
//   - Min width 200.
//
// HandoffOfferCard ("pending")
//   - `accentSoft` + `accentBorder`, radius 14, padding 16.
//   - MessageCircle 14 accent + "YOU SUGGESTED WHATSAPP" mono 9.5 /
//     0.18em accent semi-bold.
//   - Body copy 13.5 ink line-height 1.5: "Waiting for {hunter.name}
//     to confirm sharing numbers. Once they accept, you'll both get a
//     WhatsApp link to continue off-platform."
//   - 6×6 pulsing accent dot + "PENDING" mono accent 9px / 0.18em.
//
// HandoffAcceptedCard ("accepted")
//   - `surface` + `borderStrong`, radius 14, padding 18×16.
//   - Header: 32×32 accent icon tile w/ MessageCircle 16 in `bg`,
//     title "Numbers shared" display 14 weight 700 -0.025em, and a
//     mono 9px / 0.18em inkMuted "CONTINUE ON WHATSAPP" subtitle.
//   - Body copy 12.5 inkMuted line-height 1.5: "Important commitments
//     still belong here — confirmations, deliverables, ratings."
//   - Primary accent pill button (radius 100, padding 13×20, accent bg,
//     `bg`-color text, accent shadow) labelled "Open WhatsApp with
//     {counterpart.name}", linking to `wa.me/<phone>`.
//
// Template chips
//   - Horizontal scroll, 8px gap. Each chip 9×14 padding, radius 100,
//     border. Default = `surface` bg + `border` + `ink`. Handoff chip
//     = `accentSoft` + `accentBorder` + `accent` text + MessageCircle
//     13px leading icon.
//   - Bar separator above (`border` 1px top).
//
// Input bar
//   - 42×42 paperclip button (`surface` + `border`).
//   - Textarea inside `surface` rounded 22px container, border becomes
//     `borderStrong` when the draft has content.
//   - Send button 42×42 round. Disabled = `surface` + `border` + inkMuted
//     icon. Active = `accent` bg + `bg` icon + accent shadow.
//   - Send only triggers when draft.trim() length > 0.
//
// =================================================================
// HELPERS
// =================================================================
function now() {
  const d = new Date();
  const h = d.getHours().toString().padStart(2, "0");
  const m = d.getMinutes().toString().padStart(2, "0");
  return `${h}:${m}`;
}
