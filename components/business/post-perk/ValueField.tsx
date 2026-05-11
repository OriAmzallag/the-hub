/**
 * ValueField Component
 * Big display number input with leading shekel symbol.
 */

import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { colors, radii, typography } from '@/constants/theme';

interface ValueFieldProps {
  value: number | null;
  onChange: (value: number | null) => void;
}

export function ValueField({ value, onChange }: ValueFieldProps) {
  const handleChange = (text: string) => {
    // Remove non-numeric characters
    const numeric = text.replace(/[^0-9]/g, '');
    if (numeric === '') {
      onChange(null);
    } else {
      onChange(parseInt(numeric, 10));
    }
  };

  return (
    <View style={styles.container}>
      {/* Section header */}
      <Text style={styles.sectionHeader}>VALUE</Text>

      {/* Value input */}
      <View style={styles.inputContainer}>
        <Text style={styles.currencySymbol}>₪</Text>
        <TextInput
          style={styles.input}
          value={value !== null ? String(value) : ''}
          onChangeText={handleChange}
          placeholder="0"
          placeholderTextColor={colors.inkSubtle}
          keyboardType="number-pad"
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 12,
  },
  sectionHeader: {
    ...typography.monoGreeting,
    color: colors.accent,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.card,
    paddingVertical: 16,
    paddingHorizontal: 14,
  },
  currencySymbol: {
    fontFamily: 'InterTight-ExtraBold',
    fontSize: 22,
    fontWeight: '800',
    letterSpacing: -0.88,
    color: colors.ink,
  },
  input: {
    fontFamily: 'InterTight-ExtraBold',
    fontSize: 22,
    fontWeight: '800',
    letterSpacing: -0.88,
    color: colors.ink,
    padding: 0,
    minWidth: 40,
    textAlign: 'center',
  },
});
