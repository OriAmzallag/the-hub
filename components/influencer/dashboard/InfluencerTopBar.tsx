/**
 * InfluencerTopBar Component
 * Header with greeting, name, and notification bell.
 *
 * Reference spec:
 * - Padding: 16/20/14 (top/horizontal/bottom)
 * - Greeting: mono 10, 0.2em, weight 500, uppercase, inkMuted
 * - Name: display 26, weight 800, -0.04em, ink, trailing period
 * - Bell: 38x38, surface bg, 1px border, radius 10
 * - Notification dot: 8x8, accent, 2px bg border, positioned top-right
 */

import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Bell } from 'lucide-react-native';
import { colors, typography, shadows } from '@/constants/theme';

interface InfluencerTopBarProps {
  firstName: string;
  hasNotifications?: boolean;
  onBellPress?: () => void;
}

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
}

export function InfluencerTopBar({
  firstName,
  hasNotifications = true,
  onBellPress,
}: InfluencerTopBarProps) {
  return (
    <View style={styles.container}>
      <View style={styles.textContainer}>
        <Text style={styles.greeting}>{getGreeting()}</Text>
        <Text style={styles.name}>{firstName}.</Text>
      </View>

      <Pressable
        style={styles.bellButton}
        onPress={onBellPress}
        accessibilityRole="button"
        accessibilityLabel="Notifications"
      >
        <Bell size={20} strokeWidth={1.8} color={colors.ink} />
        {hasNotifications && <View style={styles.notificationDot} />}
      </Pressable>
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
  bellButton: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  notificationDot: {
    position: 'absolute',
    top: -2,
    right: -2,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.accent,
    borderWidth: 2,
    borderColor: colors.bg,
    ...shadows.notificationDot,
  },
});
