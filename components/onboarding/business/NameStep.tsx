/**
 * Business NameStep Component
 * Business display name + primary category selection.
 */

import React from 'react';
import { View, TextInput, StyleSheet } from 'react-native';
import { colors } from '@/constants/theme';
import { StepShell } from '../StepShell';
import { FieldCard } from '../FieldCard';
import { ChipGrid } from '../ChipGrid';
import { BUSINESS_CATEGORIES } from '@/constants/onboardingOptions';
import type { PerkCategory } from '@/types/perk';

interface NameStepProps {
  step: number;
  total: number;
  name: string;
  category: PerkCategory | null;
  onNameChange: (name: string) => void;
  onCategoryChange: (category: PerkCategory | null) => void;
  onBack: () => void;
  onNext: () => void;
}

export function NameStep({
  step,
  total,
  name,
  category,
  onNameChange,
  onCategoryChange,
  onBack,
  onNext,
}: NameStepProps) {
  const canContinue = name.trim().length >= 2 && category !== null;

  const handleCategoryChange = (selected: PerkCategory[]) => {
    onCategoryChange(selected.length > 0 ? selected[0] : null);
  };

  return (
    <StepShell
      step={step}
      total={total}
      eyebrow="Identity"
      title="What's your business?"
      subtitle="Influencers will see this name and category in The Hub."
      canGoBack
      onBack={onBack}
      canContinue={canContinue}
      onNext={onNext}
    >
      <View style={styles.content}>
        {/* Name input */}
        <FieldCard label="Business name">
          <TextInput
            style={styles.nameInput}
            value={name}
            onChangeText={onNameChange}
            placeholder="Cafe Levinsky"
            placeholderTextColor={colors.inkSubtle}
            autoFocus
            accessibilityLabel="Business name"
          />
        </FieldCard>

        {/* Category selection */}
        <View style={styles.categoriesSection}>
          <ChipGrid
            header="Category"
            options={BUSINESS_CATEGORIES}
            selected={category ? [category] : []}
            onChange={handleCategoryChange}
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
  nameInput: {
    paddingVertical: 14,
    paddingHorizontal: 16,
    fontFamily: 'InterTight-Bold',
    fontSize: 22,
    fontWeight: '700',
    letterSpacing: -0.55, // -0.025em
    color: colors.ink,
  },
  categoriesSection: {
    marginTop: 4,
  },
});
