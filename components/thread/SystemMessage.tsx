/**
 * SystemMessage Component
 * Centered pill for system events like "Deal accepted"
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Check } from 'lucide-react-native';
import { colors, typography } from '@/constants/theme';

interface SystemMessageProps {
  text: string;
  timestamp: string;
  icon?: 'check' | string;
}

export function SystemMessage({ text, timestamp, icon }: SystemMessageProps) {
  return (
    <View style={styles.container}>
      {icon === 'check' && (
        <Check size={11} color={colors.accent} strokeWidth={2.5} />
      )}
      <Text style={styles.text}>
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
  text: {
    fontFamily: 'JetBrainsMono-Medium',
    fontSize: 9.5,
    fontWeight: '500',
    letterSpacing: 1.71, // 0.18em
    lineHeight: 9.5,
    color: colors.inkMuted,
  },
});
