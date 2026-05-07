/**
 * Auth Group Layout
 *
 * Skeleton layout for authentication screens.
 * Actual screens (welcome, sign-in, sign-up) will be added in Phase 1.
 */

import { Stack } from "expo-router";

export default function AuthLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: "#FFFFFF" },
        animation: "slide_from_right",
      }}
    >
      {/* Screens to be added in Phase 1:
          - welcome.tsx
          - sign-in.tsx
          - sign-up.tsx
          - forgot-password.tsx
      */}
    </Stack>
  );
}
