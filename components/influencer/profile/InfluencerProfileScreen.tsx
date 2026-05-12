/**
 * InfluencerProfileScreen Component
 * Full profile screen for influencer users.
 */

import React from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import {
  PenSquare,
  Calendar,
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
import { ViewAsPublicCard } from './ViewAsPublicCard';
import { MAYA_COHEN } from '@/constants/mockInfluencerStorefront';
import { clearDeviceToken } from '@/services/auth';
import type { MiniStatItem } from '@/types/profile';

// Mock stats for Maya (not in storefront data)
const MAYA_STATS = {
  deals: 38,
  bookingValue: 12850,
  rating: 4.9,
};

/**
 * Format booking value with shekel symbol
 */
function formatBookingValue(value: number): string {
  return `${value.toLocaleString()}`;
}

/**
 * Format availability status hint
 */
function formatAvailabilityHint(available: boolean, location: string): string {
  return `${available ? 'AVAILABLE' : 'BUSY'} . ${location.toUpperCase()}`;
}

export function InfluencerProfileScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const profile = MAYA_COHEN;

  const stats: [MiniStatItem, MiniStatItem, MiniStatItem] = [
    { value: String(MAYA_STATS.deals), label: 'Deals' },
    { value: formatBookingValue(MAYA_STATS.bookingValue), label: 'Booking value' },
    { value: String(MAYA_STATS.rating), label: 'Rating', hasAccentStar: true },
  ];

  // Get first portfolio image as avatar
  const avatarUri = profile.portfolio[0] || null;

  const handleViewPublic = () => {
    router.push(`/influencer/${profile.id}?preview=1`);
  };

  const handleEditStorefront = () => {
    router.push('/influencer/storefront/edit');
  };

  const handleAvailability = () => {
    console.log('TODO: Open availability settings');
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
    // Clear device token from SecureStore
    await clearDeviceToken();

    // Route back to onboarding flow
    router.replace('/(auth)/onboarding');
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
          variant="photo"
          name={profile.name}
          verified={profile.verified}
          imageUri={avatarUri}
        />

      <MiniStatsRow stats={stats} />

      <ViewAsPublicCard onPress={handleViewPublic} />

      <ProfileSection caption="MANAGE">
        <ProfileRow
          icon={PenSquare}
          label="Edit storefront"
          onPress={handleEditStorefront}
        />
        <ProfileRow
          icon={Calendar}
          label="Availability"
          hint={formatAvailabilityHint(profile.available, profile.location)}
          isLast
          onPress={handleAvailability}
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
