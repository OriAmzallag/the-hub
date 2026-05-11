/**
 * Business Dashboard Layout
 * Tab navigation for business (SMB/brand) dashboard screens.
 */

import React from 'react';
import { Tabs } from 'expo-router';
import { CustomTabBar } from '@/components/ui';
import { colors } from '@/constants/theme';

export default function BusinessLayout() {
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
