/**
 * TopBar Component
 * Header with greeting, name, notification bell, and avatar.
 */

import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Bell } from 'lucide-react-native';
import { colors, typography, borderRadius } from '@/constants/theme';
import { PulsingDot } from '@/components/ui/PulsingDot';
import type { Hunter } from '@/types/hunter';

interface TopBarProps {
  hunter: Hunter;
  hasNotifications?: boolean;
  onNotificationPress?: () => void;
  onProfilePress?: () => void;
}

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
}

export function TopBar({
  hunter,
  hasNotifications = true,
  onNotificationPress,
  onProfilePress,
}: TopBarProps) {
  return (
    <View style={styles.container}>
      {/* Left side: greeting + name */}
      <View style={styles.leftSide}>
        <Text style={styles.greeting}>{getGreeting()}</Text>
        <Text style={styles.name}>{hunter.firstName}.</Text>
      </View>

      {/* Right side: bell + avatar */}
      <View style={styles.rightSide}>
        {/* Notification bell */}
        <Pressable
          style={styles.iconButton}
          onPress={onNotificationPress}
          hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
          accessibilityRole="button"
          accessibilityLabel={`Notifications${hasNotifications ? ', has new notifications' : ''}`}
        >
          <Bell size={17} strokeWidth={2.2} color={colors.ink} />
          {hasNotifications && (
            <PulsingDot
              size={8}
              style={styles.notificationDot}
            />
          )}
        </Pressable>

        {/* Profile avatar */}
        <Pressable
          style={[styles.iconButton, styles.avatarButton]}
          onPress={onProfilePress}
          hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
          accessibilityRole="button"
          accessibilityLabel="Profile menu"
        >
          <Text style={styles.monogram}>{hunter.monogram}</Text>
        </Pressable>
      </View>
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
  leftSide: {},
  greeting: {
    ...typography.monoGreeting,
    color: colors.inkMuted,
    marginBottom: 4,
  },
  name: {
    ...typography.displayXl,
    color: colors.ink,
  },
  rightSide: {
    flexDirection: 'row',
    gap: 8,
  },
  iconButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarButton: {
    backgroundColor: colors.surfaceAlt,
  },
  notificationDot: {
    top: 9,
    right: 9,
  },
  monogram: {
    ...typography.avatarMono,
    color: colors.ink,
  },
});
