# Phase 0: Foundation Requirements

**Product:** The Hub - Influencer-SMB Marketplace Mobile App  
**Phase:** 0 - Foundation  
**Author:** PM Agent  
**Date:** 2026-05-07  

---

## 1. Overview

Phase 0 establishes the technical foundation for The Hub mobile application. This phase focuses exclusively on scaffolding, configuration, and infrastructure setup. No user-facing screens or features will be implemented.

---

## 2. Definition of Done

"Scaffolding done" means:

1. **Expo Project Initialized**: A working Expo project that boots without errors
2. **Dependencies Installed**: All required packages per architecture spec are installed and compatible
3. **Folder Structure Created**: Project structure matches architecture section 6
4. **Supabase Client Configured**: `lib/supabase.ts` with proper typing and session management hooks
5. **Database Migrations Written**: SQL migrations for all 10 entities (users, talent_profiles, services, hunter_profiles, bookings, perks, perk_claims, ratings, inquiry_threads, messages, trending_cards)
6. **RLS Policies Sketched**: Row-Level Security policies defined in migration files
7. **TypeScript Types Defined**: Type definitions matching the data model
8. **Theme Tokens File Created**: `constants/theme.ts` with Hub Vibe design tokens
9. **Configuration Files Present**: tailwind.config.js, .env.example, tsconfig.json properly configured
10. **README with Setup Instructions**: Clear documentation for Tom to run the project

---

## 3. Acceptance Criteria

| ID | Criterion | Verification Method |
|----|-----------|---------------------|
| AC-01 | `pnpm install` completes without errors | Manual execution |
| AC-02 | `npx expo start` boots the dev server | Manual execution |
| AC-03 | `npx tsc --noEmit` passes with no type errors | Manual execution |
| AC-04 | All 10 database entity migrations parse without SQL errors | Supabase CLI validation |
| AC-05 | Folder structure matches architecture section 6 | Visual inspection |
| AC-06 | `.env.example` documents all required environment variables | File review |
| AC-07 | NativeWind/Tailwind configured and theme tokens accessible | Config file review |
| AC-08 | Zustand, React Hook Form, Zod installed and importable | TypeScript compilation |
| AC-09 | Expo Router configured with minimal layout files | Project structure review |
| AC-10 | README contains clear setup and run instructions | Documentation review |

---

## 4. Explicitly Out of Scope

The following are NOT part of Phase 0:

### 4.1 Screens and UI Components
- NO welcome.tsx
- NO sign-up.tsx or sign-in.tsx
- NO dashboard screens (talent or hunter)
- NO profile screens
- NO booking flows
- NO perk screens
- NO messaging UI
- NO settings screens

### 4.2 Business Logic
- NO authentication flow implementation (only client setup)
- NO booking logic
- NO payment integration
- NO push notification handlers
- NO analytics event tracking (only SDK setup)

### 4.3 Backend Services
- NO Supabase Edge Functions
- NO actual Supabase project creation (Tom does this)
- NO real data seeding
- NO third-party API integrations

### 4.4 DevOps
- NO CI/CD pipeline setup
- NO app store configuration
- NO production environment setup

---

## 5. Risks and Mitigations

| Risk | Impact | Likelihood | Mitigation |
|------|--------|------------|------------|
| Dependency version conflicts | HIGH | MEDIUM | Pin exact versions; test with fresh install |
| NativeWind v4 breaking changes | MEDIUM | LOW | Use stable v4 release; follow official setup guide |
| Expo SDK compatibility issues | HIGH | LOW | Use recommended SDK version; run expo-doctor |
| Supabase migration syntax errors | MEDIUM | MEDIUM | Validate SQL syntax; use typed queries |
| Missing environment variables | LOW | HIGH | Comprehensive .env.example with comments |
| TypeScript strict mode issues | LOW | MEDIUM | Configure appropriately; fix as encountered |

---

## 6. Dependencies on External Actions

Tom (founder) must:
1. Create a Supabase project manually
2. Configure OAuth providers (Google, Apple) in Supabase dashboard
3. Copy Supabase URL and anon key to `.env.local`
4. Run migrations via Supabase CLI or dashboard

---

## 7. Success Metrics

Phase 0 is successful when:
- A new developer can clone, install, and boot the app in under 5 minutes
- TypeScript compilation passes with zero errors
- The project structure is clear and matches the architecture spec
- All required dependencies are present and correctly versioned

---

## 8. Timeline Estimate

For a solo developer (Tom):
- Supabase project setup: 30 minutes
- Environment configuration: 15 minutes
- Verify scaffold works: 15 minutes
- **Total:** ~1 hour to have a running foundation

---

*End of PM Agent Output*
