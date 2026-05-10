/**
 * Influencer Dashboard Layout
 *
 * Skeleton layout for influencer (influencer) dashboard screens.
 * Tab navigation and screens will be added in Phase 1+.
 */

import { Tabs } from "expo-router";

export default function InfluencerLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: { display: "none" }, // Hidden until screens are implemented
      }}
    >
      {/* Tabs to be added in Phase 1+:
          - index.tsx (Dashboard/Home)
          - bookings.tsx
          - earnings.tsx
          - messages.tsx
          - profile.tsx
      */}
    </Tabs>
  );
}
