/**
 * BriefField Component
 * Multiline text input with character counter for the project brief.
 */

import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { colors } from '@/constants/theme';
import { MAX_BRIEF_LENGTH } from '@/constants/bookingDateChips';
import { SectionHeader } from './SectionHeader';

interface BriefFieldProps {
  value: string;
  onChangeText: (text: string) => void;
}

export function BriefField({ value, onChangeText }: BriefFieldProps) {
  const [hasTyped, setHasTyped] = useState(false);
  const charCount = value.length;
  const isAtLimit = charCount >= MAX_BRIEF_LENGTH;
  const hasContent = charCount > 0;

  const handleChangeText = (text: string) => {
    if (!hasTyped && text.length > 0) {
      setHasTyped(true);
    }
    // Hard clip to max length (handles paste)
    onChangeText(text.slice(0, MAX_BRIEF_LENGTH));
  };

  return (
    <View style={styles.section}>
      <Text style={styles.requiredTag}>Required</Text>
      <SectionHeader title="The brief" />

      <View style={[styles.card, hasContent && styles.cardActive]}>
        <TextInput
          style={styles.input}
          value={value}
          onChangeText={handleChangeText}
          placeholder="Describe your project, goals, and any specific requirements..."
          placeholderTextColor={colors.inkMuted}
          multiline
          numberOfLines={5}
          textAlignVertical="top"
        />

        {hasTyped && (
          <Text style={[styles.counter, isAtLimit && styles.counterAtLimit]}>
            {charCount} / {MAX_BRIEF_LENGTH}
          </Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    marginBottom: 24,
  },
  requiredTag: {
    fontFamily: 'JetBrainsMono-Medium',
    fontSize: 10,
    fontWeight: '500',
    letterSpacing: 2,
    textTransform: 'uppercase',
    color: colors.accent,
    marginBottom: 6,
  },
  card: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 14,
    paddingTop: 14,
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  cardActive: {
    borderColor: colors.borderStrong,
  },
  input: {
    fontFamily: 'InterTight-Regular',
    fontSize: 14,
    letterSpacing: -0.14,
    lineHeight: 21,
    color: colors.ink,
    minHeight: 105, // ~5 lines
    padding: 0,
  },
  counter: {
    fontFamily: 'JetBrainsMono-Medium',
    fontSize: 9.5,
    fontWeight: '500',
    letterSpacing: 0.95,
    color: colors.inkMuted,
    textAlign: 'right',
    marginTop: 8,
  },
  counterAtLimit: {
    color: colors.accent,
  },
});
