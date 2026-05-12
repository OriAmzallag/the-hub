/**
 * Root Index Route
 *
 * Cold-start lands here. We send every launch into the onboarding flow
 * (Welcome → Phone → Fork → Persona). The dev-only persona-picker that
 * used to live at /(auth)/dev-login was removed once the Fork step
 * inside onboarding made it redundant. Swap this for a real auth gate
 * + first-run detection once accounts are wired.
 */

import { Redirect } from 'expo-router';

export default function Index() {
  return <Redirect href="/(auth)/onboarding" />;
}
