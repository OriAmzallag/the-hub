/**
 * PlatformsTile Component
 * Full-width tile showing social media platforms with follower counts.
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Instagram, Music2, Youtube } from 'lucide-react-native';
import { colors } from '@/constants/theme';
import type { InfluencerPlatform } from '@/types/influencer';

interface PlatformsTileProps {
  platforms: InfluencerPlatform[];
}

const PLATFORM_ICONS = {
  instagram: Instagram,
  tiktok: Music2,
  youtube: Youtube,
} as const;

export function PlatformsTile({ platforms }: PlatformsTileProps) {
  if (platforms.length === 0) return null;

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Platforms</Text>
      <View style={styles.platformsRow}>
        {platforms.map((platform, index) => {
          const IconComponent = PLATFORM_ICONS[platform.icon];
          return (
            <View key={index} style={styles.platformItem}>
              <IconComponent
                size={18}
                strokeWidth={1.8}
                color={colors.inkMuted}
              />
              <Text style={styles.followers}>{platform.followers}</Text>
            </View>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 18,
    marginTop: 8,
  },
  label: {
    fontFamily: 'JetBrainsMono-Medium',
    fontSize: 9.5,
    fontWeight: '500',
    letterSpacing: 1.425,
    textTransform: 'uppercase',
    color: colors.inkMuted,
    marginBottom: 12,
  },
  platformsRow: {
    flexDirection: 'row',
    gap: 28,
  },
  platformItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 9,
  },
  followers: {
    fontFamily: 'InterTight-Bold',
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: -0.35,
    color: colors.ink,
  },
});
