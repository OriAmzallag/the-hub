/**
 * DealCard Component
 * "The deal" card showing services and total for Deal Summary.
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '@/constants/theme';
import type { ArchivedDeal } from '@/types/dealArchive';

interface DealCardProps {
  deal: ArchivedDeal;
}

export function DealCard({ deal }: DealCardProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.sectionHeader}>THE DEAL</Text>
      <View style={styles.card}>
        {/* Services list */}
        <View style={styles.servicesList}>
          {deal.services.map((service, index) => (
            <Text key={index} style={styles.service}>
              {service}
            </Text>
          ))}
        </View>

        {/* Total */}
        <View style={styles.totalRow}>
          <Text style={styles.total}>{'₪'}{deal.money}</Text>
          <Text style={styles.dealId}>#D-{deal.id.toUpperCase()}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
  },
  sectionHeader: {
    fontFamily: 'JetBrainsMono-Medium',
    fontSize: 10,
    fontWeight: '500',
    letterSpacing: 2.2, // 0.22em
    lineHeight: 10,
    textTransform: 'uppercase',
    color: colors.inkMuted,
    marginBottom: 12,
  },
  card: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 14,
    padding: 16,
  },
  servicesList: {
    gap: 6,
  },
  service: {
    fontFamily: 'InterTight-SemiBold',
    fontSize: 14,
    fontWeight: '600',
    letterSpacing: -0.28, // -0.02em
    lineHeight: 17,
    color: colors.ink,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  total: {
    fontFamily: 'InterTight-ExtraBold',
    fontSize: 17,
    fontWeight: '800',
    letterSpacing: -0.595, // -0.035em
    lineHeight: 17,
    color: colors.ink,
  },
  dealId: {
    fontFamily: 'JetBrainsMono-Medium',
    fontSize: 9,
    fontWeight: '500',
    letterSpacing: 1.08, // 0.12em
    lineHeight: 9,
    textTransform: 'uppercase',
    color: colors.inkSubtle,
  },
});
