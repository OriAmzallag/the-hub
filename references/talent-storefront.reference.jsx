// =================================================================
// REFERENCE FILE — Talent Storefront (public view)
// =================================================================
// Source: Tom-provided reference, 2026-05-09
//
// PURPOSE: Visual reference ONLY. Do NOT port 1:1.
// The Hub is React Native (Expo) + NativeWind. Implement using native
// RN primitives, NativeWind classes where they map cleanly, and the
// design tokens in `constants/theme.ts`.
//
// This is the PUBLIC, read-only storefront — what a Business sees when
// they tap a Talent card from the Discover screen. Not to be confused
// with the Talent's own (private) profile editor, which is a separate
// future screen.
//
// Same web-only patterns as before — ignore inline styles, CSS
// keyframes, backdropFilter, boxShadow, <img>, the phone-frame wrapper.
//
// Sections (top to bottom):
//   1. Sticky TopBar — Back, Share, Favorite (heart). Frosted blur
//      transition on scroll past 280px (background fades from
//      transparent to rgba(26,24,21,0.92), border fades in, name
//      becomes visible in the center).
//   2. Hero carousel — 3–6 images, 4:5 aspect, swipeable. Bottom
//      gradient scrim, pagination dots (active=22w, accent, inactive=
//      6w, ink/0.4), mono image counter "01 / 05" bottom-right.
//   3. Mono status line — pulsing accent dot + "AVAILABLE · TEL AVIV"
//   4. Display XL name with line break: "Maya\nCohen." (2 lines, 52px,
//      weight 800, tight tracking -0.045em). Verified accent badge to
//      the right with a check icon.
//   5. Categories mono row — "FITNESS · LIFESTYLE · WELLNESS"
//   6. Bio — body L, max ~32ch, opacity 0.85, optional
//   7. Bento stats grid — 3 stat tiles (Reach, Rating w/ star, Reviews)
//      + full-width Platforms tile (icon + follower count for each)
//   8. Services list — multi-select tappable rows. Each: name (display
//      17, weight 700) + mono platform tag + clock-icon delivery + ₪
//      price (display 22, weight 700) + selection circle that becomes
//      a numbered badge ("01", "02"...) when selected. Selected card:
//      accentSoft bg + accentBorder, ring shadow on the badge.
//   9. Reviews preview — 2 review cards: business name (display 14
//      weight 700) + 5 stars (filled per rating, 11px, accent vs
//      inkSubtle) + 140-char-truncated body text + mono date below.
//      "See all →" header action.
//
// Sticky CTA bar (frosted, bottom):
//   - 0 selected → "SELECT A SERVICE" mono inkMuted, button disabled
//     (surface bg, inkMuted text, no shadow)
//   - 1 selected → "1 SERVICE SELECTED" mono accent + total ₪ display
//     800. Button = primary accent w/ glow.
//   - 2+ selected → "{N} SERVICES SELECTED" + sum of prices. Same
//     primary button.
//
// Animations:
//   - pulse-dot           2s ease-in-out, opacity 1↔0.4 (status dot)
//   - fade-up             500ms ease-out, opacity + translateY 8→0
//                          (top-bar name when scrolled in)
//   - carousel transition translateX 400ms cubic-bezier(0.4, 0, 0.2, 1)
//     — react-native-reanimated pager, NOT FlatList momentum (the
//     reference shows a slow synced ease, FlatList would feel snappier
//     and inconsistent with the design)
//   - top bar background  250ms ease (opacity, border, name)
//
// Mojibake note: source pasted via chat had encoding artifacts.
//   `âª`  → `₪`
//   `Ã`   → `×`
//   `→`   → `→` (sometimes shown as `â`)
//   `…`   → `…` (sometimes shown as `â¦`)
// In this file the correct Unicode characters are used.
//
// =================================================================

import { useState, useRef, useEffect } from "react";
import {
  ChevronLeft,
  Share,
  Heart,
  Star,
  Instagram,
  Music2,
  Youtube,
  CheckCircle2,
  Clock,
  ArrowRight,
} from "lucide-react";

// =================================================================
// DESIGN TOKENS — Metal × Sunset Orange
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
// MOCK DATA — Maya Cohen
// =================================================================
const TALENT = {
  name: "Maya Cohen",
  handle: "@maya.moves",
  bio: "Fitness & lifestyle in Tel Aviv. Sweaty mornings, slow afternoons, honest reviews.",
  location: "Tel Aviv, IL",
  verified: true,
  available: true,
  rating: 4.9,
  reviewCount: 38,
  reach: "137K",
  categories: ["Fitness", "Lifestyle", "Wellness"],
  platforms: [
    { name: "Instagram", icon: Instagram, followers: "47.2K" },
    { name: "TikTok", icon: Music2, followers: "82.1K" },
    { name: "YouTube", icon: Youtube, followers: "8.4K" },
  ],
  portfolio: [
    "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=900&q=80",
    "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=900&q=80",
    "https://images.unsplash.com/photo-1506629082955-511b1aa562c8?w=900&q=80",
    "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=900&q=80",
    "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=900&q=80",
  ],
  services: [
    { id: 1, name: "Instagram Reel", platform: "IG REEL", price: 350, delivery: "48h" },
    { id: 2, name: "Story Set", platform: "IG STORY", price: 180, delivery: "24h" },
    { id: 3, name: "TikTok Native", platform: "TIKTOK", price: 420, delivery: "3 days" },
    { id: 4, name: "Event Appearance", platform: "EVENT", price: 900, delivery: "Custom" },
  ],
  reviewsPreview: [
    {
      from: "FitBar TLV",
      rating: 5,
      text: "Delivered exactly the brief, on time. Engagement was 3× our usual. Already booked her for next month's launch.",
      booked: "IG Reel",
      date: "2 weeks ago",
    },
    {
      from: "Sushi Bar",
      rating: 5,
      text: "Professional from first DM to final upload. Real recommendation — gets the brand instantly, no hand-holding needed.",
      booked: "Story Set",
      date: "1 month ago",
    },
  ],
};

export default function TalentStorefront() {
  const [activeImage, setActiveImage] = useState(0);
  const [isFavorited, setIsFavorited] = useState(false);
  const [selectedServices, setSelectedServices] = useState([]);
  const [scrolled, setScrolled] = useState(false);
  const scrollRef = useRef(null);

  const toggleService = (id) => {
    setSelectedServices((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  };

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const onScroll = () => setScrolled(el.scrollTop > 280);
    el.addEventListener("scroll", onScroll);
    return () => el.removeEventListener("scroll", onScroll);
  }, []);

  // Render body — see chat history for the full JSX. The shape:
  //
  //   <PhoneFrame>
  //     <TopBar />                       // sticky, scrolled-aware
  //     <ScrollView ref={scrollRef}>
  //       <HeroCarousel />               // swipeable 4:5
  //       <HeaderBlock />                // status, name, categories, bio
  //       <BentoStats />                 // 3 tiles + full-width platforms
  //       <ServicesList />               // multi-select rows
  //       <ReviewsPreview />             // 2 cards + see all
  //     </ScrollView>
  //     <StickyCTA />                    // adapts to selection state
  //   </PhoneFrame>
  return null;
}

// =================================================================
// SUBCOMPONENTS — see full body in chat for ref values
// =================================================================
// StatTile: padding 14, surface bg, border, radius 14, minHeight 86,
//           label (mono 9.5px inkMuted) on top, value (display 26 weight
//           800 tracking -0.04em) on bottom; optional accent star next
//           to the value.
//
// SectionHeader: display 22 weight 700 tracking -0.035em title + optional
//                mono 10.5px accent "See all →" button on the right.
//
// iconBtn: 40×40 circle, surface (when scrolled) or rgba(26,24,21,0.7)
//          (when at top, with blur). border, ink color icon.
//
// Selection badge on services: 24×24 circle, when unselected =
//   1.5px borderStrong border, transparent bg. When selected =
//   accent bg + bg-color label "01" mono 10px weight 600 + 4px
//   accentSoft ring shadow.
//
// Sticky CTA button: pill (radius 100), padding 16×22, accent bg,
//   bg-color text. Disabled: surface bg, inkMuted text, no shadow,
//   "not-allowed" semantics.
