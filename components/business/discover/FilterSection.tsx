/**
 * FilterSection Component
 * Section header with optional hint and body wrapper.
 * v2: hint now styled in accent color (indicates active state like "N selected")
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '@/constants/theme';

interface FilterSectionProps {
  title: string;
  hint?: string;
  children: React.ReactNode;
}

export function FilterSection({ title, hint, children }: FilterSectionProps) {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{title}</Text>
        {hint && <Text style={styles.hint}>{hint}</Text>}
      </View>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  title: {
    fontFamily: 'InterTight-Bold',
    fontSize: 16,
    letterSpacing: -0.4,
    color: colors.ink,
  },
  hint: {
    fontFamily: 'JetBrainsMono-Medium',
    fontSize: 9.5,
    letterSpacing: 1.14,
    textTransform: 'uppercase',
    color: colors.accent, // Changed from inkMuted - hints now show active state
  },
});
