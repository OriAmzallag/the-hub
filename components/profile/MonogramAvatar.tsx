/**
 * MonogramAvatar Component
 * 96x96 rounded square avatar with initials for businesses without photos.
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, typography, radii } from '@/constants/theme';

interface MonogramAvatarProps {
  name: string;
}

/**
 * Extract initials from a name (first letter of each word, max 2)
 */
function getInitials(name: string): string {
  return name
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase())
    .slice(0, 2)
    .join('');
}

export function MonogramAvatar({ name }: MonogramAvatarProps) {
  const initials = getInitials(name);

  return (
    <View style={styles.container}>
      <Text style={styles.initials}>{initials}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 96,
    height: 96,
    borderRadius: radii.avatarHero,
    backgroundColor: colors.surfaceAlt,
    alignItems: 'center',
    justifyContent: 'center',
  },
  initials: {
    ...typography.displayLg,
    color: colors.ink,
  },
});
