// =================================================================
// REFERENCE FILE — Onboarding flow (Welcome → Phone → Fork → Persona)
// =================================================================
// Source: user-provided reference, 2026-05-12
//
// PURPOSE: The first-run flow new users see. Three shared steps,
// then a fork that splits into either Business onboarding (5 steps)
// or Influencer onboarding (8 steps), and a Done state on each end.
//
// STEP REGISTRY (verbatim from the reference):
//   Shared (no progress bar):
//     - welcome
//     - phone           (two-stage internal: phone → otp)
//     - fork            (pick business or influencer)
//
//   Business flow (5 progress steps):
//     1. b-name        — display name + primary category chip-select
//     2. b-location    — city/area text input w/ MapPin prefix
//     3. b-logo        — optional, with monogram fallback + Skip
//     4. b-bio         — optional, with char count, Skip
//     5. b-done        — "You're in" + check-pop, "Find Influencers" CTA
//
//   Influencer flow (8 progress steps):
//     1. i-name        — display name + bio (required, ≥10 chars)
//     2. i-photo       — REQUIRED tappable upload tile
//     3. i-categories  — up to 3, first = primary "01" mono chip
//     4. i-content     — multi-select content type chips
//     5. i-languages   — multi-select language chips
//     6. i-demo        — Age bracket + Gender chip groups
//     7. i-platforms   — checkbox + follower-count input per platform,
//                         WITH a mock "Verify with {Platform}" CTA that
//                         simulates an OAuth roundtrip (1.2s spinner)
//                         then locks the input + shows a "Verified ·
//                         count from {Platform}" pill. Bottom card:
//                         "Why verify?" callout.
//     8. i-done        — same Done shape, "Browse perks" CTA
//
// SHARED STEP-SHELL (StepShell in the reference):
//   - Top bar: back-button (36×36 surface circle) + thin progress bar
//     (4px height, accent fill, `(step / total) * 100%` width) + mono
//     "{step}/{total}" indicator on the right.
//   - Body: optional eyebrow mono accent caption + Display L title
//     (32px / 800 / -0.045em / line-height 1.0) + optional subtitle
//     body 15 ink 0.65 opacity.
//   - Sticky footer (frosted bg) with optional "Skip for now" mono
//     button above the CTA, then the primary accent pill "Next →" /
//     "Verify →" gated by `canContinue`.
//
// WELCOME & DONE are FULL-SCREEN (no shell):
//   Welcome: 64×64 accent square with bold "H", mono accent
//     "WELCOME TO THE HUB" caption, display 44 weight 800 headline
//     "Where Tel Aviv\nget together.", body 16 sub, accent "Get
//     started →" CTA, mono inkSubtle "Tel Aviv · v0.6" footer.
//   Done: 88×88 accent circle with big white Check + check-pop spring
//     (0.5s cubic-bezier(0.32, 0.72, 0, 1)), mono "YOU'RE IN", Display
//     40 weight 800 "Welcome,\n{name}.", body 15 ink 0.7 sub, accent
//     CTA per flow ("Find Influencers" for business, "Browse perks"
//     for influencer).
//
// COMPONENTS / PATTERNS TO REUSE (existing in the codebase):
//   - constants/theme.ts — every color / radius / typography token.
//   - motion.duration.slow / motion.easing.sheet for any rises (no
//     sheet in this flow, but the entrance fade-up matches existing
//     "fade-up" patterns).
//   - Reuse the existing chip pattern from the storefront-editor /
//     post-perk CategoryChips for the primary-with-"01" treatment.
//   - For the influencer-fork CategoryChips: 10 chips ("Fitness",
//     "Lifestyle", "Wellness", "Beauty", "Fashion", "Food", "Travel",
//     "Tech", "Music", "Gaming"). NOTE: the existing PerkCategory
//     union only has 8 values; if onboarding categories should map to
//     PerkCategory, "Travel" / "Music" / "Gaming" need to be added,
//     or a separate InfluencerProfileCategory union should be
//     introduced. Tech Lead to decide.
//   - For the business-fork: 10 categories ("Food" through "Home" —
//     adds "Travel" + "Home" on top of the 8 PerkCategory values).
//     Same union expansion question applies.
//
// PHONE INPUT:
//   - Fixed "+972" prefix tile inside the FieldCard, then a thin
//     border separator, then a number input. Big input style
//     (display 22 weight 700 -0.025em).
//   - OTP stage uses a mono 28px / 0.3em centered input that limits
//     to 6 digits via regex. "Resend code" mono accent affordance
//     below.
//
// PLATFORM VERIFICATION (i-platforms):
//   - Per-platform tile: Instagram / TikTok / YouTube icon + label +
//     a check-tile selector (22×22 accent fill OR 1.5px borderStrong
//     outline).
//   - When selected, an expanded panel reveals beneath:
//       a) "Followers on {Platform}" mono label + (live status pill
//          on the right when verified: Lock icon + "LOCKED").
//       b) Number input (disabled + opacity 0.85 when verified).
//       c) Bottom action area:
//           - If verified: accentSoft pill with ShieldCheck +
//             "VERIFIED · COUNT FROM {PLATFORM}".
//           - If not: bg pill with accentBorder + ShieldCheck +
//             "Verify with {Platform}" → on tap, swap to a spinner
//             ring + "Verifying with {Platform}..." for ~1.2s (mock
//             OAuth). On success, populate followers with mock
//             reach (Maya: IG 47.2K, TikTok 82.1K, YT 8.4K) and lock.
//             Below the button, a decline-tone mono "UNVERIFIED ·
//             SELF-REPORTED" warning.
//   - Bottom of the step: "Why verify?" surfaceAlt explainer card
//     (12.5px body ink 0.75 opacity).
//
// FORM VALIDATION GATES (sample):
//   - b-name:        name length ≥ 2 AND category selected
//   - b-location:    location length ≥ 2
//   - b-logo:        always (Next or Skip allowed)
//   - b-bio:         always (Next; Skip when bio is empty)
//   - i-name:        name ≥ 2 AND bio ≥ 10
//   - i-photo:       photo non-null
//   - i-categories:  ≥ 1 selected
//   - i-content:     ≥ 1
//   - i-languages:   ≥ 1
//   - i-demo:        age AND gender selected
//   - i-platforms:   ≥ 1 platform AND every platform has followers > 0
//
// ROUTING (PM to confirm):
//   - The onboarding should live at /(auth)/onboarding (a single
//     screen managing the internal step machine via local state).
//   - Currently the app cold-starts to /(auth)/dev-login (the persona
//     picker). PM decides whether onboarding lands BEFORE the dev
//     login or as a separate route the user can navigate to from
//     dev-login. Simpler MVP path: keep dev-login as the dev shortcut,
//     add a "Try the onboarding flow" affordance, and route a real
//     first-time user to /(auth)/onboarding.
//   - At onboarding completion (Done state CTA), route to:
//       business →  /(business) (lands on Dashboard)
//       influencer → /(influencer) (lands on the Discover/Perks tab,
//                                    or Profile — designer's call)
//
// ENCODING ARTIFACTS (same conventions as before):
//   `Â·`  → `·`
//   `â`   → `→` or `—`
//   "18â24" / "25â34" → "18–24" / "25–34" (en-dash; some platforms
//     show this differently — pick en-dash for consistency)
//   `cafÃ©` → `café` (in the b-bio placeholder)
//   `→` and `←` are correct Unicode arrows.
//
// =================================================================

import { useState } from "react";
import {
  ChevronLeft,
  X,
  ArrowRight,
  Check,
  Camera,
  Briefcase,
  Sparkles,
  Phone,
  Instagram,
  Music2,
  Youtube,
  MapPin,
  Plus,
  ShieldCheck,
  AlertCircle,
  Lock,
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
// CONSTANTS (verbatim — note onboarding has wider lists than perks)
// =================================================================
const BUSINESS_CATEGORIES = [
  "Food", "Fitness", "Beauty", "Lifestyle", "Wellness",
  "Drinks", "Fashion", "Tech", "Travel", "Home",
];

const INFLUENCER_CATEGORIES = [
  "Fitness", "Lifestyle", "Wellness", "Beauty", "Fashion",
  "Food", "Travel", "Tech", "Music", "Gaming",
];

const CONTENT_TYPES = [
  "UGC", "Sponsored", "Short-Form Video", "Lifestyle",
  "Product Review", "Tutorial/Educational", "Storytelling",
  "Performance Creative", "Testimonial", "Behind-the-Scenes",
];

const LANGUAGES = ["Hebrew", "English", "Arabic", "Russian", "French", "Spanish"];

const AGE_BRACKETS = ["18–24", "25–34", "35–44", "45–54", "55+"];

const GENDERS = ["Women", "Men", "Non-binary", "Prefer not to say"];

const PLATFORMS = [
  { id: "IG",      label: "Instagram", icon: "Instagram" },
  { id: "TikTok",  label: "TikTok",    icon: "Music2"    },
  { id: "YouTube", label: "YouTube",   icon: "Youtube"   },
];

// (Full screen JSX bodies — Welcome, PhoneStep, ForkStep, BusinessNameStep,
//  BusinessLocationStep, BusinessLogoStep, BusinessBioStep, InfluencerNameStep,
//  InfluencerPhotoStep, InfluencerCategoriesStep, InfluencerContentStep,
//  InfluencerLanguagesStep, InfluencerDemoStep, InfluencerPlatformsStep,
//  DoneStep — plus the StepShell + helpers (FieldCard, chipStyle,
//  inputBig, PhoneInput, OtpInput, PathCard) follow the exact pixel
//  values in the original paste. Every fontSize / letterSpacing /
//  fontWeight / borderRadius / lineHeight is verbatim from the
//  reference. The structure is documented above; see the original
//  reference for the unabridged source.)
