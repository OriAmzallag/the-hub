/**
 * Influencer DemoStep Component
 * Demographics: Age bracket + Gender.
 */

import React from 'react';
import { View, StyleSheet } from 'react-native';
import { StepShell } from '../StepShell';
import { ChipGrid } from '../ChipGrid';
import { AGE_BRACKETS, GENDERS } from '@/constants/onboardingOptions';

interface DemoStepProps {
  step: number;
  total: number;
  age: string | null;
  gender: string | null;
  onAgeChange: (age: string | null) => void;
  onGenderChange: (gender: string | null) => void;
  onBack: () => void;
  onNext: () => void;
}

export function DemoStep({
  step,
  total,
  age,
  gender,
  onAgeChange,
  onGenderChange,
  onBack,
  onNext,
}: DemoStepProps) {
  // Both age and gender required
  const canContinue = age !== null && gender !== null;

  return (
    <StepShell
      step={step}
      total={total}
      title="Tell us about your audience"
      subtitle="This helps businesses find the right match."
      canGoBack
      onBack={onBack}
      canContinue={canContinue}
      onNext={onNext}
    >
      <View style={styles.content}>
        {/* Age brackets */}
        <ChipGrid
          header="YOUR AGE"
          options={AGE_BRACKETS}
          selected={age ? [age] : []}
          onChange={(selected) => onAgeChange(selected[0] ?? null)}
          singleSelect
        />

        {/* Gender */}
        <View style={styles.section}>
          <ChipGrid
            header="YOUR GENDER"
            options={GENDERS}
            selected={gender ? [gender] : []}
            onChange={(selected) => onGenderChange(selected[0] ?? null)}
            singleSelect
          />
        </View>
      </View>
    </StepShell>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: 28,
  },
  section: {
    marginTop: 4,
  },
});
