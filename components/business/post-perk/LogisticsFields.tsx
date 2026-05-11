/**
 * LogisticsFields Component
 * Max claims, delivery deadline, and expiration date fields.
 */

import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { Calendar } from 'lucide-react-native';
import { colors, radii, typography } from '@/constants/theme';

interface LogisticsFieldsProps {
  maxClaims: number | null;
  deliveryDeadline: string;
  expiresOn: string;
  onMaxClaimsChange: (value: number | null) => void;
  onDeliveryDeadlineChange: (value: string) => void;
  onExpiresOnChange: (value: string) => void;
}

export function LogisticsFields({
  maxClaims,
  deliveryDeadline,
  expiresOn,
  onMaxClaimsChange,
  onDeliveryDeadlineChange,
  onExpiresOnChange,
}: LogisticsFieldsProps) {
  const handleMaxClaimsChange = (text: string) => {
    const numeric = text.replace(/[^0-9]/g, '');
    if (numeric === '') {
      onMaxClaimsChange(null);
    } else {
      onMaxClaimsChange(parseInt(numeric, 10));
    }
  };

  return (
    <View style={styles.container}>
      {/* Section header */}
      <Text style={styles.sectionHeader}>LOGISTICS</Text>

      {/* Fields */}
      <View style={styles.fields}>
        {/* Max claims */}
        <View style={styles.fieldContainer}>
          <Text style={styles.label}>MAX CLAIMS</Text>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              value={maxClaims !== null ? String(maxClaims) : ''}
              onChangeText={handleMaxClaimsChange}
              placeholder="e.g., 10"
              placeholderTextColor={colors.inkSubtle}
              keyboardType="number-pad"
            />
          </View>
        </View>

        {/* Delivery deadline */}
        <View style={styles.fieldContainer}>
          <Text style={styles.label}>DEADLINE TO DELIVER</Text>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              value={deliveryDeadline}
              onChangeText={onDeliveryDeadlineChange}
              placeholder="e.g., 7 days after claiming"
              placeholderTextColor={colors.inkSubtle}
            />
          </View>
        </View>

        {/* Expires on */}
        <View style={styles.fieldContainer}>
          <Text style={styles.label}>PERK EXPIRES ON</Text>
          <View style={styles.inputContainer}>
            <Calendar size={16} strokeWidth={2.2} color={colors.inkMuted} />
            <TextInput
              style={[styles.input, styles.inputWithIcon]}
              value={expiresOn}
              onChangeText={onExpiresOnChange}
              placeholder="e.g., Dec 31, 2026"
              placeholderTextColor={colors.inkSubtle}
            />
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 12,
  },
  sectionHeader: {
    ...typography.monoGreeting,
    color: colors.accent,
  },
  fields: {
    gap: 12,
  },
  fieldContainer: {
    gap: 8,
  },
  label: {
    fontFamily: 'JetBrainsMono-Medium',
    fontSize: 9,
    fontWeight: '500',
    letterSpacing: 0.9,
    color: colors.inkMuted,
    textTransform: 'uppercase',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.card,
    padding: 14,
  },
  input: {
    flex: 1,
    fontFamily: 'InterTight-SemiBold',
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: -0.32,
    color: colors.ink,
    padding: 0,
  },
  inputWithIcon: {
    marginLeft: 0,
  },
});
