/**
 * Influencer ContentStep Component
 * Multi-select content types.
 */

import React from 'react';
import { StepShell } from '../StepShell';
import { ChipGrid } from '../ChipGrid';
import { CONTENT_TYPES } from '@/constants/onboardingOptions';

interface ContentStepProps {
  step: number;
  total: number;
  contentTypes: string[];
  onContentTypesChange: (contentTypes: string[]) => void;
  onBack: () => void;
  onNext: () => void;
}

export function ContentStep({
  step,
  total,
  contentTypes,
  onContentTypesChange,
  onBack,
  onNext,
}: ContentStepProps) {
  // At least 1 content type required
  const canContinue = contentTypes.length >= 1;

  return (
    <StepShell
      step={step}
      total={total}
      title="What content do you make?"
      subtitle="Select all that apply."
      canGoBack
      onBack={onBack}
      canContinue={canContinue}
      onNext={onNext}
    >
      <ChipGrid
        header="CONTENT TYPES"
        options={CONTENT_TYPES}
        selected={contentTypes}
        onChange={onContentTypesChange}
      />
    </StepShell>
  );
}
