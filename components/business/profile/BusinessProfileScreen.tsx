/**
 * BusinessProfileScreen Component
 * Full profile screen for business users.
 */

import React from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import {
  Building2,
  Bell,
  Shield,
  Globe,
  HelpCircle,
} from 'lucide-react-native';
import { colors } from '@/constants/theme';
import { ScreenHeader } from '@/components/ui';
import {
  ProfileHero,
  MiniStatsRow,
  ProfileSection,
  ProfileRow,
  SignOutButton,
  VersionFooter,
} from '@/components/profile';
import { FITBAR_TLV } from '@/constants/mockBusinessProfile';
import type { MiniStatItem } from '@/types/profile';

/**
 * Format booking value with shekel symbol
 */
function formatBookingValue(value: number): string {
  return `${value.toLocaleString()}`;
}

export function BusinessProfileScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const profile = FITBAR_TLV;

  const stats: [MiniStatItem, MiniStatItem, MiniStatItem] = [
    { value: String(profile.stats.deals), label: 'Deals' },
    { value: formatBookingValue(profile.stats.bookingValue), label: 'Booking value' },
    { value: String(profile.stats.rating), label: 'Rating', hasAccentStar: true },
  ];

  const handleEditProfile = () => {
    console.log('TODO: Edit business profile');
  };

  const handleNotifications = () => {
    console.log('TODO: Open notifications settings');
  };

  const handlePrivacy = () => {
    console.log('TODO: Open privacy settings');
  };

  const handleLanguage = () => {
    console.log('TODO: Open language settings');
  };

  const handleHelp = () => {
    console.log('TODO: Open help & support');
  };

  const handleSignOut = () => {
    // TODO: Replace with real auth sign-out once accounts are wired.
    // For now sign-out drops us back at the dev persona selector so
    // we can switch sides without restarting the app.
    router.replace('/(auth)/dev-login');
  };

  return (
    <View style={styles.container}>
      <ScreenHeader title="Profile" />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[
          styles.content,
          { paddingBottom: insets.bottom + 100 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <ProfileHero
          variant="monogram"
          name={profile.name}
          verified={profile.verified}
        />

      <MiniStatsRow stats={stats} />

      <ProfileSection caption="MANAGE">
        <ProfileRow
          icon={Building2}
          label="Edit business profile"
          isLast
          onPress={handleEditProfile}
        />
      </ProfileSection>

      <ProfileSection caption="ACCOUNT">
        <ProfileRow
          icon={Bell}
          label="Notifications"
          onPress={handleNotifications}
        />
        <ProfileRow
          icon={Shield}
          label="Privacy"
          onPress={handlePrivacy}
        />
        <ProfileRow
          icon={Globe}
          label="Language"
          onPress={handleLanguage}
        />
        <ProfileRow
          icon={HelpCircle}
          label="Help & support"
          isLast
          onPress={handleHelp}
        />
      </ProfileSection>

        <SignOutButton onPress={handleSignOut} />

        <VersionFooter />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  scroll: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 20,
  },
});
