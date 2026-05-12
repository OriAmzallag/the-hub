/**
 * Influencer LanguagesStep Component
 * Multi-select languages.
 */

import React from 'react';
import { StepShell } from '../StepShell';
import { ChipGrid } from '../ChipGrid';
import { LANGUAGES } from '@/constants/onboardingOptions';

interface LanguagesStepProps {
  step: number;
  total: number;
  languages: string[];
  onLanguagesChange: (languages: string[]) => void;
  onBack: () => void;
  onNext: () => void;
}

export function LanguagesStep({
  step,
  total,
  languages,
  onLanguagesChange,
  onBack,
  onNext,
}: LanguagesStepProps) {
  // At least 1 language required
  const canContinue = languages.length >= 1;

  return (
    <StepShell
      step={step}
      total={total}
      title="What languages do you speak?"
      subtitle="Select all that apply."
      canGoBack
      onBack={onBack}
      canContinue={canContinue}
      onNext={onNext}
    >
      <ChipGrid
        header="LANGUAGES"
        options={LANGUAGES}
        selected={languages}
        onChange={onLanguagesChange}
      />
    </StepShell>
  );
}
