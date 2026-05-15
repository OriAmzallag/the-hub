/**
 * SystemMessage Component
 * Centered pill for system events like "Deal accepted"
 *
 * Supports accent variant for important state transitions (e.g., Mark Done).
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Check } from 'lucide-react-native';
import { colors, typography } from '@/constants/theme';

interface SystemMessageProps {
  text: string;
  timestamp: string;
  icon?: 'check' | string;
  /** When true, uses accent styling (accentSoft bg, accentBorder, accent text) */
  accent?: boolean;
}

export function SystemMessage({
  text,
  timestamp,
  icon,
  accent = false,
}: SystemMessageProps) {
  return (
    <View style={[styles.container, accent && styles.containerAccent]}>
      {icon === 'check' && (
        <Check
          size={11}
          color={colors.accent}
          strokeWidth={2.5}
        />
      )}
      <Text style={[styles.text, accent && styles.textAccent]}>
        {text.toUpperCase()} · {timestamp.toUpperCase()}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: colors.surfaceAlt,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 100,
    paddingVertical: 6,
    paddingHorizontal: 12,
    marginVertical: 12,
  },
  containerAccent: {
    backgroundColor: colors.accentSoft,
    borderColor: colors.accentBorder,
  },
  text: {
    fontFamily: 'JetBrainsMono-Medium',
    fontSize: 9.5,
    fontWeight: '500',
    letterSpacing: 1.71, // 0.18em
    lineHeight: 9.5,
    color: colors.inkMuted,
  },
  textAccent: {
    fontFamily: 'JetBrainsMono-SemiBold',
    fontWeight: '600',
    color: colors.accent,
  },
});
