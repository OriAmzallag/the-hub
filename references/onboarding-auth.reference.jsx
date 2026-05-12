// =================================================================
// REFERENCE FILE — Onboarding (auth update, 2026-05-12)
// =================================================================
// Source: user-provided prototype, 2026-05-12.
//
// SCOPE OF THIS UPDATE
// --------------------
// Adds two NEW screens to the existing onboarding flow:
//   • SPLASH — token-check entry point. Brief logo + spinner (~0.5s).
//     Validates the device session token. Token valid → Home silently.
//     Token missing/expired → Welcome → Phone → OTP.
//   • WELCOME BACK — returning-user re-auth success state. Quieter than
//     the onboarding Done state. Confirmation moment, not a destination.
//
// Existing screens (Welcome / Phone / Fork / Business* / Influencer* /
// Done) are unchanged structurally — included in the prototype so the
// router demo navigator can show every path end-to-end.
//
// AUTH MODEL (PRD §4.7)
// ---------------------
// Phone-OTP once + device token (WhatsApp pattern). Phone-verify on
// signup. Device stores a session token. Every future app open is
// silent — token validated server-side, user lands on Home. Phone-OTP
// re-runs ONLY on reinstall, sign-out, or token revocation. Token does
// NOT expire on a clock.
//
// IMPLEMENTATION NOTES (from PRD §4.7)
// ------------------------------------
//   - Token stored in iOS Keychain / Android Keystore (expo-secure-store)
//   - Token validation endpoint must be fast — gates every app open
//   - Sign-out must clear the on-device token, not just call the server
//   - After re-auth: existing account → WELCOME BACK → Home.
//     New number → Fork → onboarding (current behavior).
//   - NOT building: email/password, biometric, social login.
//
// PORTING NOTES (RN)
// ------------------
//   - The demo-only "branch panels" in Splash and Phone (showing both
//     outcomes) MUST be removed in the RN port. In production these
//     screens route silently based on real token state / account
//     lookup. Keep the visual splash (logo + spinner + caption) only.
//   - Terminology: business / influencer (NOT hunter / talent).
//   - Use existing constants/theme.ts tokens; don't redefine T inline.
//
// ENCODING ARTIFACTS in the prototype (decode for the port):
//   `Â·` → `·`,  `â` → `→` or `–`,  `cafÃ©` → `café`,
//   `18â24` → `18–24`.
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
// STEP REGISTRY (notice splash + welcome-back additions)
// =================================================================
const STEPS = [
  { id: "splash", label: "Splash (token check)", flow: "shared" },         // NEW
  { id: "welcome", label: "Welcome", flow: "shared" },
  { id: "phone", label: "Phone", flow: "shared" },
  { id: "welcome-back", label: "Welcome back (re-auth)", flow: "shared" }, // NEW
  { id: "fork", label: "Path", flow: "shared" },
  // ...business + influencer steps unchanged
];

// =================================================================
// SPLASH — token-check entry point (NEW)
// =================================================================
function Splash({ onTokenValid, onTokenMissing }) {
  return (
    <div
      className="fade-up"
      style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "60px 28px 30px",
      }}
    >
      {/* Logo — same recipe as Welcome: 64×64 accent tile, radius 18,
          accent shadow `0 12px 32px accentShadow`, big H glyph
          (display 32, weight 900, color bg, letterSpacing -0.06em). */}
      <div
        style={{
          width: 64,
          height: 64,
          borderRadius: 18,
          background: T.accent,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: `0 12px 32px ${T.accentShadow}`,
          marginBottom: 28,
        }}
      >
        <span
          style={{
            fontFamily: "'Inter Tight', system-ui, sans-serif",
            fontSize: 32,
            fontWeight: 900,
            color: T.bg,
            letterSpacing: "-0.06em",
            lineHeight: 1,
          }}
        >
          H
        </span>
      </div>

      {/* Spinner + caption row.
          Spinner: 12×12, 2px border (surface), accent top, spin 0.8s
          linear infinite.
          Caption: mono 10, 0.2em, inkMuted, weight 500, uppercase.
          "Signing you in" */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          marginBottom: 60,
        }}
      >
        <div
          style={{
            width: 12,
            height: 12,
            border: `2px solid ${T.surface}`,
            borderTopColor: T.accent,
            borderRadius: "50%",
            animation: "spin 0.8s linear infinite",
          }}
        />
        <div
          style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 10,
            color: T.inkMuted,
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            fontWeight: 500,
          }}
        >
          Signing you in
        </div>
      </div>

      {/* Demo-only branch panel — omit in the RN port. Use real token
          state + a 500ms minimum dwell so the splash doesn't flash. */}
    </div>
  );
}

// =================================================================
// WELCOME BACK — returning-user success state (NEW)
// =================================================================
function WelcomeBack({ onContinue }) {
  // Demo hardcodes Maya. Production fetches from the OTP-verify boundary
  // (server returns { user: { firstName, photoUri, persona } }).
  const returningUser = {
    name: "Maya",
    photo:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&q=80",
  };

  return (
    <div
      className="fade-up"
      style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        padding: "60px 28px 30px",
      }}
    >
      {/* Hero photo with check overlay
          - Photo 110×110, radius 28, borderStrong 1px, object-fit cover.
          - Check overlay: positioned absolute bottom -6 right -6,
            38×38, radius 50% (circle), accent bg, 3px bg border,
            accent shadow `0 6px 16px accentShadow`.
          - check-pop entry animation (scale 0 → 1.15 → 1 over 0.5s
            cubic-bezier(0.32, 0.72, 0, 1)). */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          marginBottom: 32,
          position: "relative",
        }}
      >
        <div style={{ position: "relative", width: 110, height: 110 }}>
          <div
            style={{
              width: 110,
              height: 110,
              borderRadius: 28,
              overflow: "hidden",
              border: `1px solid ${T.borderStrong}`,
            }}
          >
            <img
              src={returningUser.photo}
              alt=""
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          </div>
          <div
            className="check-pop"
            style={{
              position: "absolute",
              bottom: -6,
              right: -6,
              width: 38,
              height: 38,
              borderRadius: "50%",
              background: T.accent,
              border: `3px solid ${T.bg}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: `0 6px 16px ${T.accentShadow}`,
            }}
          >
            <Check size={18} strokeWidth={3} color={T.bg} />
          </div>
        </div>
      </div>

      {/* Eyebrow: mono 11, 0.3em, accent, weight 600, uppercase. */}
      <div
        style={{
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: 11,
          color: T.accent,
          letterSpacing: "0.3em",
          textTransform: "uppercase",
          fontWeight: 600,
          textAlign: "center",
          marginBottom: 16,
        }}
      >
        Welcome back
      </div>

      {/* Headline: display 40, weight 800, -0.045em, line 0.95, ink,
          centered. Two lines: "Hey,\n{firstName}." */}
      <h1
        style={{
          fontFamily: "'Inter Tight', system-ui, sans-serif",
          fontSize: 40,
          fontWeight: 800,
          margin: 0,
          color: T.ink,
          letterSpacing: "-0.045em",
          lineHeight: 0.95,
          textAlign: "center",
          marginBottom: 16,
        }}
      >
        Hey,<br />{returningUser.name}.
      </h1>

      {/* Subtitle: body 15, ink @ 0.7 opacity, line 1.5, centered, max 30ch. */}
      <p
        style={{
          fontFamily: "'Inter Tight', system-ui, sans-serif",
          fontSize: 15,
          color: T.ink,
          opacity: 0.7,
          lineHeight: 1.5,
          textAlign: "center",
          margin: "0 auto 36px",
          maxWidth: "30ch",
        }}
      >
        Signed in. Picking up where you left off.
      </p>

      <div style={{ flex: 1 }} />

      {/* Primary CTA: full-width pill (radius 100), padding 18/22,
          accent bg, bg-color text, 15/700/-0.015em, accent shadow
          `0 8px 24px accentShadow`, ArrowRight 16 strokeWidth 2.6. */}
      <button
        onClick={onContinue}
        style={{
          width: "100%",
          background: T.accent,
          color: T.bg,
          border: "none",
          padding: "18px 22px",
          borderRadius: 100,
          fontSize: 15,
          fontWeight: 700,
          fontFamily: "'Inter Tight', system-ui, sans-serif",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 8,
          letterSpacing: "-0.015em",
          boxShadow: `0 8px 24px ${T.accentShadow}`,
        }}
      >
        Continue to Home
        <ArrowRight size={16} strokeWidth={2.6} />
      </button>

      {/* Fine print: mono 9.5, 0.15em, inkSubtle, weight 500, uppercase. */}
      <p
        style={{
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: 9.5,
          color: T.inkSubtle,
          letterSpacing: "0.15em",
          textTransform: "uppercase",
          fontWeight: 500,
          textAlign: "center",
          margin: "14px 0 0",
        }}
      >
        Not you? Sign out from settings
      </p>
    </div>
  );
}

// =================================================================
// ROUTING CHANGES vs current onboarding.tsx state machine
// =================================================================
//
// Current entry: app/(auth)/onboarding.tsx starts the state machine at
// the Welcome step.
//
// New entry: a top-level Splash gate must run BEFORE the onboarding
// state machine. Recommended structure (Tech Lead to confirm):
//
//   app/index.tsx          → routes based on token check (Splash UI)
//     ├─ token valid       → router.replace based on persona route
//     ├─ no token          → router.replace("/(auth)/onboarding")
//     └─ verify error      → router.replace("/(auth)/onboarding")
//
// Phone-OTP success now branches:
//   - account exists for this phone → WelcomeBack screen → persona home
//   - new phone                     → Fork → existing onboarding flow
//
// Sign-out (from Profile screen) must:
//   1. Clear the token in expo-secure-store
//   2. router.replace("/(auth)/onboarding") (current behavior already
//      does this; just confirm the SecureStore.deleteItem step is added)
//
// =================================================================
