/**
 * BentoStats Component
 * 3-column stats grid (Reach, Rating, Reviews) + full-width Platforms tile.
 */

import React from 'react';
import { View, StyleSheet } from 'react-native';
import { StatTile } from './StatTile';
import { PlatformsTile } from './PlatformsTile';
import type { TalentPlatform } from '@/types/talent';

interface BentoStatsProps {
  reach: string;
  rating: number;
  reviewCount: number;
  platforms: TalentPlatform[];
}

export function BentoStats({ reach, rating, reviewCount, platforms }: BentoStatsProps) {
  return (
    <View style={styles.container}>
      <View style={styles.statsRow}>
        <StatTile label="Reach" value={reach} />
        <StatTile label="Rating" value={rating.toFixed(1)} showStar />
        <StatTile label="Reviews" value={reviewCount} />
      </View>
      <PlatformsTile platforms={platforms} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 22,
    paddingTop: 8,
    paddingBottom: 20,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 8,
  },
});
