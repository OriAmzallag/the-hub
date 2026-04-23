# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm start                  # Start Metro bundler (Expo Go)
npm run ios                # Start with iOS simulator
npm run android            # Start with Android emulator
npm run web                # Start web version
npx expo start --clear     # Start with cleared Metro cache (use after config changes)

# Installing packages — always use expo install for Expo/RN packages
npx expo install <package>
npm install <package> --legacy-peer-deps   # for non-Expo packages
```

No test runner or linter is configured yet.

## Architecture

**Runtime:** React Native 0.81 + Expo SDK 54, Expo Router v6 (file-based routing), NativeWind v4 (Tailwind CSS), TypeScript.

**Backend:** Supabase only — no separate server. All DB queries, auth, and file storage go through `lib/supabase.ts`. Schema lives in `supabase_schema.sql` (run manually in the Supabase SQL Editor). Storage bucket `influencer-gallery` must be created manually in the Supabase dashboard (public).

### Auth & session flow

`lib/AuthContext.tsx` wraps the whole app and exposes `{ session, profile, loading, refreshProfile, signOut }`.

- `session` — Supabase auth session (persisted via AsyncStorage)
- `profile` — row from the `profiles` table, fetched automatically when session changes
- `refreshProfile()` — must be called after creating a profile row so the context updates without waiting for a new session event

`app/_layout.tsx` guards routes:
- No session → redirect to `/(auth)/welcome`
- Session + profile + in auth group (but not on a profile-setup screen) → redirect to `/(tabs)/home`
- Session + no profile + in auth group → do nothing (user is completing registration)

### Registration flow

```
register.tsx  →  influencer-profile.tsx (4-step wizard)
                              OR
              →  business-profile.tsx
```

Both profile-setup screens call `await refreshProfile()` then `router.replace("/(tabs)/home")` at the end. The two-step DB insert pattern is: insert to `profiles` first (gets back the `id`), then insert to the role-specific table using that `id` as the primary key.

`influencer-profile.tsx` inserts to four tables: `profiles`, `influencer_profiles`, `influencer_platforms` (per-platform URL + followers), `services` (fixed-price menu). The last two are non-fatal — they log warnings and continue if the tables don't exist yet.

### Database schema (Supabase / PostgreSQL)

Dual-table inheritance pattern:

```
profiles (base)
  ├── influencer_profiles  (1-to-1, id = profiles.id)
  │     ├── influencer_platforms  (1-to-many, influencer_id)
  │     └── services              (1-to-many, influencer_id)
  └── business_profiles    (1-to-1, id = profiles.id)
```

`profiles.role` is either `"influencer"` or `"business"` — this drives all role-aware UI.

All tables have RLS enabled. Public SELECT on all profile tables. INSERT/UPDATE/DELETE restricted to the owning user via `auth.uid()` checks.

### Styling

NativeWind v4 — use Tailwind class strings on React Native components. `global.css` is the Tailwind entry point; `tailwind.config.js` sets `darkMode: "class"` (required for react-native-css-interop). Custom colours are defined in `tailwind.config.js` and mirrored in `constants/theme.ts` (used in the tab bar which can't use className).

### Role-aware screens

Every main tab screen reads `profile.role` from `useAuth()` and branches on `isInfluencer = profile?.role === "influencer"`:

- **Home** — stats + CTA differ per role
- **Discover** (`app/(tabs)/discover.tsx`) — business searches influencers (filters: platform, niche, audience size); influencer searches businesses (filters: industry, budget). Queries use Supabase nested select with `!inner` joins.
- **Collabs** — shared UI, copy differs per role
- **Profile** — fetches `influencer_profiles` or `business_profiles` on mount to show role-specific details

### Environment variables

Stored in `.env.local` (not committed). Must be prefixed `EXPO_PUBLIC_` to be inlined by Metro:

```
EXPO_PUBLIC_SUPABASE_URL=
EXPO_PUBLIC_SUPABASE_ANON_KEY=
```
