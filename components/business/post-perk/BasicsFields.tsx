/**
 * BasicsFields Component
 * Title and description text fields with character counters.
 */

import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { colors, radii, typography } from '@/constants/theme';

interface BasicsFieldsProps {
  title: string;
  description: string;
  onTitleChange: (value: string) => void;
  onDescriptionChange: (value: string) => void;
}

const MAX_TITLE = 60;
const MAX_DESCRIPTION = 300;

export function BasicsFields({
  title,
  description,
  onTitleChange,
  onDescriptionChange,
}: BasicsFieldsProps) {
  return (
    <View style={styles.container}>
      {/* Section header */}
      <Text style={styles.sectionHeader}>BASICS</Text>

      {/* Title field */}
      <View style={styles.fieldContainer}>
        <View style={styles.labelRow}>
          <Text style={styles.label}>TITLE</Text>
          <Text style={[styles.counter, title.length > MAX_TITLE * 0.9 && styles.counterAccent]}>
            {title.length}/{MAX_TITLE}
          </Text>
        </View>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            value={title}
            onChangeText={(text) => onTitleChange(text.slice(0, MAX_TITLE))}
            placeholder="e.g., Free brunch for two"
            placeholderTextColor={colors.inkSubtle}
            maxLength={MAX_TITLE}
          />
        </View>
      </View>

      {/* Description field */}
      <View style={styles.fieldContainer}>
        <View style={styles.labelRow}>
          <Text style={styles.label}>DESCRIPTION</Text>
          <Text style={[styles.counter, description.length > MAX_DESCRIPTION * 0.9 && styles.counterAccent]}>
            {description.length}/{MAX_DESCRIPTION}
          </Text>
        </View>
        <View style={[styles.inputContainer, styles.multilineContainer]}>
          <TextInput
            style={[styles.input, styles.multilineInput]}
            value={description}
            onChangeText={(text) =>
              onDescriptionChange(text.slice(0, MAX_DESCRIPTION))
            }
            placeholder="Describe what you're offering..."
            placeholderTextColor={colors.inkSubtle}
            maxLength={MAX_DESCRIPTION}
            multiline
            textAlignVertical="top"
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 16,
  },
  sectionHeader: {
    ...typography.monoGreeting,
    color: colors.accent,
    marginBottom: 4,
  },
  fieldContainer: {
    gap: 8,
  },
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  label: {
    ...typography.monoTimestamp,
    color: colors.inkMuted,
  },
  counter: {
    ...typography.monoTimestamp,
    color: colors.inkMuted,
  },
  counterAccent: {
    color: colors.accent,
  },
  inputContainer: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.card,
    padding: 14,
  },
  multilineContainer: {
    minHeight: 100,
  },
  input: {
    fontFamily: 'InterTight-SemiBold',
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: -0.32,
    color: colors.ink,
    padding: 0,
  },
  multilineInput: {
    minHeight: 72,
  },
});
