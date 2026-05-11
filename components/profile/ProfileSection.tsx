/**
 * ProfileSection Component
 * Section with mono caption and grouped surface card.
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, typography, radii } from '@/constants/theme';

interface ProfileSectionProps {
  caption: string;
  children: React.ReactNode;
}

export function ProfileSection({ caption, children }: ProfileSectionProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.caption}>{caption}</Text>
      <View style={styles.card}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 24,
  },
  caption: {
    ...typography.monoStatus,
    color: colors.inkMuted,
    marginBottom: 12,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radii.card,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
  },
});
