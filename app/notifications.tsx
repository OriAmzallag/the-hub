/**
 * Notifications Screen
 *
 * Full-screen feed of notifications, newest first. Accessible via the
 * bell icon in all 8 tab-level headers; back button (chevron) returns
 * to the originating screen.
 *
 * Features:
 * - Back button (ScreenHeader onBack)
 * - All / Unread / Read filter tabs (visual mirror of deal-archive
 *   FilterTabs — local because the tab keys are notification-specific)
 * - Mark all read button (only when unread > 0)
 * - Tap to navigate + mark as read
 * - Empty state per filter
 */

import React, { useCallback, useMemo, useState } from 'react';
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

type NotifFilter = 'all' | 'unread' | 'read';

const FILTER_TABS: { key: NotifFilter; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'unread', label: 'Unread' },
  { key: 'read', label: 'Read' },
];

export default function NotificationsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const notifications = useNotifications();
  const unreadCount = useUnreadCount();

  const [filter, setFilter] = useState<NotifFilter>('all');

  const hasUnread = unreadCount > 0;

  // Per-tab counts. `all` mirrors the total list length so the count
  // always reflects what the user is about to see.
  const counts = useMemo(
    () => ({
      all: notifications.length,
      unread: unreadCount,
      read: notifications.length - unreadCount,
    }),
    [notifications.length, unreadCount]
  );

  // Filtered list, evaluated per active tab.
  const visible = useMemo(() => {
    if (filter === 'unread') return notifications.filter((n) => !n.read);
    if (filter === 'read') return notifications.filter((n) => n.read);
    return notifications;
  }, [notifications, filter]);

  const isEmpty = visible.length === 0;

  /** Back navigation — fall back to the tab root if no history. */
  const handleBack = useCallback(() => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/');
    }
  }, [router]);

  /** Tap a row → mark as read + navigate to the relevant destination. */
  const handleNotificationPress = useCallback(
    (notification: Notification) => {
      markAsRead(notification.id);

      const { route } = notification;
      switch (route.type) {
        case 'thread':
          router.push(
            `/inquiries/${route.threadId}?viewerRole=${route.viewerRole}`
          );
          break;
        case 'rate':
        case 'reveal':
          router.push(`/rate/${route.dealId}?viewerRole=${route.viewerRole}`);
          break;
        case 'perk':
          console.log('TODO: Navigate to perk detail', route.perkId);
          break;
      }
    },
    [router]
  );

  const handleMarkAllRead = useCallback(() => {
    markAllAsRead();
  }, []);

  const renderItem = useCallback(
    ({ item }: { item: Notification }) => (
      <NotificationRow
        notification={item}
        onPress={() => handleNotificationPress(item)}
      />
    ),
    [handleNotificationPress]
  );

  const keyExtractor = useCallback((item: Notification) => item.id, []);

  /** Empty state — copy adapts to the active tab. */
  const renderEmptyState = () => {
    const text =
      filter === 'unread'
        ? "You're all caught up"
        : filter === 'read'
        ? 'Nothing read yet'
        : 'No notifications yet';
    return (
      <View style={styles.emptyContainer}>
        <Bell size={48} strokeWidth={1.5} color={colors.inkMuted} />
        <Text style={styles.emptyText}>{text}</Text>
      </View>
    );
  };

  const ItemSeparator = () => <View style={styles.separator} />;

  return (
    <View style={styles.container}>
      <ScreenHeader title="Notifications" onBack={handleBack} />

      {/* Sub-toolbar: filter tabs (left) + mark-all-read action (right).
          Tabs visual mirrors components/deal-archive/FilterTabs but
          stays local because notification tab keys are unique. */}
      <View style={styles.toolbar}>
        <View style={styles.tabRow}>
          {FILTER_TABS.map((tab) => {
            const isActive = filter === tab.key;
            return (
              <Pressable
                key={tab.key}
                style={[styles.tab, isActive && styles.tabActive]}
                onPress={() => setFilter(tab.key)}
                accessibilityRole="tab"
                accessibilityState={{ selected: isActive }}
              >
                <Text style={[styles.tabLabel, isActive && styles.tabLabelActive]}>
                  {tab.label}
                </Text>
                <Text style={[styles.tabCount, isActive && styles.tabCountActive]}>
                  {counts[tab.key]}
                </Text>
              </Pressable>
            );
          })}
        </View>
        {hasUnread && (
          <Pressable
            onPress={handleMarkAllRead}
            accessibilityRole="button"
            accessibilityLabel="Mark all notifications as read"
            hitSlop={8}
            style={styles.markAllReadButton}
          >
            <Text style={styles.markAllReadText}>MARK ALL READ</Text>
          </Pressable>
        )}
      </View>

      {isEmpty ? (
        renderEmptyState()
      ) : (
        <FlatList
          data={visible}
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
  toolbar: {
    paddingHorizontal: 14,
    paddingTop: 4,
    paddingBottom: 12,
    gap: 10,
  },
  tabRow: {
    flexDirection: 'row',
    gap: 8,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 10,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 10,
  },
  tabActive: {
    backgroundColor: colors.accentSoft,
    borderColor: colors.accentBorder,
  },
  tabLabel: {
    fontFamily: 'InterTight-Bold',
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: -0.26,
    lineHeight: 15,
    color: colors.ink,
    marginBottom: 4,
  },
  tabLabelActive: {
    color: colors.accent,
  },
  tabCount: {
    fontFamily: 'JetBrainsMono-Medium',
    fontSize: 9.5,
    fontWeight: '500',
    letterSpacing: 1.71,
    lineHeight: 10,
    textTransform: 'uppercase',
    color: colors.inkMuted,
  },
  tabCountActive: {
    color: colors.accent,
  },
  markAllReadButton: {
    alignSelf: 'flex-end',
  },
  markAllReadText: {
    ...typography.monoStatusWide,
    color: colors.accent,
  },
  listContent: {
    paddingHorizontal: 14,
    paddingTop: 4,
  },
  separator: {
    height: 6,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
    paddingBottom: 100,
  },
  emptyText: {
    ...typography.bodyPreview,
    color: colors.inkMuted,
  },
});
