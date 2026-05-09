/**
 * DiscoverHeader Component
 * Search bar with filter icon button.
 */

import React from 'react';
import { View, TextInput, Pressable, StyleSheet } from 'react-native';
import { Search, Sliders } from 'lucide-react-native';
import { colors } from '@/constants/theme';

interface DiscoverHeaderProps {
  searchValue: string;
  onSearchChange: (value: string) => void;
  onFilterPress: () => void;
}

export function DiscoverHeader({
  searchValue,
  onSearchChange,
  onFilterPress,
}: DiscoverHeaderProps) {
  const hasText = searchValue.length > 0;

  return (
    <View style={styles.container}>
      <View style={[styles.searchBar, hasText && styles.searchBarActive]}>
        <Search
          size={16}
          strokeWidth={2.2}
          color={hasText ? colors.ink : colors.inkMuted}
        />
        <TextInput
          style={styles.input}
          value={searchValue}
          onChangeText={onSearchChange}
          placeholder="Search talent or category..."
          placeholderTextColor={colors.inkMuted}
          returnKeyType="search"
          autoCorrect={false}
          autoCapitalize="none"
        />
      </View>
      <Pressable
        style={styles.filterButton}
        onPress={onFilterPress}
        accessibilityRole="button"
        accessibilityLabel="Filters"
      >
        <Sliders size={17} strokeWidth={2.2} color={colors.ink} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 14,
    paddingHorizontal: 16,
    paddingBottom: 10,
    gap: 8,
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 100,
    paddingVertical: 10,
    paddingHorizontal: 14,
    gap: 10,
  },
  searchBarActive: {
    borderColor: colors.borderStrong,
  },
  input: {
    flex: 1,
    fontFamily: 'InterTight-Medium',
    fontSize: 14,
    color: colors.ink,
    padding: 0,
    margin: 0,
  },
  filterButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
