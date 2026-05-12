# Technical Plan: Onboarding Auth Update

Generated: 2026-05-12

## Architecture

Device-token authentication using `expo-secure-store` for token persistence. Mock auth service that can be swapped for Supabase when backend is ready.

## File Structure

```
app/
  index.tsx                          # MODIFIED: SplashScreen (was redirect)

components/onboarding/
  SplashScreen.tsx                   # NEW: Token-check entry point
  WelcomeBackStep.tsx                # NEW: Returning user success state
  index.ts                           # MODIFIED: Export new components

services/
  auth.ts                            # NEW: Auth service + mock impl

types/
  auth.ts                            # NEW: Auth types
  onboarding.ts                      # MODIFIED: Add welcome-back step

components/business/profile/
  BusinessProfileScreen.tsx          # MODIFIED: Token clear on sign-out

components/influencer/profile/
  InfluencerProfileScreen.tsx        # MODIFIED: Token clear on sign-out
```

## Auth Service Interface

```typescript
interface AuthService {
  validateToken(token: string): Promise<TokenValidationResponse>;
  verifyOtp(phone: string, code: string): Promise<OtpVerifyResponse>;
  signOut(): Promise<void>;
}

interface TokenValidationResponse {
  valid: boolean;
  user?: AuthUser;
}

interface OtpVerifyResponse {
  success: boolean;
  accountExists: boolean;
  user?: AuthUser;
  token?: string;
}

interface AuthUser {
  id: string;
  firstName: string;
  photoUri: string | null;
  persona: 'business' | 'influencer';
}
```

## SecureStore Key

```typescript
const DEVICE_TOKEN_KEY = 'hub_device_token';
```

## Routing Logic

### Splash (app/index.tsx)
1. Get token from SecureStore
2. If token exists, validate with auth service
3. Enforce 500ms minimum dwell
4. Route based on result:
   - Valid + business -> `/(business)`
   - Valid + influencer -> `/(influencer)`
   - Invalid/missing -> `/(auth)/onboarding`

### OTP Verification Branch
1. Call `authService.verifyOtp(phone, otp)`
2. Store returned token in SecureStore
3. Route based on `accountExists`:
   - true -> WelcomeBack step -> persona home
   - false -> Fork step (existing flow)

### Sign-Out
1. Clear token: `SecureStore.deleteItemAsync(DEVICE_TOKEN_KEY)`
2. Route to `/(auth)/onboarding`

## Mock Implementation

For development testing:
- Token starting with `valid_` -> returns Maya (influencer)
- Token starting with `valid_business_` -> returns Avi (business)
- Phone ending in `0` -> existing account (Maya/influencer)
- Phone ending in `5` -> existing account (Avi/business)
- Other phones -> new account

## Dependencies

- `expo-secure-store` (already installed)
- No new dependencies required
