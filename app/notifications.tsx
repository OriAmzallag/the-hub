/**
 * Notifications Screen
 *
 * Full-screen feed of notifications, newest first.
 * Accessible via bell icon in all 8 tab-level headers.
 *
 * Features:
 * - FlatList for efficient rendering
 * - Mark all read button (appears when unread > 0)
 * - Empty state when no notifications
 * - Tap to navigate + mark as read
 */

import React, { useCallback } from 'react';
import { View, Text, FlatList, Pressable, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Bell } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, typography } from '@/constants/theme';
import { ScreenHeader } from '@/components/ui';
import { NotificationRow } from '@/components/notifications';
import {
  useNotifications,
  useUnreadCount,
  markAsRead,
  markAllAsRead,
} from '@/lib/notifications';
import type { Notification } from '@/types/notification';

export default function NotificationsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const notifications = useNotifications();
  const unreadCount = useUnreadCount();

  const hasUnread = unreadCount > 0;
  const isEmpty = notifications.length === 0;

  /**
   * Handle notification tap: mark as read and navigate to destination.
   */
  const handleNotificationPress = useCallback(
    (notification: Notification) => {
      // Mark as read
      markAsRead(notification.id);

      // Navigate based on route type
      const { route } = notification;
      switch (route.type) {
        case 'thread':
          router.push(`/inquiries/${route.threadId}?viewerRole=${route.viewerRole}`);
          break;
        case 'rate':
          router.push(`/rate/${route.dealId}?viewerRole=${route.viewerRole}`);
          break;
        case 'reveal':
          // For now, route to rate flow which handles reveal
          router.push(`/rate/${route.dealId}?viewerRole=${route.viewerRole}`);
          break;
        case 'perk':
          // Placeholder for v1 - perk detail screen doesn't exist yet
          console.log('TODO: Navigate to perk detail', route.perkId);
          break;
      }
    },
    [router]
  );

  /**
   * Handle mark all as read
   */
  const handleMarkAllRead = useCallback(() => {
    markAllAsRead();
  }, []);

  /**
   * Render the mark all read button in header right slot
   */
  const renderMarkAllReadButton = () => {
    if (!hasUnread) return null;

    return (
      <Pressable
        onPress={handleMarkAllRead}
        accessibilityRole="button"
        accessibilityLabel="Mark all notifications as read"
        hitSlop={8}
      >
        <Text style={styles.markAllReadText}>MARK ALL READ</Text>
      </Pressable>
    );
  };

  /**
   * Render a single notification row
   */
  const renderItem = useCallback(
    ({ item }: { item: Notification }) => (
      <NotificationRow
        notification={item}
        onPress={() => handleNotificationPress(item)}
      />
    ),
    [handleNotificationPress]
  );

  /**
   * Key extractor for FlatList
   */
  const keyExtractor = useCallback((item: Notification) => item.id, []);

  /**
   * Render empty state
   */
  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Bell size={48} strokeWidth={1.5} color={colors.inkMuted} />
      <Text style={styles.emptyText}>You're all caught up</Text>
    </View>
  );

  /**
   * Item separator component
   */
  const ItemSeparator = () => <View style={styles.separator} />;

  return (
    <View style={styles.container}>
      <ScreenHeader title="Notifications" rightSlot={renderMarkAllReadButton()} />

      {isEmpty ? (
        renderEmptyState()
      ) : (
        <FlatList
          data={notifications}
          renderItem={renderItem}
          keyExtractor={keyExtractor}
          ItemSeparatorComponent={ItemSeparator}
          contentContainerStyle={[
            styles.listContent,
            { paddingBottom: insets.bottom + 100 },
          ]}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  markAllReadText: {
    ...typography.monoStatusWide,
    color: colors.accent,
  },
  listContent: {
    paddingHorizontal: 14,
    paddingTop: 8,
  },
  separator: {
    height: 6,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
    paddingBottom: 100, // Offset for visual center
  },
  emptyText: {
    ...typography.bodyPreview,
    color: colors.inkMuted,
  },
});
