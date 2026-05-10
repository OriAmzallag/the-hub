// =================================================================
// REFERENCE FILE — Inquiries inbox (Business + Influencer personas)
// =================================================================
// Source: Tom-provided reference, 2026-05-10
//
// PURPOSE: Visual reference ONLY. Do NOT port 1:1.
// React Native + NativeWind + Reanimated + StyleSheet only.
//
// One screen, two personas. The screen body is identical between
// Business (Business) and Influencer (Influencer); the only difference is
// the avatar mechanic on each ThreadRow:
//
//   - Business view: counterparty is a Influencer → photo avatar
//                    (44×44 rounded square, expo-image of their photo)
//   - Influencer view:   counterparty is a Business → monogram avatar
//                    (44×44 rounded square, surfaceAlt bg, 2-char
//                     mono initials in display 800 ink)
//
// This PR builds the Business mount only. Influencer mount lands when the
// influencer route group + tab structure exists.
//
// Sections (top to bottom inside the phone frame):
//   1. Top bar           — display "Inquiries" + mono accent "{N} unread"
//                          on the right (only when N>0)
//   2. Search bar        — pill input, magnifier icon, "Search by name..."
//                          placeholder. Border tint shifts to borderStrong
//                          when input has content.
//   3. Body              — switches between three render states:
//        a. EMPTY        — no threads exist at all (persona-aware copy)
//        b. NO RESULTS   — search has content but matches nothing
//        c. CONTENT      — pinned section + chronological section
//   4. Tab bar           — same custom tab bar; Inquiries is active;
//                          unread count shows as the badge
//
// CONTENT layout:
//   • SectionHeader "Needs your attention" appears when ANY thread is
//     pinned (needsAttention OR unread > 0). Pinned threads list
//     beneath it (gap 6).
//   • SectionHeader "All inquiries" appears below pinned (only when
//     pinned and other both have items). Other threads list beneath it.
//   • If only one bucket has items, that bucket's header is the
//     "Needs your attention" / "All inquiries" matching its content.
//
// THREAD ROW shape (44×44 avatar / flex:1 details / right column):
//   • Avatar — 12px rounded square (per design-system rule, NEVER circle)
//   • Top inner row — name (display 14.5 weight 700, ellipsis) + mono
//     timestamp on the right (9px, 0.1em, inkMuted)
//   • Status caption — mono 9px uppercase, 0.18em tracking. Color is
//     accent for action-required states; inkMuted otherwise. THIS TEXT
//     COMES FROM `getDealCaption(state, role, opts)` IN OUR LIB —
//     never hardcoded per the strict-captions rule.
//   • Last message preview row — body 12.5, inkMuted (or inkSubtle +
//     italic if no message yet). Bold weight when unread > 0. Truncated
//     to single line. Unread badge on the right (18×18, accent bg,
//     bg-color number, mono 10px weight 700).
//
// EMPTY STATE (persona-aware):
//   • Business: "Find someone\nto work with." + "Browse Discover →" CTA
//   • Influencer:   "Your first request is\naround the corner." + softer copy
//   • Both: 60×60 surface tile w/ MessageSquare icon at top, mono
//     "NO INQUIRIES YET" caption.
//
// NO RESULTS STATE (search active, zero matches):
//   • Mono "NO MATCHES" caption + display "Nothing matched \"{value}\"."
//
// PIN LOGIC:
//   pinned = threads.filter(t => requiresAction(t.state, role, opts) || t.unread > 0)
//   other  = threads.filter(t => !requiresAction(t.state, role, opts) && t.unread === 0)
//
//   `requiresAction` should be a helper in `lib/dealLifecycle.ts`:
//     - BUSINESS: true on DELIVERED (review delivery) or COMPLETED w/
//                 businessRated=false (rate now). False otherwise — Business
//                 doesn't "need to act" while waiting at PENDING.
//     - INFLUENCER:   true on PENDING (respond), DELIVERED w/ influencer acting
//                 first (n/a — Influencer already delivered), or COMPLETED
//                 w/ influencerRated=false (rate now).
//
// SEARCH:
//   Client-side filter (mock-stage). Match if counterparty.name (case-
//   insensitive contains) the search value. Apply to both pinned + other
//   buckets. NoResultsState renders when both buckets become empty AND
//   search has content.
//
// Animations:
//   fadeUp on the body when state changes (400ms ease-out, opacity + Y8→0)
//
// Encoding artifacts in source:
//   `âª` → `₪`,  `Ã` → `×`,  `→` → `→`. Use proper Unicode in source.
//
// =================================================================

// (full body retained below — see chat history for original, sections
//  inlined here in summarized form so the audit trail captures the
//  whole reference shape.)

import { useState } from "react";
import { Search, LayoutDashboard, MessageSquare, User, ChevronRight } from "lucide-react";

const T = {
  bg: "#1A1815", surface: "#2A2620", surfaceAlt: "#221F1A",
  border: "rgba(244,240,232,0.08)", borderStrong: "rgba(244,240,232,0.15)",
  ink: "#F4F0E8", inkMuted: "#8A7E6C", inkSubtle: "#5C5448",
  accent: "#FF7A29", accentSoft: "rgba(255,122,41,0.12)",
  accentBorder: "rgba(255,122,41,0.40)", accentShadow: "rgba(255,122,41,0.30)",
  fontDisplay: "'Inter Tight', system-ui, sans-serif",
  fontBody: "'Inter Tight', system-ui, sans-serif",
  fontMono: "'JetBrains Mono', monospace",
};

// Business (Business) inbox — counterparty is Influencer → photo avatars.
// statusCaption + statusAccent in this file are SAMPLE OUTPUTS of what
// getDealCaption() would return; in implementation they're computed.
const BUSINESS_THREADS = [
  { id: "h-thr-1", counterparty: { name: "Yael Mizrahi", photo: "..." },
    statusCaption: "REVIEW DELIVERY",   statusAccent: true,
    lastMessage: "Final cut delivered, hope you love it!", lastMessageBy: "them",
    timestamp: "2h ago", unread: 1, needsAttention: true },
  { id: "h-thr-2", counterparty: { name: "Maya Cohen", photo: "..." },
    statusCaption: "IN PROGRESS",       statusAccent: false,
    lastMessage: "Got the brief, looking forward to filming!", lastMessageBy: "them",
    timestamp: "11:42", unread: 2, needsAttention: false },
  { id: "h-thr-3", counterparty: { name: "Noa Berman", photo: "..." },
    statusCaption: "WAITING · 47H LEFT", statusAccent: true,
    lastMessage: null, lastMessageBy: null,
    timestamp: "Yesterday", unread: 0, needsAttention: false },
  { id: "h-thr-4", counterparty: { name: "Daniel Levi", photo: "..." },
    statusCaption: "RATE NOW",          statusAccent: true,
    lastMessage: "Thanks for working with us!", lastMessageBy: "them",
    timestamp: "3d ago", unread: 0, needsAttention: true },
];

// Influencer inbox — counterparty is Business → monogram avatars.
const INFLUENCER_THREADS = [
  { id: "t-thr-1", counterparty: { name: "Onza", monogram: "ON" },
    statusCaption: "RESPOND · 67H LEFT", statusAccent: true,
    lastMessage: null, lastMessageBy: null,
    timestamp: "Yesterday", unread: 0, needsAttention: true },
  { id: "t-thr-2", counterparty: { name: "FitBar TLV", monogram: "FB" },
    statusCaption: "IN PROGRESS",        statusAccent: false,
    lastMessage: "Looks great — go ahead", lastMessageBy: "them",
    timestamp: "11:42", unread: 1, needsAttention: false },
  { id: "t-thr-3", counterparty: { name: "BeautyBar", monogram: "BB" },
    statusCaption: "AWAITING REVIEW",    statusAccent: false,
    lastMessage: "Final cut delivered, hope you love it!", lastMessageBy: "me",
    timestamp: "2h ago", unread: 0, needsAttention: false },
  { id: "t-thr-4", counterparty: { name: "Sushi Bar", monogram: "SB" },
    statusCaption: "RATE NOW",           statusAccent: true,
    lastMessage: "Pleasure working with you!", lastMessageBy: "them",
    timestamp: "4d ago", unread: 0, needsAttention: true },
];

// Pixel specs (hand-extracted from the reference body):
//
// Top bar:
//   padding 16/18/10/18, title display 22 weight 700 -0.035em,
//   "{N} unread" mono 9.5 0.18em accent weight 600.
//
// Search bar:
//   padding 0/14/12, pill (radius 100), padding 8/12, gap 9,
//   search icon 14, input fontSize 13.
//
// SectionHeader (local — NOT same as discover's count-bearing one):
//   padding 0/18, marginBottom 10, marginTop 6, display 17 weight 700
//   tracking -0.03em.
//
// ThreadRow:
//   padding 12/13, surface bg, border, radius 12, gap 11.
//   Avatar 44×44 radius 12 (rounded square).
//   Name display 14.5 weight 700 -0.025em line 1.1.
//   Timestamp mono 9 0.1em inkMuted.
//   Status mono 9 0.18em uppercase, weight 600 when accent / 500 when muted.
//   Preview body 12.5 line 1.3, inkMuted normal / inkSubtle italic when null.
//   Preview weight 600 when unread > 0.
//   Unread badge minWidth 18, height 18, radius 9, accent bg, bg-color
//     mono 10 weight 700 padding 0/5.
//
// EmptyState:
//   padding 70/32, icon tile 60×60 radius 14 surface, MessageSquare 24,
//   mono "NO INQUIRIES YET" 9.5 0.25em mb14, headline display 26 weight 800
//   -0.045em line 0.95, copy body 13 ink @0.6 max 30ch.
//   CTA pill 100, accent bg, bg color, padding 12/24, fontSize 13 weight 700.
//
// NoResultsState:
//   padding 50/32, mono "NO MATCHES" 9.5 0.2em, headline display 22 weight 800.
