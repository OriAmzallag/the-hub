# Phase 0: Technical Plan

**Author:** Tech Lead Agent  
**Date:** 2026-05-07  
**Status:** APPROVED FOR IMPLEMENTATION  

---

## 1. Technology Stack (with pinned versions)

### Core Framework
```json
{
  "expo": "~52.0.0",
  "expo-router": "~4.0.0",
  "react": "18.3.1",
  "react-native": "0.76.x"
}
```

### Styling
```json
{
  "nativewind": "^4.1.0",
  "tailwindcss": "^3.4.0"
}
```

### State Management & Forms
```json
{
  "zustand": "^4.5.0",
  "react-hook-form": "^7.54.0",
  "zod": "^3.24.0",
  "@hookform/resolvers": "^3.9.0"
}
```

### Supabase
```json
{
  "@supabase/supabase-js": "^2.47.0",
  "react-native-url-polyfill": "^2.0.0"
}
```

### UI Libraries
```json
{
  "lucide-react-native": "^0.475.0",
  "react-native-reanimated": "~3.16.0",
  "react-native-gesture-handler": "~2.20.0",
  "expo-image": "~2.0.0"
}
```

### Platform Services
```json
{
  "expo-location": "~18.0.0",
  "expo-notifications": "~0.29.0",
  "expo-secure-store": "~14.0.0"
}
```

### Observability
```json
{
  "@sentry/react-native": "^6.5.0",
  "mixpanel-react-native": "^3.1.0"
}
```

### Development
```json
{
  "typescript": "~5.6.0",
  "@types/react": "~18.3.0",
  "prettier": "^3.4.0",
  "eslint": "^9.0.0"
}
```

---

## 2. Project Structure (per Architecture Section 6)

```
the-hub/
├── app/                          # Expo Router pages
│   ├── _layout.tsx               # Root layout (minimal)
│   ├── (auth)/
│   │   └── _layout.tsx           # Auth group layout (skeleton)
│   ├── (influencer)/
│   │   └── _layout.tsx           # Influencer dashboard layout (skeleton)
│   └── (business)/
│       └── _layout.tsx           # Business dashboard layout (skeleton)
├── components/                   # Reusable UI components
│   └── .gitkeep
├── constants/
│   └── theme.ts                  # Hub Vibe design tokens
├── hooks/
│   ├── useSession.ts             # Auth session hook
│   └── index.ts                  # Barrel export
├── lib/
│   ├── supabase.ts               # Supabase client
│   └── index.ts                  # Barrel export
├── stores/
│   ├── authStore.ts              # Zustand auth store
│   └── index.ts                  # Barrel export
├── types/
│   ├── database.ts               # Supabase generated types
│   ├── models.ts                 # App-level type definitions
│   └── index.ts                  # Barrel export
├── utils/
│   └── index.ts                  # Utility functions
├── supabase/
│   ├── migrations/
│   │   ├── 0001_create_users.sql
│   │   ├── 0002_create_influencer_profiles.sql
│   │   ├── 0003_create_services.sql
│   │   ├── 0004_create_business_profiles.sql
│   │   ├── 0005_create_bookings.sql
│   │   ├── 0006_create_perks.sql
│   │   ├── 0007_create_perk_claims.sql
│   │   ├── 0008_create_ratings.sql
│   │   ├── 0009_create_messaging.sql
│   │   └── 0010_create_trending_cards.sql
│   └── config.toml               # Supabase local config (template)
├── .env.example
├── .gitignore
├── app.json
├── babel.config.js
├── metro.config.js
├── nativewind-env.d.ts
├── package.json
├── tailwind.config.js
├── tsconfig.json
└── README.md
```

---

## 3. File-by-File Scaffolding Plan

### Phase 3A: Project Initialization
1. Run `npx create-expo-app@latest the-hub --template blank-typescript`
2. Move contents to working directory (or initialize in place)

### Phase 3B: Install Dependencies
```bash
# Core Expo packages
npx expo install expo-router expo-image expo-location expo-notifications expo-secure-store

# Reanimated and Gesture Handler
npx expo install react-native-reanimated react-native-gesture-handler

# NativeWind
pnpm add nativewind tailwindcss
npx tailwindcss init

# Supabase
pnpm add @supabase/supabase-js react-native-url-polyfill

# State and Forms
pnpm add zustand react-hook-form zod @hookform/resolvers

# UI
pnpm add lucide-react-native

# Observability
pnpm add @sentry/react-native mixpanel-react-native

# Dev dependencies
pnpm add -D @types/react prettier eslint
```

### Phase 3C: Configuration Files

| File | Purpose |
|------|---------|
| `tailwind.config.js` | NativeWind content paths, theme extension |
| `babel.config.js` | Add NativeWind plugin |
| `metro.config.js` | Configure for NativeWind CSS |
| `nativewind-env.d.ts` | NativeWind TypeScript reference |
| `app.json` | Expo config with scheme, plugins |
| `tsconfig.json` | Strict mode, path aliases |

### Phase 3D: Core Library Files

| File | Contents |
|------|----------|
| `lib/supabase.ts` | Client initialization, URL polyfill, SecureStore adapter |
| `hooks/useSession.ts` | Auth state subscription hook |
| `stores/authStore.ts` | Zustand store for user/session |
| `constants/theme.ts` | Hub Vibe tokens |
| `types/models.ts` | All entity types |
| `types/database.ts` | Placeholder for Supabase codegen |

### Phase 3E: Expo Router Layouts

| File | Contents |
|------|----------|
| `app/_layout.tsx` | Root Stack with Supabase provider setup |
| `app/(auth)/_layout.tsx` | Empty Stack for auth screens |
| `app/(influencer)/_layout.tsx` | Empty Tabs for influencer dashboard |
| `app/(business)/_layout.tsx` | Empty Tabs for business dashboard |

**Decision:** Expo Router requires at least a root `_layout.tsx` to boot. Group layouts are optional but we include skeleton files to establish the routing structure.

### Phase 3F: Database Migrations

See Section 4 for migration ordering and content.

---

## 4. Supabase Migration Ordering

Migrations must be ordered to respect foreign key dependencies:

```
0001_create_users.sql          # Base table - no dependencies
0002_create_influencer_profiles.sql # FK -> users
0003_create_services.sql        # FK -> influencer_profiles
0004_create_business_profiles.sql # FK -> users
0005_create_bookings.sql        # FK -> services, business_profiles
0006_create_perks.sql           # No FK (standalone)
0007_create_perk_claims.sql     # FK -> perks, users
0008_create_ratings.sql         # FK -> bookings, users
0009_create_messaging.sql       # inquiry_threads + messages; FK -> users
0010_create_trending_cards.sql  # FK -> influencer_profiles (optional)
```

---

## 5. RLS Policy Sketches

### Users Table
```sql
-- Users can read their own profile
CREATE POLICY "Users can view own profile" ON users
  FOR SELECT USING (auth.uid() = id);

-- Users can update their own profile
CREATE POLICY "Users can update own profile" ON users
  FOR UPDATE USING (auth.uid() = id);
```

### Influencer Profiles
```sql
-- Public read for discovery
CREATE POLICY "Influencer profiles are publicly readable" ON influencer_profiles
  FOR SELECT USING (true);

-- Only owner can update
CREATE POLICY "Influencer can update own profile" ON influencer_profiles
  FOR UPDATE USING (auth.uid() = user_id);
```

### Services
```sql
-- Public read
CREATE POLICY "Services are publicly readable" ON services
  FOR SELECT USING (true);

-- Influencer owns their services
CREATE POLICY "Influencer can manage own services" ON services
  FOR ALL USING (
    auth.uid() IN (
      SELECT user_id FROM influencer_profiles WHERE id = services.influencer_id
    )
  );
```

### Bookings
```sql
-- Participants can view their bookings
CREATE POLICY "Participants can view bookings" ON bookings
  FOR SELECT USING (
    auth.uid() IN (business_id, (
      SELECT user_id FROM influencer_profiles tp
      JOIN services s ON s.influencer_id = tp.id
      WHERE s.id = bookings.service_id
    ))
  );
```

### Messages
```sql
-- Thread participants can read/write
CREATE POLICY "Thread participants can access messages" ON messages
  FOR ALL USING (
    auth.uid() IN (
      SELECT influencer_user_id FROM inquiry_threads WHERE id = messages.thread_id
      UNION
      SELECT business_user_id FROM inquiry_threads WHERE id = messages.thread_id
    )
  );
```

---

## 6. Environment Variables

### Required (.env.example)
```bash
# Supabase
EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here

# Sentry (optional for Phase 0)
SENTRY_DSN=

# Mixpanel (optional for Phase 0)
MIXPANEL_TOKEN=
```

### Notes
- `EXPO_PUBLIC_` prefix required for client-side access in Expo
- Supabase service role key should NEVER be in mobile app
- Real values provided by Tom after Supabase project creation

---

## 7. Technical Decisions Log

| Decision | Rationale |
|----------|-----------|
| Use `expo-secure-store` for session tokens | More secure than AsyncStorage for auth tokens |
| Pin Expo SDK 52 | Latest stable with React Native 0.76 |
| NativeWind v4 over v2 | Better Tailwind v3 support, CSS-first approach |
| Zustand over Redux | Simpler API, less boilerplate for solo developer |
| pnpm over npm/yarn | Faster installs, stricter dependency resolution |
| Single migrations folder | Simpler than splitting by feature for small team |
| Skeleton layouts over no layouts | Expo Router boots cleaner with structure in place |

---

## 8. Verification Commands

```bash
# Install dependencies
pnpm install

# Type check
npx tsc --noEmit

# Expo health check
npx expo-doctor

# Start dev server (no simulator needed)
npx expo start

# Validate migrations (requires Supabase CLI)
supabase db lint
```

---

## 9. Known Limitations

1. **No Supabase types auto-generation**: `types/database.ts` is a placeholder until Tom runs `supabase gen types typescript`
2. **No deep linking configured**: Requires app scheme setup in Phase 1
3. **No error boundaries**: Should be added in Phase 1
4. **Observability SDKs initialized but not wired**: Sentry/Mixpanel require project IDs from Tom

---

*End of Tech Lead Agent Output*
