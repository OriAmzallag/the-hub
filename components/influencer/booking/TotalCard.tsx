/**
 * TotalCard Component
 * Displays service line items, total, and budget confirmation checkbox.
 */

import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Check } from 'lucide-react-native';
import { colors } from '@/constants/theme';
import type { InfluencerService } from '@/types/influencer';
import { SectionHeader } from './SectionHeader';

interface TotalCardProps {
  services: InfluencerService[];
  budgetConfirmed: boolean;
  onBudgetConfirmChange: (checked: boolean) => void;
}

export function TotalCard({
  services,
  budgetConfirmed,
  onBudgetConfirmChange,
}: TotalCardProps) {
  const total = services.reduce((sum, s) => sum + s.price, 0);

  return (
    <View style={styles.section}>
      <SectionHeader title="Total" />

      <View style={styles.card}>
        {/* Line items */}
        <View style={styles.lineItems}>
          {services.map((service) => (
            <View key={service.id} style={styles.lineItem}>
              <Text style={styles.serviceName}>{service.name}</Text>
              <Text style={styles.servicePrice}>₪{service.price}</Text>
            </View>
          ))}
        </View>

        {/* Divider */}
        <View style={styles.divider} />

        {/* Total row */}
        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>TOTAL</Text>
          <Text style={styles.totalAmount}>₪{total}</Text>
        </View>

        {/* Budget confirmation */}
        <Pressable
          style={styles.checkboxRow}
          onPress={() => onBudgetConfirmChange(!budgetConfirmed)}
          accessibilityRole="checkbox"
          accessibilityState={{ checked: budgetConfirmed }}
          accessibilityLabel={`I confirm the total budget of ${total} shekels`}
        >
          <View style={[styles.checkbox, budgetConfirmed && styles.checkboxActive]}>
            {budgetConfirmed && (
              <Check size={14} strokeWidth={3} color={colors.bg} />
            )}
          </View>
          <Text style={styles.checkboxLabel}>
            I confirm the total budget of ₪{total}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    marginBottom: 24,
  },
  card: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 14,
    padding: 18,
  },
  lineItems: {
    gap: 10,
  },
  lineItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  serviceName: {
    fontFamily: 'InterTight-Medium',
    fontSize: 13.5,
    fontWeight: '500',
    letterSpacing: -0.27,
    color: colors.inkMuted,
  },
  servicePrice: {
    fontFamily: 'InterTight-Bold',
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: -0.28,
    color: colors.ink,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: 14,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  totalLabel: {
    fontFamily: 'JetBrainsMono-Medium',
    fontSize: 9.5,
    fontWeight: '500',
    letterSpacing: 1.425,
    textTransform: 'uppercase',
    color: colors.inkMuted,
  },
  totalAmount: {
    fontFamily: 'InterTight-ExtraBold',
    fontSize: 28,
    fontWeight: '800',
    letterSpacing: -0.84,
    color: colors.ink,
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginTop: 16,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 1.5,
    borderColor: colors.borderStrong,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxActive: {
    backgroundColor: colors.accent,
    borderWidth: 0,
  },
  checkboxLabel: {
    fontFamily: 'InterTight-Medium',
    fontSize: 13.5,
    fontWeight: '500',
    letterSpacing: -0.27,
    color: colors.inkMuted,
    flex: 1,
  },
});
