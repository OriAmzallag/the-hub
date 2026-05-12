# Project Plan: Onboarding

Generated: 2026-05-12
Status: READY FOR CODE REVIEW
Branch: feature/onboarding

---

## Executive Summary

Multi-step onboarding flow for first-time users. Three shared steps (Welcome, Phone+OTP, Fork), then splits into Business path (4 form steps + Done) or Influencer path (7 form steps + Done).

---

## Product Requirements

### Routing Decision
**Final**: Onboarding replaces the dev-login persona picker entirely. The cold-start redirect at `/index.tsx` now points to `/(auth)/onboarding`, and sign-out on both profile screens routes back there. `app/(auth)/dev-login.tsx` was deleted — the Fork step inside onboarding is now the only place a persona is chosen. When real auth lands, the cold-start gate gets swapped for a welcome/sign-in screen + first-run detection.

### Category Union Decision
**Expanded `PerkCategory`** to full superset (12 values):
- Base 8: Food, Fitness, Beauty, Lifestyle, Wellness, Drinks, Fashion, Tech
- Added: Travel, Home (business), Music, Gaming (influencer)

### User Stories
1. New user sees Welcome screen, taps "Get started" to begin
2. User enters phone with +972 prefix, receives mock 6-digit OTP
3. User selects Business or Influencer path at fork
4. Business user completes 4-step flow (name+category, location, logo, bio) + done
5. Influencer completes 7-step flow (name+bio, photo, categories, content, languages, demo, platforms) + done
6. Influencer can mock-verify platform accounts with 1.2s spinner
7. Completion routes to correct persona dashboard

### Validation Gates
| Step | Gate |
|------|------|
| b-name | name >= 2 chars AND category selected |
| b-location | location >= 2 chars |
| b-logo | always (skip allowed) |
| b-bio | always (skip when empty) |
| i-name | name >= 2 AND bio >= 10 |
| i-photo | photo non-null (required) |
| i-categories | >= 1 selected |
| i-content | >= 1 selected |
| i-languages | >= 1 selected |
| i-demo | age AND gender selected |
| i-platforms | >= 1 platform enabled AND all have followers > 0 |

---

## Technical Plan

### Architecture
Single-screen state machine at `app/(auth)/onboarding.tsx`. Steps managed via local state. Cleaner than nested routes because steps share UI patterns and form state accumulates naturally.

### File Structure
```
app/(auth)/
  onboarding.tsx              # Main screen with step state machine
  _layout.tsx                 # Updated bg color

components/onboarding/
  StepShell.tsx               # Shared layout (top bar + progress + body + footer)
  FieldCard.tsx               # Input container with mono label
  ChipGrid.tsx                # Generic multi-select chip grid
  WelcomeStep.tsx             # Full-screen Welcome (no shell)
  PhoneStep.tsx               # Phone + OTP two-stage step
  ForkStep.tsx                # Business/Influencer choice
  DoneStep.tsx                # Full-screen Done (no shell)
  business/
    NameStep.tsx              # Display name + category
    LocationStep.tsx          # City/area input
    LogoStep.tsx              # Optional upload + monogram
    BioStep.tsx               # Optional bio
  influencer/
    NameBioStep.tsx           # Display name + bio (both required)
    PhotoStep.tsx             # Required photo upload
    CategoriesStep.tsx        # Multi-select up to 3
    ContentStep.tsx           # Content types
    LanguagesStep.tsx         # Languages
    DemoStep.tsx              # Age bracket + gender
    PlatformsStep.tsx         # Platform verification
  index.ts                    # Barrel exports

types/
  onboarding.ts               # OnboardingState, step unions, helpers

constants/
  onboardingOptions.ts        # Category lists, content types, languages
```

### Mock Patterns
- Phone OTP: Any 6 digits accepted
- OAuth verification: 1.2s setTimeout, populates Maya's reach (IG 47.2K, TikTok 82.1K, YT 8.4K)

---

## Design Specs

### Design System Compliance
- All colors from `constants/theme.ts`
- Typography tokens: displayXl, monoGreeting, monoLabel, monoTimestamp
- Radii: radii.card (14), radii.pill (9999), radii.avatar (12)
- Decline tone for "Unverified" warning (no red anywhere)

### Key Dimensions (from reference)
| Element | Spec |
|---------|------|
| Welcome logo tile | 64x64, accent bg, "H" 32px |
| Welcome headline | 44px / 800 / -0.045em |
| Done check circle | 88x88, accent bg |
| Done headline | 40px / 800 / -0.04em |
| StepShell top bar | 56px height |
| StepShell back button | 36x36 circle |
| Progress bar | 4px height |
| Step title | 32px / 800 / -0.045em |
| Chip | py8 px14, 13px semibold |
| Primary chip "01" | JetBrainsMono-Bold 8.5px |
| Platform checkbox | 22x22 circle |

### Animation
- Done check: spring 0 -> 1 (damping 12, stiffness 180)
- Content fade-up: 200ms delay, 400ms duration

---

## Implementation Summary

### Files Created (18 total)
| File | Purpose |
|------|---------|
| `app/(auth)/onboarding.tsx` | Main screen with step state machine |
| `types/onboarding.ts` | OnboardingState, step unions, helpers |
| `constants/onboardingOptions.ts` | Category lists, content types, languages |
| `components/onboarding/StepShell.tsx` | Shared layout wrapper |
| `components/onboarding/FieldCard.tsx` | Input container |
| `components/onboarding/ChipGrid.tsx` | Multi/single select chips |
| `components/onboarding/WelcomeStep.tsx` | Full-screen welcome |
| `components/onboarding/PhoneStep.tsx` | Phone + OTP |
| `components/onboarding/ForkStep.tsx` | Persona selection |
| `components/onboarding/DoneStep.tsx` | Full-screen done |
| `components/onboarding/business/NameStep.tsx` | Name + category |
| `components/onboarding/business/LocationStep.tsx` | Location input |
| `components/onboarding/business/LogoStep.tsx` | Logo upload |
| `components/onboarding/business/BioStep.tsx` | Bio textarea |
| `components/onboarding/influencer/NameBioStep.tsx` | Name + bio |
| `components/onboarding/influencer/PhotoStep.tsx` | Photo upload |
| `components/onboarding/influencer/CategoriesStep.tsx` | Categories |
| `components/onboarding/influencer/ContentStep.tsx` | Content types |
| `components/onboarding/influencer/LanguagesStep.tsx` | Languages |
| `components/onboarding/influencer/DemoStep.tsx` | Demographics |
| `components/onboarding/influencer/PlatformsStep.tsx` | Platform verify |
| `components/onboarding/index.ts` | Barrel exports |

### Files Modified
| File | Change |
|------|--------|
| `types/perk.ts` | Added Travel, Home, Music, Gaming to PerkCategory |
| `app/(auth)/_layout.tsx` | Fixed bg color to theme.bg |
| `app/index.tsx` | Cold-start redirect now points to `/(auth)/onboarding` |
| `components/business/profile/BusinessProfileScreen.tsx` | Sign-out routes to `/(auth)/onboarding` |
| `components/influencer/profile/InfluencerProfileScreen.tsx` | Sign-out routes to `/(auth)/onboarding` |

### Files Removed
| File | Reason |
|------|--------|
| `app/(auth)/dev-login.tsx` | Made redundant by onboarding Fork step |

### Key Decisions
1. Progress bar shows on 4 business steps (not done), 7 influencer steps (not done)
2. ChipGrid supports both single-select and multi-select modes
3. Photo placeholder uses "Photo" text (real upload TBD)
4. Monogram fallback generates initials from business name

---

## Code Review

Pending code review.

---

## QA Report

Pending QA.

---

## Final Status

- **Bugs Found:** 0 (pending QA)
- **Blockers:** NO
- **Ready to Ship:** PENDING CODE REVIEW + QA

---

## Next Steps

1. Code review focusing on pixel fidelity to reference
2. QA pass: all validation gates, mock OAuth, tsc clean
3. User approval
4. Push to feature/onboarding branch
5. Open PR to main

---

## Out of Scope (Future)

- Real SMS OTP
- Real OAuth verification
- Supabase persistence
- First-run detection / cold-start gate swap
- Image picker integration

---

*End of Project Plan*
