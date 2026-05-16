/**
 * InfluencerDealRow Component
 * Deal card showing business counterparty details.
 *
 * For IN_PROGRESS deals, includes an inline "Mark deal as done" strip at the bottom.
 * The card body and strip are separate tap targets:
 * - Card body -> onPress (routes to thread)
 * - Strip -> onMarkDone (opens modal directly)
 *
 * Visual recipe (from deal-card.reference.jsx + mark-done.reference.jsx):
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
 * - Mark Done strip (IN_PROGRESS only):
 *   - accentSoft bg, borderTop accentBorder
 *   - Check 14/2.8 accent + "Mark deal as done" display 13/700 + chevron 13/2.6
 */

import React, { memo } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { ArrowRight, Check } from 'lucide-react-native';
import { colors } from '@/constants/theme';
import { getDealCaption, getCaptionHint, getToneColorKey } from '@/lib/dealLifecycle';
import type { InfluencerDeal } from '@/types/influencerDashboard';

interface InfluencerDealRowProps {
  deal: InfluencerDeal;
  onPress?: () => void;
  /** Called when Mark Done strip is tapped (IN_PROGRESS deals only) */
  onMarkDone?: () => void;
}

function InfluencerDealRowComponent({
  deal,
  onPress,
  onMarkDone,
}: InfluencerDealRowProps) {
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
  const isInProgress = deal.state === 'IN_PROGRESS';

  // IN_PROGRESS deals get the card + strip layout
  if (isInProgress) {
    return (
      <View style={styles.cardWrapper}>
        {/* Card body - taps to thread */}
        <Pressable
          style={styles.containerPassive}
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

          {/* Right column: arrow */}
          <ArrowRight size={13} strokeWidth={2.2} color={colors.inkSubtle} />
        </Pressable>

        {/* Mark Done strip - separate tap target */}
        <Pressable
          onPress={onMarkDone}
          accessibilityRole="button"
          accessibilityLabel="Mark deal as done"
        >
          {({ pressed }) => (
            <View style={[styles.markDoneStrip, pressed && styles.markDoneStripPressed]}>
              <View style={styles.markDoneLeft}>
                <View style={styles.markDoneIcon}>
                  <Check size={14} strokeWidth={2.8} color={colors.accent} />
                </View>
                <Text style={styles.markDoneLabel}>Mark deal as done</Text>
              </View>
              <ArrowRight size={13} strokeWidth={2.6} color={colors.accent} />
            </View>
          )}
        </Pressable>
      </View>
    );
  }

  // Standard card layout for other states
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
  // Wrapper for IN_PROGRESS cards with strip
  cardWrapper: {
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },

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
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 11,
    paddingHorizontal: 13,
    gap: 11,
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

  // Mark Done strip (IN_PROGRESS only)
  markDoneStrip: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    paddingHorizontal: 16,
    backgroundColor: colors.accentSoft,
    borderTopWidth: 1,
    borderTopColor: colors.accentBorder,
  },
  markDoneStripPressed: {
    backgroundColor: 'rgba(255,122,41,0.18)',
  },
  markDoneLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  markDoneIcon: {
    marginRight: 8,
  },
  markDoneLabel: {
    fontFamily: 'InterTight-Bold',
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: -0.26, // -0.02em
    color: colors.accent,
  },
});
