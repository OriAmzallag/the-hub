# Project Plan: Onboarding Auth Update

Generated: 2026-05-12
Status: READY TO SHIP
Branch: feature/onboarding-auth

---

## Executive Summary

Device-token authentication for The Hub mobile app. Adds two new screens (Splash, WelcomeBack) to the existing onboarding flow, plus token storage/validation infrastructure. Enables silent sign-in for returning users while preserving phone-OTP for new devices.

---

## Product Requirements

See: `docs/features/onboarding-auth/requirements.md`

### Key Decisions
1. **Splash at app/index.tsx** - Top-level gate, not inside (auth) group
2. **No auto-advance from WelcomeBack** - Manual CTA tap required
3. **500ms minimum splash dwell** - Prevents jarring flash on fast token checks
4. **Mock auth rules**: Phone ending in 0 = Maya (influencer), ending in 5 = Avi (business)

### User Flows
- **Silent sign-in**: Splash -> token valid -> persona home
- **First launch**: Splash -> no token -> Welcome -> Phone -> OTP -> Fork -> persona flow
- **Returning user re-auth**: OTP verify (existing account) -> WelcomeBack -> persona home
- **Sign-out**: Profile -> Sign out -> token cleared -> Welcome

---

## Technical Plan

See: `docs/features/onboarding-auth/tech-plan.md`

### New Files
| File | Purpose |
|------|---------|
| `types/auth.ts` | AuthUser, TokenValidationResponse, OtpVerifyResponse, AuthService interface |
| `services/auth.ts` | MockAuthService implementation, token helpers |
| `services/index.ts` | Barrel export |
| `components/onboarding/SplashScreen.tsx` | Token-check entry point |
| `components/onboarding/WelcomeBackStep.tsx` | Returning user success state |

### Modified Files
| File | Change |
|------|--------|
| `app/index.tsx` | Replaced redirect with SplashScreen |
| `app/(auth)/onboarding.tsx` | Added welcome-back step, handleExistingAccount |
| `components/onboarding/PhoneStep.tsx` | Added onExistingAccount prop, OTP verify with auth service |
| `components/onboarding/index.ts` | Export new components |
| `types/onboarding.ts` | Added welcome-back step, returningUser field |
| `components/business/profile/BusinessProfileScreen.tsx` | Token clear on sign-out |
| `components/influencer/profile/InfluencerProfileScreen.tsx` | Token clear on sign-out |
| `tsconfig.json` | Added @/services/* path |

### Dependencies
- `expo-secure-store` (already installed)
- No new dependencies

---

## Design Specs

See: `docs/features/onboarding-auth/design-spec.md`

### Splash Screen
- Logo: 64x64 accent tile, "H" glyph, radius 18
- Spinner: 12x12, 2px border, 0.8s rotation
- Caption: "SIGNING YOU IN", mono 10px, inkMuted

### WelcomeBack Screen
- Hero photo: 110x110, radius 28, borderStrong
- Check overlay: 38x38 circle, check-pop spring animation
- Eyebrow: "WELCOME BACK", mono 11px, accent
- Headline: "Hey,\n{firstName}.", 40px/800
- CTA: "Continue to Home" full-width pill

---

## Implementation Summary

### Architecture
- `AuthService` interface enables future Supabase swap
- `MockAuthService` for development with documented behavior rules
- Token stored in SecureStore under key `hub_device_token`
- Minimum 500ms splash dwell enforced via elapsed time tracking

### Routing Logic
```
app/index.tsx (Splash)
├─ token valid + business  -> /(business)
├─ token valid + influencer -> /(influencer)
└─ token invalid/missing   -> /(auth)/onboarding

OTP Verify
├─ accountExists=true  -> WelcomeBack -> persona home
└─ accountExists=false -> Fork -> persona flow
```

---

## Code Review

See: `docs/features/onboarding-auth/code-review.md`

Status: **APPROVE**

Minor nits identified (Animated.Text for static glyph, fragile overlay sizing) but no blocking issues. Design fidelity verified against reference.

---

## QA Report

See: `docs/features/onboarding-auth/qa-report.md`

| Metric | Value |
|--------|-------|
| Test Cases | 15 |
| Passed | 15 |
| Failed | 0 |
| Bugs Found | 0 |

Status: **PASS**

---

## Final Status

- **Bugs Found:** 0
- **Blockers:** NO
- **Ready to Ship:** YES

---

## Out of Scope

Explicitly excluded from this PR:
- Real Supabase auth backend (mock only)
- Token refresh / rotation flows
- Multi-device session management
- Reauthentication challenges
- Email/password, biometric, social login
- Token clock-based expiry

---

## Next Steps

1. Run `tsc --noEmit` to verify TypeScript
2. Create feature branch `feature/onboarding-auth`
3. Commit all changes
4. Open draft PR to main
5. User reviews and merges

---

*End of Project Plan*
