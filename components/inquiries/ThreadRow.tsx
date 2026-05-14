/**
 * ThreadRow Component for Inquiries Screen
 * Single thread item: avatar, name/timestamp, status caption, preview, unread badge.
 */

import React, { memo } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { colors, typography, borderRadius } from '@/constants/theme';
import { getDealCaption, getToneColorKey, type ViewerRole } from '@/lib/dealLifecycle';
import { Avatar } from './Avatar';
import type { Thread } from '@/types/inquiry';

interface ThreadRowProps {
  thread: Thread;
  viewerRole: ViewerRole;
  onPress?: () => void;
}

function ThreadRowComponent({ thread, viewerRole, onPress }: ThreadRowProps) {
  // Resolve caption using the canonical lifecycle resolver (v0.8 signature)
  const caption = getDealCaption(
    {
      state: thread.state,
      hoursLeft: thread.hoursLeft,
      completedSubstate: thread.completedSubstate,
    },
    viewerRole
  );

  // Map tone to theme color
  const statusColor = colors[getToneColorKey(caption.tone)];
  const isAccentTone = caption.tone === 'accent';

  // Preview text styling
  const hasMessage = thread.lastMessage !== null;
  const hasUnread = thread.unread > 0;

  // Build accessibility label
  const accessibilityParts = [
    thread.counterparty.name,
    caption.text,
    hasMessage ? thread.lastMessage : 'No messages yet',
    hasUnread ? `${thread.unread} unread` : undefined,
  ].filter(Boolean);

  return (
    <Pressable
      style={styles.container}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={accessibilityParts.join(', ')}
    >
      {/* Avatar */}
      <Avatar counterparty={thread.counterparty} size={44} />

      {/* Content column */}
      <View style={styles.content}>
        {/* Top row: name + timestamp */}
        <View style={styles.topRow}>
          <Text style={styles.name} numberOfLines={1}>
            {thread.counterparty.name}
          </Text>
          <Text style={styles.timestamp}>{thread.timestamp}</Text>
        </View>

        {/* Status caption */}
        <Text
          style={[
            styles.statusBase,
            {
              color: statusColor,
              fontWeight: isAccentTone ? '600' : '500',
              fontFamily: isAccentTone
                ? 'JetBrainsMono-SemiBold'
                : 'JetBrainsMono-Medium',
            },
          ]}
        >
          {caption.text}
        </Text>

        {/* Preview row: message + unread badge */}
        <View style={styles.previewRow}>
          <Text
            style={[
              hasUnread ? styles.previewUnread : styles.preview,
              !hasMessage && styles.previewEmpty,
            ]}
            numberOfLines={1}
          >
            {hasMessage ? thread.lastMessage : 'No messages yet'}
          </Text>

          {hasUnread && (
            <View
              style={styles.unreadBadge}
              accessibilityLabel={`${thread.unread} unread`}
            >
              <Text style={styles.unreadText}>{thread.unread}</Text>
            </View>
          )}
        </View>
      </View>
    </Pressable>
  );
}

export const ThreadRow = memo(ThreadRowComponent);

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.lg, // 12px per reference
    paddingVertical: 12,
    paddingHorizontal: 13,
    marginHorizontal: 14,
    marginBottom: 6,
    gap: 11,
  },
  content: {
    flex: 1,
    minWidth: 0,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
  },
  name: {
    ...typography.bannerTitle,
    color: colors.ink,
    flex: 1,
    marginRight: 8,
  },
  timestamp: {
    ...typography.monoTimestamp,
    color: colors.inkMuted,
  },
  statusBase: {
    fontSize: 9.5,
    letterSpacing: 1.71, // 0.18em
    lineHeight: 9.5,
    textTransform: 'uppercase',
    marginTop: 3,
  },
  previewRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
  },
  preview: {
    ...typography.bodyPreview,
    color: colors.inkMuted,
    flex: 1,
    marginRight: 8,
  },
  previewUnread: {
    ...typography.bodyPreviewUnread,
    color: colors.inkMuted,
    flex: 1,
    marginRight: 8,
  },
  previewEmpty: {
    fontStyle: 'italic',
    color: colors.inkSubtle,
  },
  unreadBadge: {
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: colors.accent,
    paddingHorizontal: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  unreadText: {
    fontFamily: 'JetBrainsMono-Bold',
    fontSize: 10,
    fontWeight: '700',
    color: colors.bg,
  },
});
