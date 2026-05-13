/**
 * InfluencerDealRow Component
 * Deal card showing business counterparty details.
 *
 * Visual recipe (from deal-card.reference.jsx):
 * - Container: 11px/13px padding, radius 12, gap 11
 * - Monogram tile: 38x38, radius 10, surfaceAlt bg, borderStrong border
 * - Name: display 13.5/700/-0.025em, ink
 * - Caption: mono 8.5/600/0.16em uppercase, tone color
 * - Summary: body 11, inkMuted, "{services} . {earnings}"
 * - Right column:
 *   - Actionable: hint mono 8/600/0.12em accent + ArrowRight 9/2.6
 *   - Passive: ArrowRight 13/2.2 inkSubtle
 * - Card fill:
 *   - Actionable: accentSoft + accentBorder
 *   - Passive: surface + border
 */

import React, { memo } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { ArrowRight } from 'lucide-react-native';
import { colors } from '@/constants/theme';
import { getDealCaption, getCaptionHint, getToneColorKey } from '@/lib/dealLifecycle';
import type { InfluencerDeal } from '@/types/influencerDashboard';

interface InfluencerDealRowProps {
  deal: InfluencerDeal;
  onPress?: () => void;
}

function InfluencerDealRowComponent({ deal, onPress }: InfluencerDealRowProps) {
  // Resolve caption using the canonical lifecycle resolver
  const caption = getDealCaption(
    {
      state: deal.state,
      hoursLeft: deal.hoursLeft,
      completedSubstate: deal.completedSubstate,
      rating: deal.rating,
      declineReason: deal.declineReason,
    },
    'influencer'
  );

  const hint = getCaptionHint(caption);
  const toneColor = colors[getToneColorKey(caption.tone)];

  return (
    <Pressable
      style={[
        styles.container,
        caption.actionable ? styles.containerActionable : styles.containerPassive,
      ]}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`Deal with ${deal.business.name}, ${caption.text}, ${deal.earnings} shekels`}
    >
      {/* Business monogram tile */}
      <View style={styles.monogramTile}>
        <Text style={styles.monogramText}>{deal.business.monogram}</Text>
      </View>

      {/* Middle column: name, caption, summary */}
      <View style={styles.content}>
        <Text style={styles.name} numberOfLines={1}>
          {deal.business.name}
        </Text>
        <Text style={[styles.caption, { color: toneColor }]}>
          {caption.text}
        </Text>
        <Text style={styles.summary}>
          {deal.services} · ₪{deal.earnings}
        </Text>
      </View>

      {/* Right column: hint+arrow or just arrow */}
      {caption.actionable && hint ? (
        <View style={styles.hintRow}>
          <Text style={styles.hintText}>{hint}</Text>
          <ArrowRight size={9} strokeWidth={2.6} color={colors.accent} />
        </View>
      ) : (
        <ArrowRight size={13} strokeWidth={2.2} color={colors.inkSubtle} />
      )}
    </Pressable>
  );
}

export const InfluencerDealRow = memo(InfluencerDealRowComponent);

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    paddingVertical: 11,
    paddingHorizontal: 13,
    gap: 11,
    borderWidth: 1,
  },
  containerActionable: {
    backgroundColor: colors.accentSoft,
    borderColor: colors.accentBorder,
  },
  containerPassive: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
  },

  // Monogram tile (38x38, radius 10)
  monogramTile: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: colors.surfaceAlt,
    borderWidth: 1,
    borderColor: colors.borderStrong,
    alignItems: 'center',
    justifyContent: 'center',
  },
  monogramText: {
    fontFamily: 'InterTight-ExtraBold',
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: -0.52, // -0.04em
    color: colors.ink,
  },

  // Content column
  content: {
    flex: 1,
    minWidth: 0,
  },
  name: {
    fontFamily: 'InterTight-Bold',
    fontSize: 13.5,
    fontWeight: '700',
    letterSpacing: -0.3375, // -0.025em
    color: colors.ink,
    marginBottom: 2,
  },
  caption: {
    fontFamily: 'JetBrainsMono-SemiBold',
    fontSize: 8.5,
    fontWeight: '600',
    letterSpacing: 1.36, // 0.16em
    textTransform: 'uppercase',
    marginBottom: 3,
  },
  summary: {
    fontFamily: 'InterTight-Regular',
    fontSize: 11,
    color: colors.inkMuted,
  },

  // Hint row (actionable)
  hintRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  hintText: {
    fontFamily: 'JetBrainsMono-SemiBold',
    fontSize: 8,
    fontWeight: '600',
    letterSpacing: 0.96, // 0.12em
    textTransform: 'uppercase',
    color: colors.accent,
  },
});
