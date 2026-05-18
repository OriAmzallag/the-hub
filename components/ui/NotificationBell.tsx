/**
 * NotificationBell Component
 *
 * 38x38 circular button with Bell icon and optional unread badge.
 * Placed in header right-slot across all 8 tab-level screens.
 *
 * Design notes:
 * - Matches filter button chrome from DiscoverHeader (38px, surface bg)
 * - Badge appears when unread > 0, capped at "9+"
 * - Uses accent styling when there are unread notifications
 */

import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Bell } from 'lucide-react-native';
import { colors } from '@/constants/theme';
import { useUnreadCount } from '@/lib/notifications';

interface NotificationBellProps {
  /**
   * Optional callback when bell is pressed (defaults to navigation).
   * Useful for testing or custom behavior.
   */
  onPress?: () => void;
}

export function NotificationBell({ onPress }: NotificationBellProps) {
  const router = useRouter();
  const unreadCount = useUnreadCount();
  const hasUnread = unreadCount > 0;

  const handlePress = () => {
    if (onPress) {
      onPress();
    } else {
      router.push('/notifications');
    }
  };

  // Format badge text (cap at 9+)
  const badgeText = unreadCount > 9 ? '9+' : String(unreadCount);

  return (
    <Pressable
      style={[styles.button, hasUnread && styles.buttonActive]}
      onPress={handlePress}
      accessibilityRole="button"
      accessibilityLabel={
        hasUnread
          ? `Notifications, ${unreadCount} unread`
          : 'Notifications'
      }
      hitSlop={4}
    >
      <Bell
        size={17}
        strokeWidth={2.2}
        color={hasUnread ? colors.accent : colors.ink}
      />
      {hasUnread && (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{badgeText}</Text>
        </View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonActive: {
    backgroundColor: colors.accentSoft,
    borderColor: colors.accentBorder,
  },
  badge: {
    position: 'absolute',
    top: -3,
    right: -3,
    minWidth: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: colors.accent,
    borderWidth: 2,
    borderColor: colors.bg,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 3,
  },
  badgeText: {
    fontFamily: 'JetBrainsMono-Bold',
    fontSize: 8,
    fontWeight: '700',
    color: colors.bg,
  },
});
