/**
 * Influencer Dashboard Layout
 *
 * Minimal tab layout for influencer dashboard screens.
 * Tab bar is hidden for now - screens are accessed via direct navigation.
 * Full tab structure will be added when Discover/Dashboard/Inquiries
 * screens have real content.
 */

import { Tabs } from 'expo-router';
import { colors } from '@/constants/theme';

export default function InfluencerLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: { display: 'none' },
        sceneStyle: { backgroundColor: colors.bg },
      }}
    >
      <Tabs.Screen
        name="profile"
        options={{ title: 'Profile' }}
      />
    </Tabs>
  );
}
