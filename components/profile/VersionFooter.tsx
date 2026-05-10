/**
 * VersionFooter Component
 * App version footer in mono style.
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, typography } from '@/constants/theme';

const APP_VERSION = '0.6';

export function VersionFooter() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>THE HUB . v{APP_VERSION}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginTop: 24,
    marginBottom: 32,
  },
  text: {
    ...typography.monoTimestamp,
    color: colors.inkSubtle,
  },
});
