/**
 * MessageBubble Component
 * Text or attachment message bubble with read receipts
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { CheckCheck, ImageIcon } from 'lucide-react-native';
import { colors, typography } from '@/constants/theme';
import type { ThreadMessage } from '@/types/thread';

interface MessageBubbleProps {
  message: ThreadMessage;
}

export function MessageBubble({ message }: MessageBubbleProps) {
  const isMe = message.side === 'me';
  const hasAttachment = message.attachment !== undefined;

  // Accessibility label
  const sender = isMe ? 'You' : 'Them';
  const content = hasAttachment
    ? `Image: ${message.attachment?.label}`
    : message.text || '';
  const accessibilityLabel = `${sender}: ${content}`;

  return (
    <View
      style={[styles.container, isMe ? styles.containerMe : styles.containerThem]}
      accessibilityLabel={accessibilityLabel}
    >
      {/* Bubble */}
      <View
        style={[
          styles.bubble,
          isMe ? styles.bubbleMe : styles.bubbleThem,
          hasAttachment && styles.bubbleAttachment,
        ]}
      >
        {hasAttachment ? (
          <AttachmentContent
            attachment={message.attachment!}
            isMe={isMe}
          />
        ) : (
          <Text style={[styles.text, isMe ? styles.textMe : styles.textThem]}>
            {message.text}
          </Text>
        )}
      </View>

      {/* Timestamp row */}
      <View
        style={[
          styles.timestampRow,
          isMe ? styles.timestampRowMe : styles.timestampRowThem,
        ]}
      >
        <Text style={styles.timestamp}>{message.timestamp}</Text>
        {isMe && (
          <CheckCheck
            size={11}
            color={message.read ? colors.accent : colors.inkSubtle}
            strokeWidth={2}
            accessibilityLabel={message.read ? 'Read' : 'Sent'}
          />
        )}
      </View>
    </View>
  );
}

interface AttachmentContentProps {
  attachment: { kind: 'image'; label: string };
  isMe: boolean;
}

function AttachmentContent({ attachment, isMe }: AttachmentContentProps) {
  return (
    <View style={styles.attachmentContainer}>
      <View
        style={[
          styles.iconTile,
          isMe ? styles.iconTileMe : styles.iconTileThem,
        ]}
      >
        <ImageIcon size={16} color={colors.inkMuted} strokeWidth={2} />
      </View>
      <View style={styles.attachmentInfo}>
        <Text
          style={[
            styles.attachmentFilename,
            isMe ? styles.textMe : styles.textThem,
          ]}
          numberOfLines={1}
        >
          {attachment.label}
        </Text>
        <Text style={styles.attachmentCaption}>IMAGE</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 14,
    marginBottom: 6,
    maxWidth: '78%',
  },
  containerMe: {
    alignSelf: 'flex-end',
  },
  containerThem: {
    alignSelf: 'flex-start',
  },
  bubble: {
    paddingVertical: 12,
    paddingHorizontal: 14,
  },
  bubbleMe: {
    backgroundColor: colors.ink,
    borderRadius: 18,
    borderBottomRightRadius: 4,
  },
  bubbleThem: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 18,
    borderBottomLeftRadius: 4,
  },
  bubbleAttachment: {
    minWidth: 200,
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  text: {
    fontSize: 14.5,
    lineHeight: 14.5 * 1.4,
  },
  textMe: {
    fontFamily: 'InterTight-Medium',
    fontWeight: '500',
    color: colors.bg,
  },
  textThem: {
    fontFamily: 'InterTight-Regular',
    fontWeight: '400',
    color: colors.ink,
  },
  timestampRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 4,
  },
  timestampRowMe: {
    justifyContent: 'flex-end',
  },
  timestampRowThem: {
    justifyContent: 'flex-start',
  },
  timestamp: {
    ...typography.monoTimestamp,
    color: colors.inkSubtle,
  },
  // Attachment styles
  attachmentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  iconTile: {
    width: 36,
    height: 36,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconTileMe: {
    backgroundColor: colors.surfaceAlt,
  },
  iconTileThem: {
    backgroundColor: colors.surface,
  },
  attachmentInfo: {
    flex: 1,
  },
  attachmentFilename: {
    fontFamily: 'InterTight-SemiBold',
    fontSize: 13,
    fontWeight: '600',
    letterSpacing: -0.26, // -0.02em
  },
  attachmentCaption: {
    ...typography.monoTimestamp,
    color: colors.inkMuted,
    marginTop: 2,
  },
});
