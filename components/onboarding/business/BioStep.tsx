/**
 * Business BioStep Component
 * Optional business bio with character count.
 */

import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { colors, typography } from '@/constants/theme';
import { StepShell } from '../StepShell';
import { FieldCard } from '../FieldCard';

interface BioStepProps {
  step: number;
  total: number;
  bio: string;
  onBioChange: (bio: string) => void;
  onBack: () => void;
  onNext: () => void;
  onSkip: () => void;
}

const MAX_BIO_LENGTH = 200;

export function BioStep({
  step,
  total,
  bio,
  onBioChange,
  onBack,
  onNext,
  onSkip,
}: BioStepProps) {
  // Always can continue (bio is optional)
  // Show Skip when bio is empty, Next when bio has content
  const hasBio = bio.trim().length > 0;

  return (
    <StepShell
      step={step}
      total={total}
      eyebrow="Voice"
      title="Tell us about it."
      subtitle="A short blurb Influencers see. Keep it specific and honest."
      canGoBack
      onBack={onBack}
      canContinue={hasBio}
      onNext={onNext}
      showSkip={!hasBio}
      onSkip={onSkip}
    >
      <FieldCard label="About">
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.bioInput}
            value={bio}
            onChangeText={(text) => onBioChange(text.slice(0, MAX_BIO_LENGTH))}
            placeholder="Tell influencers what your cafe is known for..."
            placeholderTextColor={colors.inkSubtle}
            multiline
            numberOfLines={5}
            textAlignVertical="top"
            accessibilityLabel="Business bio"
          />
          <View style={styles.charCountRow}>
            <Text
              style={[
                styles.charCount,
                bio.length > 180 && styles.charCountAccent,
              ]}
            >
              {bio.length}/{MAX_BIO_LENGTH}
            </Text>
          </View>
        </View>
      </FieldCard>
    </StepShell>
  );
}

const styles = StyleSheet.create({
  inputContainer: {
    minHeight: 120,
  },
  bioInput: {
    flex: 1,
    paddingTop: 14,
    paddingBottom: 8,
    paddingHorizontal: 16,
    fontFamily: 'InterTight-Regular',
    fontSize: 15,
    fontWeight: '400',
    lineHeight: 21.75,
    color: colors.ink,
    minHeight: 80,
  },
  charCountRow: {
    alignItems: 'flex-end',
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  charCount: {
    ...typography.monoTimestamp,
    color: colors.inkMuted,
  },
  charCountAccent: {
    color: colors.accent,
  },
});
