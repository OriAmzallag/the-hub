/**
 * Root Index Route
 *
 * Cold-start lands here. For dev builds we redirect straight to the
 * persona selector so we can choose Business vs Influencer on every
 * launch. Swap this for the real auth gate (welcome / sign-in) once
 * accounts are wired.
 */

import { Redirect } from 'expo-router';

export default function Index() {
  return <Redirect href="/(auth)/dev-login" />;
}
