/**
 * ReviewInput Component
 * Textarea with character counter for optional review.
 */

import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { colors, typography, radii } from '@/constants/theme';

interface ReviewInputProps {
  value: string;
  onChange: (value: string) => void;
  maxLength?: number;
}

const DEFAULT_MAX_LENGTH = 200;
const WARNING_THRESHOLD = 180;

export function ReviewInput({
  value,
  onChange,
  maxLength = DEFAULT_MAX_LENGTH,
}: ReviewInputProps) {
  const charCount = value.length;
  const isNearLimit = charCount > WARNING_THRESHOLD;

  return (
    <View style={styles.container}>
      <Text style={styles.caption}>ANYTHING ELSE · OPTIONAL</Text>
      <View style={styles.card}>
        <TextInput
          style={styles.input}
          value={value}
          onChangeText={(text) => onChange(text.slice(0, maxLength))}
          placeholder="Your review here..."
          placeholderTextColor={colors.inkSubtle}
          multiline
          numberOfLines={3}
          textAlignVertical="top"
          accessibilityLabel="Optional review, 200 characters max"
        />
        <Text style={[styles.counter, isNearLimit && styles.counterWarning]}>
          {charCount}/{maxLength}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 10,
  },
  caption: {
    ...typography.monoGreeting,
    color: colors.inkMuted,
  },
  card: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.card,
    padding: 16,
  },
  input: {
    fontFamily: 'InterTight-Regular',
    fontSize: 14,
    fontWeight: '400',
    color: colors.ink,
    minHeight: 66,
    padding: 0,
    margin: 0,
  },
  counter: {
    ...typography.monoTimestamp,
    color: colors.inkMuted,
    textAlign: 'right',
    marginTop: 8,
  },
  counterWarning: {
    color: colors.accent,
  },
});
