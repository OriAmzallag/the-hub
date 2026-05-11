/**
 * MiniStatsRow Component
 * 3-up stats row with borders and dividers.
 */

import React from 'react';
import { View, StyleSheet } from 'react-native';
import { colors } from '@/constants/theme';
import { MiniStat } from './MiniStat';
import { Divider } from './Divider';
import type { MiniStatItem } from '@/types/profile';

interface MiniStatsRowProps {
  stats: [MiniStatItem, MiniStatItem, MiniStatItem];
}

export function MiniStatsRow({ stats }: MiniStatsRowProps) {
  return (
    <View style={styles.container}>
      <MiniStat {...stats[0]} />
      <Divider />
      <MiniStat {...stats[1]} />
      <Divider />
      <MiniStat {...stats[2]} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 24,
    maxWidth: 280,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: colors.border,
    paddingVertical: 16,
    alignSelf: 'center',
  },
});
