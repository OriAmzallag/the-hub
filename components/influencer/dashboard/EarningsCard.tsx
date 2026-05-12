/**
 * EarningsCard Component
 * Hero earnings display with two states: default (has earnings) and empty.
 *
 * Reference spec:
 * - Container: padding 22/20, surface bg, 1px border, radius 18
 * - DEFAULT state:
 *   - Label: "EARNED THIS MONTH" mono 9 / 0.18em / inkMuted
 *   - Trend pill: accentSoft bg, ArrowUpRight 11, "+{%}" mono 9.5 weight 600 accent
 *   - Amount: display 42, weight 800, -0.045em
 *   - Bottom split: 1px border-top, paddingTop 12
 *   - Left: "DEALS" mono 9 / 0.18em / inkMuted, value display 16 weight 700
 *   - Divider: 1x28 border
 *   - Right: "ALL-TIME" mono, value display 16 weight 700 "₪{allTime}"
 * - EMPTY state (thisMonth === 0):
 *   - Label: "THIS MONTH" mono caption
 *   - Headline: display 26 weight 800 -0.04em "Your first deal is\naround the corner."
 *   - Body: 13 inkMuted "Browse perks or sharpen your storefront..."
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { ArrowUpRight } from 'lucide-react-native';
import { colors, typography } from '@/constants/theme';
import type { InfluencerEarnings } from '@/types/influencerDashboard';

interface EarningsCardProps {
  earnings: InfluencerEarnings;
}

export function EarningsCard({ earnings }: EarningsCardProps) {
  const isEmpty = earnings.thisMonth === 0;

  if (isEmpty) {
    return (
      <View style={styles.container}>
        <Text style={styles.labelMono}>THIS MONTH</Text>
        <Text style={styles.emptyHeadline}>
          {'Your first deal is\naround the corner.'}
        </Text>
        <Text style={styles.emptyBody}>
          Browse perks or sharpen your storefront — opportunities are coming.
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Label row */}
      <View style={styles.labelRow}>
        <Text style={styles.labelMono}>EARNED THIS MONTH</Text>
        {earnings.trend === 'up' && earnings.trendPercent > 0 && (
          <View style={styles.trendPill}>
            <ArrowUpRight
              size={11}
              strokeWidth={2.6}
              color={colors.accent}
            />
            <Text style={styles.trendText}>+{earnings.trendPercent}%</Text>
          </View>
        )}
      </View>

      {/* Big amount */}
      <Text style={styles.amount}>
        {'₪'}{earnings.thisMonth.toLocaleString()}
      </Text>

      {/* Bottom split */}
      <View style={styles.splitRow}>
        <View style={styles.splitColumn}>
          <Text style={styles.splitLabel}>DEALS</Text>
          <Text style={styles.splitValue}>{earnings.thisMonthCount}</Text>
        </View>

        <View style={styles.verticalDivider} />

        <View style={styles.splitColumn}>
          <Text style={styles.splitLabel}>ALL-TIME</Text>
          <Text style={styles.splitValue}>
            {'₪'}{earnings.allTime.toLocaleString()}
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 18,
    paddingVertical: 22,
    paddingHorizontal: 20,
  },

  // Label row
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  labelMono: {
    fontFamily: 'JetBrainsMono-SemiBold',
    fontSize: 9,
    fontWeight: '600',
    letterSpacing: 1.62, // 0.18em at 9px
    color: colors.inkMuted,
    textTransform: 'uppercase',
  },

  // Trend pill
  trendPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.accentSoft,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    gap: 2,
  },
  trendText: {
    fontFamily: 'JetBrainsMono-SemiBold',
    fontSize: 9.5,
    fontWeight: '600',
    letterSpacing: 0.76, // 0.08em at 9.5px
    color: colors.accent,
  },

  // Big amount
  amount: {
    fontFamily: 'InterTight-ExtraBold',
    fontSize: 42,
    fontWeight: '800',
    letterSpacing: -1.89, // -0.045em at 42px
    lineHeight: 42,
    color: colors.ink,
    marginBottom: 16,
  },

  // Bottom split
  splitRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: 12,
  },
  splitColumn: {
    flex: 1,
  },
  splitLabel: {
    fontFamily: 'JetBrainsMono-Medium',
    fontSize: 9,
    fontWeight: '500',
    letterSpacing: 1.62, // 0.18em at 9px
    color: colors.inkMuted,
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  splitValue: {
    fontFamily: 'InterTight-Bold',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: -0.4, // -0.025em at 16px
    color: colors.ink,
  },
  verticalDivider: {
    width: 1,
    height: 28,
    backgroundColor: colors.border,
    marginHorizontal: 16,
  },

  // Empty state
  emptyHeadline: {
    fontFamily: 'InterTight-ExtraBold',
    fontSize: 26,
    fontWeight: '800',
    letterSpacing: -1.04, // -0.04em at 26px
    lineHeight: 28.6, // 1.1
    color: colors.ink,
    marginTop: 8,
    marginBottom: 8,
  },
  emptyBody: {
    fontFamily: 'InterTight-Regular',
    fontSize: 13,
    fontWeight: '400',
    lineHeight: 19.5, // 1.5
    color: colors.inkMuted,
  },
});
