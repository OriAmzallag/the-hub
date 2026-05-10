/**
 * SearchBar Component for Inquiries Screen
 * Pill-shaped input with magnifier icon.
 * Border tint shifts to borderStrong when input has content.
 */

import React from 'react';
import { View, TextInput, StyleSheet } from 'react-native';
import { Search } from 'lucide-react-native';
import { colors, radii } from '@/constants/theme';

interface SearchBarProps {
  value: string;
  onChangeText: (value: string) => void;
}

export function SearchBar({ value, onChangeText }: SearchBarProps) {
  const hasContent = value.length > 0;

  return (
    <View style={styles.container}>
      <View
        style={[
          styles.pill,
          { borderColor: hasContent ? colors.borderStrong : colors.border },
        ]}
      >
        <Search
          size={14}
          strokeWidth={2}
          color={colors.inkMuted}
        />
        <TextInput
          style={styles.input}
          value={value}
          onChangeText={onChangeText}
          placeholder="Search by name..."
          placeholderTextColor={colors.inkMuted}
          autoCapitalize="none"
          autoCorrect={false}
          returnKeyType="search"
          accessibilityLabel="Search threads by name"
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 14,
    paddingBottom: 12,
  },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: radii.pill,
    borderWidth: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    gap: 9,
  },
  input: {
    flex: 1,
    fontFamily: 'InterTight-Regular',
    fontSize: 13,
    color: colors.ink,
    padding: 0,
  },
});
