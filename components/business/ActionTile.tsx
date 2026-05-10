/**
 * ActionTile Component
 * Quick action button (Find influencer, Post perk).
 */

import React from 'react';
import { View, Text, Pressable, StyleSheet, Platform } from 'react-native';
import { colors, typography, borderRadius, shadows } from '@/constants/theme';

interface ActionTileProps {
  icon: React.ReactNode;
  label: string;
  hint: string;
  primary?: boolean;
  onPress?: () => void;
}

export function ActionTile({
  icon,
  label,
  hint,
  primary = false,
  onPress,
}: ActionTileProps) {
  return (
    <Pressable
      style={[
        styles.container,
        primary ? styles.containerPrimary : styles.containerSecondary,
        primary && Platform.OS === 'ios' && shadows.accentGlow,
      ]}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={label}
    >
      <View
        style={[
          styles.iconBox,
          primary ? styles.iconBoxPrimary : styles.iconBoxSecondary,
        ]}
      >
        {icon}
      </View>

      <View style={styles.textContainer}>
        <Text
          style={[
            styles.label,
            primary ? styles.labelPrimary : styles.labelSecondary,
          ]}
        >
          {label}
        </Text>
        <Text
          style={[
            styles.hint,
            primary ? styles.hintPrimary : styles.hintSecondary,
          ]}
        >
          {hint}
        </Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, // Fill grid cell
    borderRadius: borderRadius.xl,
    padding: 16,
    paddingVertical: 18,
    minHeight: 110,
    justifyContent: 'space-between',
  },
  containerPrimary: {
    backgroundColor: colors.accent,
  },
  containerSecondary: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  iconBox: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconBoxPrimary: {
    backgroundColor: 'rgba(26, 24, 21, 0.18)',
  },
  iconBoxSecondary: {
    backgroundColor: colors.surfaceAlt,
  },
  textContainer: {
    marginTop: 24,
  },
  label: {
    ...typography.tileTitle,
    marginBottom: 5,
  },
  labelPrimary: {
    color: colors.bg,
  },
  labelSecondary: {
    color: colors.ink,
  },
  hint: {
    ...typography.monoStatus,
    letterSpacing: 1.71, // 0.18em at 9.5px
  },
  hintPrimary: {
    color: 'rgba(26, 24, 21, 0.55)',
  },
  hintSecondary: {
    color: colors.inkMuted,
  },
});
