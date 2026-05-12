/**
 * Root Index Route — Splash Screen
 *
 * Token-check entry point. Validates the device session token stored in
 * SecureStore:
 * - Token valid → routes silently to persona home (business or influencer)
 * - Token missing/invalid → routes to onboarding (Welcome → Phone → OTP)
 *
 * This is the most-frequently-seen screen in the app, but the least
 * visible — production users barely register it.
 */

import { SplashScreen } from '@/components/onboarding';

export default function Index() {
  return <SplashScreen />;
}
