/**
 * ScreenHeader Component
 *
 * Canonical top-bar for every screen that needs a header.
 *
 * Two layouts driven by props:
 *
 * - **Tab-level header** (no back button) — title is LEFT-aligned with
 *   an optional rightCaption on the far right (mono accent). Used by
 *   Inquiries + Profile.
 *     <ScreenHeader title="Inquiries" rightCaption="3 unread" />
 *
 * - **Sub-page header** (back button via `onBack`) — back button on
 *   the left, title (or mono eyebrow) CENTERED, a placeholder on the
 *   right for symmetry. Used by Deal History + Deal Summary.
 *     <ScreenHeader title="Deal history" onBack={...} />
 *     <ScreenHeader eyebrow="DEAL SUMMARY · ARCHIVED" onBack={...} />
 *
 * Handles safe-area top padding internally so callers don't need to.
 * Renders as a SIBLING above a ScrollView (not inside) so it stays
 * pinned while body scrolls.
 */

import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ChevronLeft } from 'lucide-react-native';
import { colors, typography } from '@/constants/theme';

interface ScreenHeaderProps {
  /** Display title (sectionTitle: 22/700). Mutually exclusive with `eyebrow`. */
  title?: string;
  /** Mono accent caption used in place of `title` for archive-style screens. */
  eyebrow?: string;
  /** Right-aligned mono accent caption. Only valid in tab-level mode (no onBack). */
  rightCaption?: string;
  /** Accessibility label for the rightCaption. */
  rightCaptionAccessibilityLabel?: string;
  /**
   * Custom right-slot node (e.g. a filter button). Takes precedence
   * over `rightCaption` when provided. Only valid in tab-level mode
   * (no onBack).
   */
  rightSlot?: React.ReactNode;
  /** When provided, renders a back button on the left and centers the title/eyebrow. */
  onBack?: () => void;
}

export function ScreenHeader({
  title,
  eyebrow,
  rightCaption,
  rightCaptionAccessibilityLabel,
  rightSlot,
  onBack,
}: ScreenHeaderProps) {
  const insets = useSafeAreaInsets();
  const hasBack = onBack !== undefined;

  return (
    <View
      style={[
        styles.container,
        hasBack && styles.containerCentered,
        { paddingTop: insets.top + 16 },
      ]}
    >
      {hasBack && (
        <Pressable
          style={styles.backButton}
          onPress={onBack}
          accessibilityRole="button"
          accessibilityLabel="Go back"
          hitSlop={8}
        >
          <ChevronLeft size={20} strokeWidth={2.5} color={colors.ink} />
        </Pressable>
      )}

      {eyebrow !== undefined ? (
        <Text
          style={[styles.eyebrow, hasBack && styles.centerText]}
          numberOfLines={1}
        >
          {eyebrow}
        </Text>
      ) : (
        <Text
          style={[styles.title, hasBack && styles.centerText]}
          numberOfLines={1}
        >
          {title}
        </Text>
      )}

      {hasBack ? (
        // Symmetric placeholder so the centered text stays optically
        // centered between the back button and the right edge.
        <View style={styles.backButtonPlaceholder} />
      ) : rightSlot !== undefined ? (
        rightSlot
      ) : rightCaption !== undefined && rightCaption.length > 0 ? (
        <Text
          style={styles.rightCaption}
          accessibilityLabel={rightCaptionAccessibilityLabel ?? rightCaption}
        >
          {rightCaption}
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 14,
  },
  containerCentered: {
    // When the back button + placeholder bracket the text, alignItems
    // stays 'center' (vertical), and the text flex:1 + textAlign:center
    // handles horizontal centering. The justifyContent stays space-between
    // so the three slots distribute correctly.
  },
  backButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backButtonPlaceholder: {
    width: 36,
    height: 36,
  },
  title: {
    ...typography.sectionTitle,
    color: colors.ink,
  },
  eyebrow: {
    fontFamily: 'JetBrainsMono-Medium',
    fontSize: 10,
    fontWeight: '500',
    letterSpacing: 2.2, // 0.22em
    lineHeight: 14,
    textTransform: 'uppercase',
    color: colors.inkMuted,
  },
  centerText: {
    flex: 1,
    textAlign: 'center',
  },
  rightCaption: {
    ...typography.monoStatusWide,
    color: colors.accent,
  },
});
