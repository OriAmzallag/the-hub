/**
 * PerkRow Component
 * A curated row of perk cards with title, subtitle, and SEE ALL button.
 */

import React from 'react';
import { View, Text, Pressable, ScrollView, StyleSheet } from 'react-native';
import { ChevronRight } from 'lucide-react-native';
import { colors, typography } from '@/constants/theme';
import type { Perk, PerkRow as PerkRowType, ViewerReach } from '@/types/perk';
import { PerkCard } from './PerkCard';

interface PerkRowProps {
  row: PerkRowType;
  perks: Perk[];
  viewerReach: ViewerReach;
}

export function PerkRow({ row, perks, viewerReach }: PerkRowProps) {
  if (perks.length === 0) {
    return null;
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.titleColumn}>
          <Text style={styles.title}>{row.title}</Text>
          {row.subtitle && (
            <Text style={styles.subtitle}>{row.subtitle.toUpperCase()}</Text>
          )}
        </View>
        <Pressable
          style={styles.seeAllButton}
          accessibilityRole="button"
          accessibilityLabel={`See all ${row.title}`}
        >
          <Text style={styles.seeAllText}>SEE ALL</Text>
          <ChevronRight size={12} strokeWidth={2.5} color={colors.inkMuted} />
        </Pressable>
      </View>

      {/* Cards scroll */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.cardsScroll}
      >
        {perks.map((perk) => (
          <PerkCard key={perk.id} perk={perk} viewerReach={viewerReach} />
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 22,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  titleColumn: {
    flex: 1,
  },
  title: {
    fontFamily: 'InterTight-Bold',
    fontSize: 20,
    fontWeight: '700',
    letterSpacing: -0.7,
    color: colors.ink,
  },
  subtitle: {
    ...typography.monoStatus,
    color: colors.accent,
    marginTop: 6,
  },
  seeAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 4,
  },
  seeAllText: {
    ...typography.monoTab,
    color: colors.inkMuted,
  },
  cardsScroll: {
    paddingHorizontal: 16,
    gap: 10,
  },
});
