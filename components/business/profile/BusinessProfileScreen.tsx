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
  Clock,
  Shield,
  Globe,
  HelpCircle,
} from 'lucide-react-native';
import { colors } from '@/constants/theme';
import { ScreenHeader, NotificationBell } from '@/components/ui';
import {
  ProfileHero,
  MiniStatsRow,
  ProfileSection,
  ProfileRow,
  SignOutButton,
  VersionFooter,
} from '@/components/profile';
import { FITBAR_TLV } from '@/constants/mockBusinessProfile';
import { clearDeviceToken } from '@/services/auth';
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

  const handleDealHistory = () => {
    router.push('/history?viewerRole=business');
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

  const handleSignOut = async () => {
    try {
      await clearDeviceToken();
    } catch {
      // best effort — still sign the user out of the UI even if SecureStore fails
    }
    router.replace('/(auth)/onboarding');
  };

  return (
    <View style={styles.container}>
      <ScreenHeader title="Profile" rightSlot={<NotificationBell />} />

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
          onPress={handleEditProfile}
        />
        <ProfileRow
          icon={Clock}
          label="Deal history"
          isLast
          onPress={handleDealHistory}
        />
      </ProfileSection>

      <ProfileSection caption="ACCOUNT">
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
