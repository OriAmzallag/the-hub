/**
 * AddRow Component
 * Dashed border button for adding items.
 */

import React from 'react';
import { Text, Pressable, StyleSheet } from 'react-native';
import { Plus } from 'lucide-react-native';
import { colors, typography, radii } from '@/constants/theme';

interface AddRowProps {
  label: string;
  onPress: () => void;
}

export function AddRow({ label, onPress }: AddRowProps) {
  return (
    <Pressable
      style={({ pressed }) => [styles.container, pressed && styles.pressed]}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`Add ${label}`}
    >
      <Plus size={16} color={colors.inkMuted} />
      <Text style={styles.label}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: radii.card,
    borderWidth: 1.5,
    borderColor: colors.borderStrong,
    borderStyle: 'dashed',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  pressed: {
    opacity: 0.7,
  },
  label: {
    ...typography.rowSecondary,
    color: colors.inkMuted,
  },
});
