/**
 * SectionHeader Component for Inquiries Screen
 * Simple title-only variant for inbox sections.
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, typography } from '@/constants/theme';

interface SectionHeaderProps {
  title: string;
}

export function SectionHeader({ title }: SectionHeaderProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 18,
    marginBottom: 10,
    marginTop: 6,
  },
  title: {
    ...typography.tileTitle,
    color: colors.ink,
  },
});
