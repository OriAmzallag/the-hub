/**
 * TopBar Component
 * Header with greeting, business name, and notification bell.
 *
 * Layout: [Greeting + Name (left)] ... [Bell (right)]
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, typography } from '@/constants/theme';
import { NotificationBell } from '@/components/ui';
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
      <View style={styles.textContainer}>
        <Text style={styles.greeting}>{getGreeting()}</Text>
        <Text style={styles.name}>{business.firstName}.</Text>
      </View>
      <NotificationBell />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
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
