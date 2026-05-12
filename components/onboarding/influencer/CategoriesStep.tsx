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
      eyebrow="Categories"
      title="Pick your field."
      subtitle="Up to 3. The first one is your primary — it shows on Discover cards."
      canGoBack
      onBack={onBack}
      canContinue={canContinue}
      onNext={onNext}
    >
      <ChipGrid
        options={INFLUENCER_CATEGORIES}
        selected={categories}
        onChange={(selected) => onCategoriesChange(selected as PerkCategory[])}
        max={3}
        showPrimaryIndex
      />
    </StepShell>
  );
}
