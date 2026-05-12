/**
 * Influencer NameBioStep Component
 * Display name + bio (both required).
 */

import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { colors, typography } from '@/constants/theme';
import { StepShell } from '../StepShell';
import { FieldCard } from '../FieldCard';

interface NameBioStepProps {
  step: number;
  total: number;
  name: string;
  bio: string;
  onNameChange: (name: string) => void;
  onBioChange: (bio: string) => void;
  onBack: () => void;
  onNext: () => void;
}

const MAX_BIO_LENGTH = 280;
const MIN_BIO_LENGTH = 10;

export function NameBioStep({
  step,
  total,
  name,
  bio,
  onNameChange,
  onBioChange,
  onBack,
  onNext,
}: NameBioStepProps) {
  // Validation: name >= 2 chars AND bio >= 10 chars
  const canContinue =
    name.trim().length >= 2 && bio.trim().length >= MIN_BIO_LENGTH;

  return (
    <StepShell
      step={step}
      total={total}
      eyebrow="LET'S BUILD YOUR PROFILE"
      title="Introduce yourself"
      canGoBack
      onBack={onBack}
      canContinue={canContinue}
      onNext={onNext}
    >
      <View style={styles.content}>
        {/* Name input */}
        <FieldCard label="DISPLAY NAME">
          <TextInput
            style={styles.nameInput}
            value={name}
            onChangeText={onNameChange}
            placeholder="Maya Cohen"
            placeholderTextColor={colors.inkSubtle}
            autoFocus
            accessibilityLabel="Display name"
          />
        </FieldCard>

        {/* Bio input */}
        <FieldCard label="BIO">
          <View style={styles.bioContainer}>
            <TextInput
              style={styles.bioInput}
              value={bio}
              onChangeText={(text) => onBioChange(text.slice(0, MAX_BIO_LENGTH))}
              placeholder="Tell businesses about your content style..."
              placeholderTextColor={colors.inkSubtle}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
              accessibilityLabel="Bio"
            />
            <View style={styles.charCountRow}>
              <Text
                style={[
                  styles.charCount,
                  bio.length < MIN_BIO_LENGTH && styles.charCountWarning,
                ]}
              >
                {bio.length}/{MAX_BIO_LENGTH}
              </Text>
            </View>
          </View>
        </FieldCard>

        {/* Hint */}
        {bio.length > 0 && bio.length < MIN_BIO_LENGTH && (
          <Text style={styles.hint}>
            At least {MIN_BIO_LENGTH} characters required
          </Text>
        )}
      </View>
    </StepShell>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: 20,
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
  bioContainer: {
    minHeight: 100,
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
    minHeight: 60,
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
  charCountWarning: {
    color: colors.decline,
  },
  hint: {
    ...typography.monoTimestamp,
    color: colors.decline,
    textAlign: 'center',
  },
});
