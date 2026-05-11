/**
 * ProfileHero Component
 * Hero section with avatar (photo or monogram), name, and verified badge.
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { BadgeCheck } from 'lucide-react-native';
import { colors, typography } from '@/constants/theme';
import { PhotoAvatar } from './PhotoAvatar';
import { MonogramAvatar } from './MonogramAvatar';

interface ProfileHeroProps {
  variant: 'photo' | 'monogram';
  name: string;
  verified: boolean;
  imageUri?: string | null;
}

export function ProfileHero({ variant, name, verified, imageUri }: ProfileHeroProps) {
  return (
    <View style={styles.container}>
      {variant === 'photo' && imageUri ? (
        <PhotoAvatar uri={imageUri} />
      ) : (
        <MonogramAvatar name={name} />
      )}
      <View style={styles.nameRow}>
        <Text style={styles.name} numberOfLines={1}>
          {name}
        </Text>
        {verified && (
          <BadgeCheck
            size={18}
            color={colors.accent}
            style={styles.badge}
          />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginTop: 32,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
    maxWidth: '90%',
  },
  name: {
    ...typography.sectionTitle,
    color: colors.ink,
    flexShrink: 1,
  },
  badge: {
    marginLeft: 6,
  },
});
