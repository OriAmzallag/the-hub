# The Hub

An influencer-SMB marketplace mobile app built with Expo, React Native, and Supabase.

## Tech Stack

- **Framework**: Expo SDK 52 with Expo Router v4
- **Styling**: NativeWind (Tailwind CSS for React Native)
- **State**: Zustand
- **Forms**: React Hook Form + Zod
- **Backend**: Supabase (Auth, Database, Storage)
- **Analytics**: Mixpanel
- **Error Tracking**: Sentry

## Prerequisites

- Node.js 18+ (LTS recommended)
- pnpm (recommended) or npm/yarn
- Expo CLI: `npm install -g expo-cli`
- Supabase CLI (for migrations): `npm install -g supabase`
- iOS Simulator (Mac only) or Android Emulator for device testing

## Getting Started

### 1. Install Dependencies

```bash
pnpm install
```

### 2. Set Up Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. Copy your project URL and anon key from Settings > API
3. Create your environment file:

```bash
cp .env.example .env.local
```

4. Edit `.env.local` with your Supabase credentials:

```
EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### 3. Run Database Migrations

Option A: Using Supabase Dashboard
- Go to SQL Editor in your Supabase project
- Run each migration file in order (0001 through 0010)

Option B: Using Supabase CLI
```bash
# Link to your project
supabase link --project-ref your-project-ref

# Run migrations
supabase db push
```

### 4. Configure Auth Providers (Optional)

In Supabase Dashboard > Authentication > Providers:
- Enable Google OAuth (requires Google Cloud credentials)
- Enable Apple OAuth (requires Apple Developer credentials)

### 5. Start Development Server

```bash
pnpm start
```

Then:
- Press `i` for iOS Simulator
- Press `a` for Android Emulator
- Scan QR code with Expo Go app for physical device

## Project Structure

```
the-hub/
├── app/                    # Expo Router screens and layouts
│   ├── _layout.tsx         # Root layout
│   ├── (auth)/             # Auth screen group
│   ├── (talent)/           # Talent dashboard group
│   └── (hunter)/           # Hunter dashboard group
├── components/             # Reusable UI components
├── constants/              # Theme tokens and constants
├── hooks/                  # Custom React hooks
├── lib/                    # External service clients
├── stores/                 # Zustand state stores
├── types/                  # TypeScript type definitions
├── utils/                  # Utility functions
└── supabase/
    └── migrations/         # SQL migration files
```

## Available Scripts

| Command | Description |
|---------|-------------|
| `pnpm start` | Start Expo development server |
| `pnpm ios` | Start on iOS Simulator |
| `pnpm android` | Start on Android Emulator |
| `pnpm web` | Start web version |
| `pnpm typecheck` | Run TypeScript type checking |
| `pnpm lint` | Run ESLint |
| `pnpm format` | Format code with Prettier |

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `EXPO_PUBLIC_SUPABASE_URL` | Yes | Your Supabase project URL |
| `EXPO_PUBLIC_SUPABASE_ANON_KEY` | Yes | Supabase anonymous key |
| `SENTRY_DSN` | No | Sentry error tracking DSN |
| `MIXPANEL_TOKEN` | No | Mixpanel analytics token |

## Database Schema

The database consists of 10 main tables:

1. **users** - Core user profiles (linked to Supabase auth)
2. **talent_profiles** - Extended profiles for influencers
3. **services** - Services offered by talent
4. **hunter_profiles** - Extended profiles for SMBs/brands
5. **bookings** - Booking transactions
6. **perks** - Exclusive deals and discounts
7. **perk_claims** - Tracks perk redemptions
8. **ratings** - Reviews and ratings
9. **inquiry_threads** - Message thread metadata
10. **messages** - Individual messages

All tables have Row Level Security (RLS) enabled.

## Phase 0 Status

This is the foundation scaffold. Currently implemented:
- [x] Project structure
- [x] Dependencies installed
- [x] Supabase client with secure storage
- [x] Auth session hook
- [x] Zustand auth store
- [x] Design tokens (Hub Vibe)
- [x] TypeScript types for all entities
- [x] Database migrations with RLS
- [x] Expo Router skeleton layouts

Not yet implemented (Phase 1+):
- [ ] UI screens
- [ ] Auth flows
- [ ] Booking flows
- [ ] Messaging UI
- [ ] Push notifications
- [ ] Analytics events

## Contributing

This is a solo project by Tom. For any questions, reach out directly.

## License

Private - All rights reserved.
