/**
 * RequestForm Component
 * The form content for the booking request sheet.
 * Contains header, scrollable body with all sections, and sticky submit.
 */

import React from 'react';
import { View, Text, Pressable, ScrollView, StyleSheet } from 'react-native';
import { X, ArrowRight } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, shadows } from '@/constants/theme';
import type { InfluencerService } from '@/types/influencer';
import type { DateChipId } from '@/types/booking';
import { ServicesList } from './ServicesList';
import { WhenChips } from './WhenChips';
import { BriefField } from './BriefField';
import { TotalCard } from './TotalCard';

interface RequestFormProps {
  influencerName: string;
  influencerFirstName: string;
  onClose: () => void;
  // Services
  selectedServices: InfluencerService[];
  onRemoveService: (id: number) => void;
  // Date selection
  pickedDateChip: DateChipId | null;
  onPickDateChip: (id: DateChipId) => void;
  // Brief
  brief: string;
  onBriefChange: (text: string) => void;
  // Budget confirmation
  budgetConfirmed: boolean;
  onBudgetConfirmChange: (checked: boolean) => void;
  // Submit
  onSubmit: () => void;
}

export function RequestForm({
  influencerName,
  influencerFirstName,
  onClose,
  selectedServices,
  onRemoveService,
  pickedDateChip,
  onPickDateChip,
  brief,
  onBriefChange,
  budgetConfirmed,
  onBudgetConfirmChange,
  onSubmit,
}: RequestFormProps) {
  const insets = useSafeAreaInsets();

  // Validation - all conditions must be true for submit to be enabled
  const isValid =
    selectedServices.length > 0 &&
    pickedDateChip !== null &&
    brief.trim().length > 0 &&
    budgetConfirmed;

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.superTitle}>BOOKING · {influencerName.toUpperCase()}</Text>
          <Text style={styles.title}>Request</Text>
        </View>
        <Pressable
          style={styles.closeButton}
          onPress={onClose}
          accessibilityRole="button"
          accessibilityLabel="Close booking request"
        >
          <X size={18} strokeWidth={2.2} color={colors.ink} />
        </Pressable>
      </View>

      {/* Scrollable body */}
      <ScrollView
        style={styles.body}
        contentContainerStyle={[
          styles.bodyContent,
          { paddingBottom: 100 + insets.bottom },
        ]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <ServicesList services={selectedServices} onRemove={onRemoveService} />
        <WhenChips selected={pickedDateChip} onSelect={onPickDateChip} />
        <BriefField value={brief} onChangeText={onBriefChange} />
        <TotalCard
          services={selectedServices}
          budgetConfirmed={budgetConfirmed}
          onBudgetConfirmChange={onBudgetConfirmChange}
        />

        {/* Footer note */}
        <Text style={styles.footerNote}>
          {influencerFirstName.toUpperCase()} RESPONDS WITHIN 72H
        </Text>
      </ScrollView>

      {/* Sticky submit button */}
      <View style={[styles.submitContainer, { paddingBottom: insets.bottom + 22 }]}>
        <Pressable
          style={[
            styles.submitButton,
            isValid ? styles.submitButtonActive : styles.submitButtonDisabled,
          ]}
          onPress={isValid ? onSubmit : undefined}
          disabled={!isValid}
          accessibilityRole="button"
          accessibilityLabel="Send request"
          accessibilityState={{ disabled: !isValid }}
        >
          <Text
            style={[
              styles.submitText,
              isValid ? styles.submitTextActive : styles.submitTextDisabled,
            ]}
          >
            Send request
          </Text>
          <ArrowRight
            size={14}
            strokeWidth={2}
            color={isValid ? colors.bg : colors.inkMuted}
          />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 8,
    paddingHorizontal: 22,
    paddingBottom: 18,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  superTitle: {
    fontFamily: 'JetBrainsMono-Medium',
    fontSize: 10,
    fontWeight: '500',
    letterSpacing: 2,
    textTransform: 'uppercase',
    color: colors.accent,
    marginBottom: 6,
  },
  title: {
    fontFamily: 'InterTight-ExtraBold',
    fontSize: 26,
    fontWeight: '800',
    letterSpacing: -1.04,
    color: colors.ink,
  },
  closeButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  body: {
    flex: 1,
  },
  bodyContent: {
    paddingTop: 20,
    paddingHorizontal: 22,
  },
  footerNote: {
    fontFamily: 'JetBrainsMono-Medium',
    fontSize: 9.5,
    fontWeight: '500',
    letterSpacing: 1.14,
    textTransform: 'uppercase',
    color: colors.inkSubtle,
    textAlign: 'center',
    marginTop: -4,
    marginBottom: 16,
  },
  submitContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingTop: 16,
    paddingHorizontal: 16,
    backgroundColor: colors.bg,
  },
  submitButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 18,
    paddingHorizontal: 22,
    borderRadius: 100,
  },
  submitButtonActive: {
    backgroundColor: colors.accent,
    ...shadows.accentGlow,
  },
  submitButtonDisabled: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  submitText: {
    fontFamily: 'InterTight-Bold',
    fontSize: 14.5,
    fontWeight: '700',
    letterSpacing: -0.29,
  },
  submitTextActive: {
    color: colors.bg,
  },
  submitTextDisabled: {
    color: colors.inkMuted,
  },
});
