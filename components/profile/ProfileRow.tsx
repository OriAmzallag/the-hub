/**
 * ProfileRow Component
 * Pressable row with icon, label, optional hint, and chevron.
 */

import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { ChevronRight, type LucideIcon } from 'lucide-react-native';
import { colors, typography } from '@/constants/theme';

interface ProfileRowProps {
  icon: LucideIcon;
  label: string;
  hint?: string;
  isLast?: boolean;
  onPress?: () => void;
  accessibilityLabel?: string;
}

export function ProfileRow({
  icon: Icon,
  label,
  hint,
  isLast = false,
  onPress,
  accessibilityLabel,
}: ProfileRowProps) {
  return (
    <Pressable
      style={[styles.container, !isLast && styles.withBorder]}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel || label}
    >
      <Icon size={20} strokeWidth={2} color={colors.inkMuted} />
      <Text style={styles.label}>{label}</Text>
      {hint && <Text style={styles.hint}>{hint}</Text>}
      <ChevronRight size={18} color={colors.inkSubtle} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 52,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  withBorder: {
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  pressed: {
    opacity: 0.7,
  },
  label: {
    ...typography.rowTitle,
    color: colors.ink,
    marginLeft: 12,
    flex: 1,
  },
  hint: {
    ...typography.monoStatus,
    color: colors.inkMuted,
    marginRight: 8,
  },
});
