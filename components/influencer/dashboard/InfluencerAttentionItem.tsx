/**
 * InfluencerAttentionItem Component
 * Attention card with monogram tile, state-icon overlay, and optional earnings.
 *
 * State-driven: subtitle is derived from getDealCaption().
 * Icon is derived from state: PENDING -> Inbox, COMPLETED -> Star.
 *
 * Every card in "Needs your attention" uses the accent styling
 * (accentSoft bg + accentBorder) — the section is by definition
 * actionable, so there is no first-vs-rest distinction.
 *
 * Layout:
 * - Padding: 14/16, radius 14, accentSoft bg, accentBorder border
 * - Monogram tile: 44x44, radius 12, surfaceAlt bg, borderStrong border
 * - State-icon overlay: 20x20 circle, bottom-right, accent bg, 2px bg border
 * - Title: display 14.5 weight 700 -0.025em, ink
 * - Subtitle: mono 9.5 / 0.15em, accent
 * - Earnings: display 16 weight 700, ink (optional, right side)
 * - Chevron: size 18, accent
 */

import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { ChevronRight, Inbox, Star } from 'lucide-react-native';
import { colors, typography, borderRadius } from '@/constants/theme';
import { getDealCaption, type DealState } from '@/lib/dealLifecycle';
import type { InfluencerAttentionItem as AttentionItemType } from '@/types/influencerDashboard';

interface InfluencerAttentionItemProps {
  item: AttentionItemType;
  onPress?: () => void;
}

/**
 * Get the icon component based on deal state.
 * PENDING -> Inbox (new request notification)
 * COMPLETED -> Star (rating due)
 * Default -> Inbox
 */
function getStateIcon(state: DealState) {
  switch (state) {
    case 'PENDING':
      return Inbox;
    case 'COMPLETED':
      return Star;
    default:
      return Inbox;
  }
}

export function InfluencerAttentionItem({
  item,
  onPress,
}: InfluencerAttentionItemProps) {
  // Resolve caption using the canonical lifecycle resolver
  const caption = getDealCaption(
    {
      state: item.state,
      hoursLeft: item.hoursLeft,
      completedSubstate: item.completedSubstate,
    },
    'influencer'
  );

  const StateIcon = getStateIcon(item.state);

  return (
    <Pressable
      style={styles.container}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`${item.title}, ${caption.text}${item.earnings ? `, ${item.earnings} shekels` : ''}`}
    >
      {/* Monogram tile with state-icon overlay */}
      <View style={styles.monogramWrapper}>
        <View style={styles.monogramTile}>
          <Text style={styles.monogramText}>{item.monogram}</Text>
        </View>
        <View style={styles.iconOverlay}>
          <StateIcon size={10} strokeWidth={2.5} color={colors.bg} />
        </View>
      </View>

      {/* Text content */}
      <View style={styles.content}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.subtitle}>{caption.text}</Text>
      </View>

      {/* Earnings (optional) */}
      {item.earnings !== undefined && (
        <Text style={styles.earnings}>{'₪'}{item.earnings}</Text>
      )}

      {/* Chevron */}
      <ChevronRight size={18} strokeWidth={2.2} color={colors.accent} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: borderRadius.xl,
    padding: 14,
    paddingHorizontal: 16,
    gap: 14,
    backgroundColor: colors.accentSoft,
    borderWidth: 1,
    borderColor: colors.accentBorder,
  },

  // Monogram
  monogramWrapper: {
    position: 'relative',
  },
  monogramTile: {
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
  subtitle: {
    ...typography.monoStatus,
    color: colors.accent,
  },

  // Earnings
  earnings: {
    ...typography.rowPrimary,
    color: colors.ink,
  },
});
