/**
 * TopBar Component
 * Header with greeting and business name. No actions.
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, typography } from '@/constants/theme';
import type { Business } from '@/types/business';

interface TopBarProps {
  business: Business;
}

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
}

export function TopBar({ business }: TopBarProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.greeting}>{getGreeting()}</Text>
      <Text style={styles.name}>{business.firstName}.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 16,
    paddingHorizontal: 20,
    paddingBottom: 14,
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
