/**
 * TopBar Component for Inquiries Screen
 * Title "Inquiries" + unread count badge on right.
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, typography } from '@/constants/theme';

interface TopBarProps {
  unreadCount: number;
}

export function TopBar({ unreadCount }: TopBarProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Inquiries</Text>
      {unreadCount > 0 && (
        <Text
          style={styles.unreadCaption}
          accessibilityLabel={`${unreadCount} unread messages`}
        >
          {unreadCount} unread
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
    paddingTop: 16,
    paddingHorizontal: 18,
    paddingBottom: 10,
  },
  title: {
    ...typography.sectionTitle,
    color: colors.ink,
  },
  unreadCaption: {
    ...typography.monoStatusWide,
    color: colors.accent,
  },
});
