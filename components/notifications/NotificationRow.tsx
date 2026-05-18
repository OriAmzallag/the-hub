/**
 * NotificationRow Component
 *
 * Single notification item in the notifications feed.
 * Layout inspired by InfluencerAttentionItem and ThreadRow:
 * - Avatar with type icon overlay
 * - Title and timestamp
 * - Chevron indicator
 *
 * Unread notifications use accent styling (accentSoft bg, accentBorder).
 * Read notifications use neutral styling (surface bg, border).
 */

import React, { memo } from 'react';
import { View, Text, Image, Pressable, StyleSheet } from 'react-native';
import {
  ChevronRight,
  Check,
  Clock,
  X,
  CheckCircle,
  Star,
  Eye,
  Gift,
  MessageCircle,
  type LucideIcon,
} from 'lucide-react-native';
import { colors, typography, borderRadius } from '@/constants/theme';
import type { Notification, NotificationType } from '@/types/notification';

interface NotificationRowProps {
  notification: Notification;
  onPress: () => void;
}

/**
 * Map notification type to Lucide icon component.
 */
const TYPE_ICONS: Record<NotificationType, LucideIcon> = {
  deal_accepted: Check,
  deal_expired: Clock,
  deal_declined: X,
  marked_done: CheckCircle,
  rating_received: Star,
  mutual_reveal: Eye,
  perk_claimed: Gift,
  new_message: MessageCircle,
};

function NotificationRowComponent({ notification, onPress }: NotificationRowProps) {
  const { type, title, avatar, timestampLabel, read } = notification;
  const IconComponent = TYPE_ICONS[type];

  return (
    <Pressable
      style={[styles.container, read ? styles.containerRead : styles.containerUnread]}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`${title}, ${timestampLabel}, ${read ? 'read' : 'unread'}`}
    >
      {/* Avatar with icon overlay */}
      <View style={styles.avatarWrapper}>
        {avatar.type === 'photo' ? (
          <Image source={{ uri: avatar.url }} style={styles.avatarPhoto} />
        ) : (
          <View style={styles.avatarMonogram}>
            <Text style={styles.monogramText}>{avatar.text}</Text>
          </View>
        )}
        <View style={styles.iconOverlay}>
          <IconComponent size={10} strokeWidth={2.5} color={colors.bg} />
        </View>
      </View>

      {/* Content */}
      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={2}>
          {title}
        </Text>
        <Text style={styles.timestamp}>{timestampLabel}</Text>
      </View>

      {/* Chevron */}
      <ChevronRight
        size={18}
        strokeWidth={2.2}
        color={read ? colors.inkMuted : colors.accent}
      />
    </Pressable>
  );
}

export const NotificationRow = memo(NotificationRowComponent);

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: borderRadius.xl,
    padding: 14,
    paddingHorizontal: 16,
    gap: 14,
    borderWidth: 1,
  },
  containerUnread: {
    backgroundColor: colors.accentSoft,
    borderColor: colors.accentBorder,
  },
  containerRead: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
  },

  // Avatar
  avatarWrapper: {
    position: 'relative',
  },
  avatarPhoto: {
    width: 44,
    height: 44,
    borderRadius: borderRadius.lg,
  },
  avatarMonogram: {
    width: 44,
    height: 44,
    borderRadius: borderRadius.lg,
    backgroundColor: colors.surfaceAlt,
    borderWidth: 1,
    borderColor: colors.borderStrong,
    alignItems: 'center',
    justifyContent: 'center',
  },
  monogramText: {
    ...typography.rowTitle,
    color: colors.ink,
  },
  iconOverlay: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: colors.accent,
    borderWidth: 2,
    borderColor: colors.bg,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Content
  content: {
    flex: 1,
    minWidth: 0,
  },
  title: {
    ...typography.bannerTitle,
    color: colors.ink,
    marginBottom: 3,
  },
  timestamp: {
    ...typography.monoTimestamp,
    color: colors.inkMuted,
  },
});
