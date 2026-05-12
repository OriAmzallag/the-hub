/**
 * InfluencerTopBar Component
 * Header with greeting + name. No actions on the right slot for the
 * MVP — notifications are out of scope for now.
 *
 * Reference spec:
 * - Padding: 16/20/14 (top/horizontal/bottom)
 * - Greeting: mono 10, 0.2em, weight 500, uppercase, inkMuted
 * - Name: display 26, weight 800, -0.04em, ink, trailing period
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, typography } from '@/constants/theme';

interface InfluencerTopBarProps {
  firstName: string;
}

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
}

export function InfluencerTopBar({ firstName }: InfluencerTopBarProps) {
  return (
    <View style={styles.container}>
      <View style={styles.textContainer}>
        <Text style={styles.greeting}>{getGreeting()}</Text>
        <Text style={styles.name}>{firstName}.</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    paddingTop: 16,
    paddingHorizontal: 20,
    paddingBottom: 14,
  },
  textContainer: {
    flex: 1,
  },
  greeting: {
    ...typography.monoGreeting,
    color: colors.inkMuted,
    marginBottom: 4,
  },
  name: {
    ...typography.displayXl,
    color: colors.ink,
  },
});
