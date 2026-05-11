/**
 * PerkIdentity Component
 * Category, title, and business info block.
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Star, CheckCircle2 } from 'lucide-react-native';
import { colors, radii, textScale, typography } from '@/constants/theme';
import type { PerkBusinessInfo, PerkCategory } from '@/types/perk';

interface PerkIdentityProps {
  category: PerkCategory;
  title: string;
  business: PerkBusinessInfo;
}

export function PerkIdentity({ category, title, business }: PerkIdentityProps) {
  return (
    <View style={styles.container}>
      {/* Category caption */}
      <Text style={styles.category}>{category.toUpperCase()}</Text>

      {/* Title */}
      <Text style={styles.title}>{title}</Text>

      {/* Business info tile */}
      <View style={styles.businessTile}>
        {/* Monogram */}
        <View style={styles.monogram}>
          <Text style={styles.monogramText}>{business.monogram}</Text>
        </View>

        {/* Business details */}
        <View style={styles.businessInfo}>
          {/* Name + verified */}
          <View style={styles.nameRow}>
            <Text style={styles.businessName}>{business.name}</Text>
            {business.verified && (
              <CheckCircle2
                size={14}
                strokeWidth={2.5}
                color={colors.accent}
                fill={colors.accentSoft}
              />
            )}
          </View>

          {/* Meta row: rating, deals, location */}
          <View style={styles.metaRow}>
            <Star size={10} strokeWidth={2.5} color={colors.inkMuted} fill={colors.inkMuted} />
            <Text style={styles.metaText}>{business.rating.toFixed(1)}</Text>
            <View style={styles.dot} />
            <Text style={styles.metaText}>{business.deals} deals</Text>
            <View style={styles.dot} />
            <Text style={styles.metaText}>{business.location}</Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingTop: 20,
  },
  category: {
    ...typography.monoLabel,
    color: colors.accent,
    marginBottom: 8,
  },
  title: {
    ...textScale.displayL,
    color: colors.ink,
    marginBottom: 16,
  },
  businessTile: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 14,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.card,
  },
  monogram: {
    width: 40,
    height: 40,
    borderRadius: radii.avatar,
    backgroundColor: colors.surfaceAlt,
    alignItems: 'center',
    justifyContent: 'center',
  },
  monogramText: {
    fontFamily: 'InterTight-Bold',
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: -0.28,
    color: colors.ink,
  },
  businessInfo: {
    flex: 1,
    gap: 4,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  businessName: {
    ...typography.rowTitle,
    color: colors.ink,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    fontFamily: 'JetBrainsMono-Medium',
    fontSize: 9,
    fontWeight: '500',
    letterSpacing: 0.9,
    color: colors.inkMuted,
  },
  dot: {
    width: 2,
    height: 2,
    borderRadius: 1,
    backgroundColor: colors.inkSubtle,
    marginHorizontal: 4,
  },
});
