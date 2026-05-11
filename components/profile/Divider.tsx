/**
 * Divider Component
 * 1px vertical divider for MiniStatsRow.
 */

import React from 'react';
import { View, StyleSheet } from 'react-native';
import { colors } from '@/constants/theme';

export function Divider() {
  return <View style={styles.divider} />;
}

const styles = StyleSheet.create({
  divider: {
    width: 1,
    height: '100%',
    backgroundColor: colors.border,
  },
});
