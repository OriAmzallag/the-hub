/**
 * Business Dashboard Layout
 * Tab navigation for business (SMB/brand) dashboard screens.
 */

import React, { useEffect } from 'react';
import { Tabs } from 'expo-router';
import { CustomTabBar } from '@/components/ui';
import { colors } from '@/constants/theme';
import { seedNotifications } from '@/lib/notifications';

export default function BusinessLayout() {
  // Seed notifications on mount for demo/dev
  useEffect(() => {
    seedNotifications('business');
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
