/**
 * FilterSection Component
 * Reusable section wrapper for the filter sheet.
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, typography } from '@/constants/theme';

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
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  title: {
    ...typography.rowPrimary,
    color: colors.ink,
  },
  hint: {
    ...typography.monoStatus,
    color: colors.accent,
  },
});
