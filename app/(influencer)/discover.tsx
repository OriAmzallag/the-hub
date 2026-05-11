/**
 * Influencer Discover (stub)
 *
 * Placeholder until the real content lands. Same shell as the Business
 * Discover so the navbar feels consistent across personas.
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Compass } from 'lucide-react-native';
import { colors, typography } from '@/constants/theme';
import { ScreenHeader } from '@/components/ui';

export default function InfluencerDiscoverScreen() {
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.container}>
      <ScreenHeader title="Discover" />
      <View style={[styles.body, { paddingBottom: insets.bottom + 100 }]}>
        <View style={styles.iconTile}>
          <Compass size={28} color={colors.accent} strokeWidth={1.8} />
        </View>
        <Text style={styles.caption}>COMING SOON</Text>
        <Text style={styles.headline}>Find Businesses</Text>
        <Text style={styles.subtext}>
          Browse open briefs and businesses looking to collaborate.
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  body: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  iconTile: {
    width: 64,
    height: 64,
    borderRadius: 16,
    backgroundColor: colors.accentSoft,
    borderWidth: 1,
    borderColor: colors.accentBorder,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  caption: {
    ...typography.monoStatusWide,
    color: colors.accent,
    marginBottom: 12,
  },
  headline: {
    ...typography.sectionTitle,
    color: colors.ink,
    marginBottom: 8,
  },
  subtext: {
    ...typography.bodyPreview,
    color: colors.inkMuted,
    textAlign: 'center',
    maxWidth: 280,
  },
});
