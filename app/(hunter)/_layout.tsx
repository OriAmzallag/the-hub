/**
 * Hunter Dashboard Layout
 *
 * Skeleton layout for hunter (SMB/brand) dashboard screens.
 * Tab navigation and screens will be added in Phase 1+.
 */

import { Tabs } from "expo-router";

export default function HunterLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: { display: "none" }, // Hidden until screens are implemented
      }}
    >
      {/* Tabs to be added in Phase 1+:
          - index.tsx (Discover/Home)
          - bookings.tsx
          - perks.tsx
          - messages.tsx
          - profile.tsx
      */}
    </Tabs>
  );
}
