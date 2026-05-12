# Requirements: Onboarding Auth Update

Generated: 2026-05-12

## Overview

Device-token authentication for The Hub mobile app. Adds two new screens to the existing onboarding flow plus token-based auth model.

## Open Questions Resolved

### Q1: Splash Location in Routing Tree
**Answer:** Option A - `app/index.tsx` as top-level gate. Splash is the new root entry point, validating device token and routing to:
- Token valid with persona -> `/(business)` or `/(influencer)`
- Token missing/invalid -> `/(auth)/onboarding`

### Q2: Persona-Routing Logic on Token-Valid
**Answer:** Token validation response includes `{ valid: boolean, user?: { id, firstName, photoUri, persona } }`. Route based on `user.persona`.

### Q3: Auto-Advance from WelcomeBack
**Answer:** No auto-advance. Manual "Continue to Home" CTA only.

### Q4: OTP Existing-Account Branch
**Answer:** OTP verify response includes `{ success, accountExists, user?, token? }`. When `accountExists: true`, route to WelcomeBack. Mock uses phone numbers ending in '0' (influencer) or '5' (business) as returning users.

### Q5: Splash Minimum Dwell
**Answer:** Yes, 500ms minimum. Prevents jarring flash on fast token checks.

## User Stories

### US-1: Silent Sign-In
As a returning user on the same device, when I open the app, then I see a brief splash and am silently routed to my persona home.

### US-2: First Launch
As a new user, when I open the app, then I see the splash briefly and am routed to Welcome to begin onboarding.

### US-3: Re-Authentication Success
As a returning user after OTP, when my phone matches an existing account, then I see WelcomeBack with my photo and tap Continue to reach my dashboard.

### US-4: Sign-Out Clears Token
As a signed-in user, when I tap Sign out in Profile, then my device token is cleared and I'm routed to Welcome.

### US-5: Token Revocation
As a user with revoked token, when I open the app, then splash detects invalid token and routes me to Welcome.

## Acceptance Criteria

| ID | Requirement |
|----|-------------|
| AC-1 | Splash shows logo (64x64 accent tile), spinner (12x12), "SIGNING YOU IN" caption |
| AC-2 | Splash enforces 500ms minimum dwell |
| AC-3 | Token stored in SecureStore under `hub_device_token` |
| AC-4 | WelcomeBack shows hero photo (110x110, radius 28) with check overlay (38x38, check-pop animation) |
| AC-5 | WelcomeBack displays eyebrow, headline with firstName, subtitle, CTA |
| AC-6 | Sign-out calls SecureStore.deleteItemAsync before routing |
| AC-7 | Auth service stubbed behind clean interface for Supabase swap |
| AC-8 | New phone numbers route to Fork (unchanged behavior) |

## Out of Scope

- Real Supabase auth backend (mock only)
- Token refresh / rotation flows
- Multi-device session management
- Reauthentication challenges
- Email/password, biometric, social login
- Token clock-based expiry
