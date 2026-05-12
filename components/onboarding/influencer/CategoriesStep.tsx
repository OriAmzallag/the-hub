/**
 * Influencer CategoriesStep Component
 * Multi-select categories (up to 3, first = primary).
 */

import React from 'react';
import { StepShell } from '../StepShell';
import { ChipGrid } from '../ChipGrid';
import { INFLUENCER_CATEGORIES } from '@/constants/onboardingOptions';
import type { PerkCategory } from '@/types/perk';

interface CategoriesStepProps {
  step: number;
  total: number;
  categories: PerkCategory[];
  onCategoriesChange: (categories: PerkCategory[]) => void;
  onBack: () => void;
  onNext: () => void;
}

export function CategoriesStep({
  step,
  total,
  categories,
  onCategoriesChange,
  onBack,
  onNext,
}: CategoriesStepProps) {
  // At least 1 category required
  const canContinue = categories.length >= 1;

  return (
    <StepShell
      step={step}
      total={total}
      title="What do you create?"
      subtitle="Pick up to 3 categories. Your first pick is your primary."
      canGoBack
      onBack={onBack}
      canContinue={canContinue}
      onNext={onNext}
    >
      <ChipGrid
        header="CATEGORIES"
        hint="(up to 3)"
        options={INFLUENCER_CATEGORIES}
        selected={categories}
        onChange={(selected) => onCategoriesChange(selected as PerkCategory[])}
        max={3}
        showPrimaryIndex
      />
    </StepShell>
  );
}
