/**
 * FilterTabs Component
 * Three-tab filter for Deal History screen.
 */

import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { colors } from '@/constants/theme';
import type { HistoryTab, HistoryCounts } from '@/types/dealArchive';

interface FilterTabsProps {
  activeTab: HistoryTab;
  counts: HistoryCounts;
  onTabChange: (tab: HistoryTab) => void;
}

const TABS: { key: HistoryTab; label: string }[] = [
  { key: 'completed', label: 'Completed' },
  { key: 'declined', label: 'Declined' },
  { key: 'expired', label: 'Expired' },
];

export function FilterTabs({ activeTab, counts, onTabChange }: FilterTabsProps) {
  return (
    <View style={styles.container}>
      {TABS.map((tab) => {
        const isActive = activeTab === tab.key;
        const count = counts[tab.key];

        return (
          <Pressable
            key={tab.key}
            style={[styles.tab, isActive && styles.tabActive]}
            onPress={() => onTabChange(tab.key)}
            accessibilityRole="tab"
            accessibilityState={{ selected: isActive }}
          >
            <Text style={[styles.label, isActive && styles.labelActive]}>
              {tab.label}
            </Text>
            <Text style={[styles.count, isActive && styles.countActive]}>
              {count}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 12,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 10,
  },
  tabActive: {
    backgroundColor: colors.accentSoft,
    borderColor: colors.accentBorder,
  },
  label: {
    fontFamily: 'InterTight-Bold',
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: -0.26, // -0.02em
    lineHeight: 15,
    color: colors.ink,
    marginBottom: 4,
  },
  labelActive: {
    color: colors.accent,
  },
  count: {
    fontFamily: 'JetBrainsMono-Medium',
    fontSize: 9.5,
    fontWeight: '500',
    letterSpacing: 1.71, // 0.18em
    lineHeight: 10,
    textTransform: 'uppercase',
    color: colors.inkMuted,
  },
  countActive: {
    color: colors.accent,
  },
});
