/**
 * ProfileTopBar Component
 * Simple title bar for profile screens.
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, typography } from '@/constants/theme';

export function ProfileTopBar() {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: insets.top + 8 }]}>
      <Text style={styles.title}>Profile</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    ...typography.sectionTitle,
    color: colors.ink,
  },
});
