/**
 * DealRow Component
 * Single deal item in the deals list.
 *
 * Visual recipe (from deal-card.reference.jsx):
 * - Container: 11px/13px padding, radius 12, gap 11
 * - Avatar: 38x38, radius 10, borderStrong border
 * - Name: display 13.5/700/-0.025em, ink
 * - Caption: mono 8.5/600/0.16em uppercase, tone color
 * - Summary: body 11, inkMuted, "{summary} . {money}"
 * - Right column:
 *   - Actionable: hint mono 8/600/0.12em accent + ArrowRight 9/2.6
 *   - Passive: ArrowRight 13/2.2 inkSubtle
 * - Card fill:
 *   - Actionable: accentSoft + accentBorder
 *   - Passive: surface + border
 */

import React, { memo } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Image } from 'expo-image';
import { ArrowRight } from 'lucide-react-native';
import { colors, borderRadius } from '@/constants/theme';
import { getDealCaption, getCaptionHint, getToneColorKey } from '@/lib/dealLifecycle';
import type { Deal } from '@/types/business';

interface DealRowProps {
  deal: Deal;
  onPress?: () => void;
}

function DealRowComponent({ deal, onPress }: DealRowProps) {
  // Resolve caption using the canonical lifecycle resolver
  const caption = getDealCaption(
    {
      state: deal.state,
      hoursLeft: deal.hoursLeft,
      completedSubstate: deal.completedSubstate,
      rating: deal.rating,
      declineReason: deal.declineReason,
      // First word of the influencer name — used by the resolver to
      // render the business-side PENDING caption "WAITING ON {NAME}".
      counterpartyFirstName: deal.influencer.name.split(' ')[0],
    },
    'business'
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
      accessibilityLabel={`Deal with ${deal.influencer.name}, ${caption.text}, ${deal.total} shekels`}
    >
      {/* Influencer photo avatar */}
      <View style={styles.avatarContainer}>
        <Image
          source={{ uri: deal.influencer.photo }}
          style={styles.avatar}
          contentFit="cover"
          transition={200}
        />
      </View>

      {/* Middle column: name, caption, summary */}
      <View style={styles.content}>
        <Text style={styles.name} numberOfLines={1}>
          {deal.influencer.name}
        </Text>
        <Text style={[styles.caption, { color: toneColor }]}>
          {caption.text}
        </Text>
        <Text style={styles.summary}>
          {deal.services} · ₪{deal.total}
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

// Memoize to prevent unnecessary re-renders in lists
export const DealRow = memo(DealRowComponent);

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

  // Avatar (38x38, radius 10)
  avatarContainer: {
    width: 38,
    height: 38,
    borderRadius: 10,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.borderStrong,
  },
  avatar: {
    width: '100%',
    height: '100%',
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
