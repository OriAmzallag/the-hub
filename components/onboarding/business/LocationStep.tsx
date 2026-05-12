/**
 * Business LocationStep Component
 * Business location (city/area) input.
 */

import React from 'react';
import { View, TextInput, StyleSheet } from 'react-native';
import { MapPin } from 'lucide-react-native';
import { colors } from '@/constants/theme';
import { StepShell } from '../StepShell';
import { FieldCard } from '../FieldCard';

interface LocationStepProps {
  step: number;
  total: number;
  location: string;
  onLocationChange: (location: string) => void;
  onBack: () => void;
  onNext: () => void;
}

export function LocationStep({
  step,
  total,
  location,
  onLocationChange,
  onBack,
  onNext,
}: LocationStepProps) {
  const canContinue = location.trim().length >= 2;

  return (
    <StepShell
      step={step}
      total={total}
      title="Where are you located?"
      subtitle="Help influencers find you."
      canGoBack
      onBack={onBack}
      canContinue={canContinue}
      onNext={onNext}
    >
      <FieldCard label="CITY / AREA">
        <View style={styles.inputRow}>
          {/* MapPin icon */}
          <View style={styles.iconContainer}>
            <MapPin size={20} color={colors.inkMuted} />
          </View>

          {/* Location input */}
          <TextInput
            style={styles.locationInput}
            value={location}
            onChangeText={onLocationChange}
            placeholder="Tel Aviv"
            placeholderTextColor={colors.inkSubtle}
            autoFocus
            accessibilityLabel="Location"
          />
        </View>
      </FieldCard>
    </StepShell>
  );
}

const styles = StyleSheet.create({
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    paddingLeft: 16,
    paddingRight: 4,
  },
  locationInput: {
    flex: 1,
    paddingVertical: 14,
    paddingHorizontal: 12,
    paddingRight: 16,
    fontFamily: 'InterTight-Bold',
    fontSize: 22,
    fontWeight: '700',
    letterSpacing: -0.55, // -0.025em
    color: colors.ink,
  },
});
