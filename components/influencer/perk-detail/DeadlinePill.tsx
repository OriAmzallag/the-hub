/**
 * DeadlinePill Component
 * Displays the deadline for completing deliverables.
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Clock } from 'lucide-react-native';
import { colors, radii, typography } from '@/constants/theme';

interface DeadlinePillProps {
  deadline: string;
}

export function DeadlinePill({ deadline }: DeadlinePillProps) {
  return (
    <View style={styles.container}>
      <Clock size={12} strokeWidth={2.5} color={colors.inkMuted} />
      <Text style={styles.text}>{deadline}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 12,
    paddingVertical: 12,
    paddingHorizontal: 14,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.card,
  },
  text: {
    fontFamily: 'JetBrainsMono-Medium',
    fontSize: 10,
    fontWeight: '500',
    letterSpacing: 1,
    color: colors.inkMuted,
  },
});
