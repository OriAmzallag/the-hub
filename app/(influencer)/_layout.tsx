/**
 * Influencer Dashboard Layout
 *
 * Same 4-tab navigation as the Business side, using the shared
 * CustomTabBar. Tab order mirrors the Business shell so the bottom
 * chrome reads identically across personas:
 *   Discover · Dashboard (index) · Inquiries · Profile
 *
 * The non-Profile screens are stubs for now (real content arrives
 * in a follow-up feature).
 */

import React, { useEffect } from 'react';
import { Tabs } from 'expo-router';
import { CustomTabBar } from '@/components/ui';
import { colors } from '@/constants/theme';
import { seedNotifications } from '@/lib/notifications';

export default function InfluencerLayout() {
  // Seed notifications on mount for demo/dev
  useEffect(() => {
    seedNotifications('influencer');
  }, []);

  return (
    <Tabs
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{
        headerShown: false,
        sceneStyle: { backgroundColor: colors.bg },
      }}
    >
      <Tabs.Screen
        name="discover"
        options={{ title: 'Discover' }}
      />
      <Tabs.Screen
        name="index"
        options={{ title: 'Dashboard' }}
      />
      <Tabs.Screen
        name="inquiries"
        options={{ title: 'Inquiries' }}
      />
      <Tabs.Screen
        name="profile"
        options={{ title: 'Profile' }}
      />
    </Tabs>
  );
}
