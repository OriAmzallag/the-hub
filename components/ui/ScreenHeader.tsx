/**
 * ScreenHeader Component
 *
 * Shared top-bar for tab + sub-page screens that need a title (and
 * optionally a right-aligned mono accent caption). Used by:
 *   - Inquiries:  <ScreenHeader title="Inquiries" rightCaption={`${n} unread`} />
 *   - Profile:    <ScreenHeader title="Profile" />
 *   - …future Settings, History, etc.
 *
 * Handles safe-area top padding internally so callers don't need to.
 * Renders as a SIBLING above a ScrollView (not inside) so it stays
 * pinned while body scrolls.
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, typography } from '@/constants/theme';

interface ScreenHeaderProps {
  title: string;
  /**
   * Optional right-aligned mono accent caption. Pass undefined to render
   * the title alone (left-aligned, no right slot).
   */
  rightCaption?: string;
  /**
   * Accessibility label for the rightCaption (e.g. "3 unread messages").
   * Defaults to the rightCaption text.
   */
  rightCaptionAccessibilityLabel?: string;
}

export function ScreenHeader({
  title,
  rightCaption,
  rightCaptionAccessibilityLabel,
}: ScreenHeaderProps) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: insets.top + 16 }]}>
      <Text style={styles.title}>{title}</Text>
      {rightCaption !== undefined && rightCaption.length > 0 && (
        <Text
          style={styles.rightCaption}
          accessibilityLabel={
            rightCaptionAccessibilityLabel ?? rightCaption
          }
        >
          {rightCaption}
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
    paddingHorizontal: 20,
    paddingBottom: 14,
  },
  title: {
    ...typography.sectionTitle,
    color: colors.ink,
  },
  rightCaption: {
    ...typography.monoStatusWide,
    color: colors.accent,
  },
});
