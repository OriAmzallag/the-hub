/**
 * FieldCard Component
 * Input container with optional mono label header.
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, typography, radii } from '@/constants/theme';

interface FieldCardProps {
  /** Optional mono label above the field */
  label?: string;
  /** Field content */
  children: React.ReactNode;
}

export function FieldCard({ label, children }: FieldCardProps) {
  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}
      <View style={styles.card}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 10,
  },
  label: {
    ...typography.monoGreeting,
    color: colors.inkMuted,
  },
  card: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.card,
    overflow: 'hidden',
  },
});
