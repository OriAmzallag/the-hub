/**
 * Business LogoStep Component
 * Optional logo upload with monogram fallback.
 */

import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Camera } from 'lucide-react-native';
import { colors, radii } from '@/constants/theme';
import { StepShell } from '../StepShell';

interface LogoStepProps {
  step: number;
  total: number;
  logo: string | null;
  businessName: string;
  onLogoChange: (logo: string | null) => void;
  onBack: () => void;
  onNext: () => void;
  onSkip: () => void;
}

/**
 * Generate monogram from business name (first letters of first two words).
 */
function getMonogram(name: string): string {
  const words = name.trim().split(/\s+/);
  if (words.length === 0) return '';
  if (words.length === 1) return words[0].charAt(0).toUpperCase();
  return (words[0].charAt(0) + words[1].charAt(0)).toUpperCase();
}

export function LogoStep({
  step,
  total,
  logo,
  businessName,
  onLogoChange,
  onBack,
  onNext,
  onSkip,
}: LogoStepProps) {
  const monogram = getMonogram(businessName);

  const handleUpload = () => {
    // Mock upload - in real app would open image picker
    // For now, just set a placeholder
    onLogoChange('mock-logo-url');
  };

  const handleRemove = () => {
    onLogoChange(null);
  };

  return (
    <StepShell
      step={step}
      total={total}
      eyebrow="Look"
      title="Add your logo."
      subtitle="Optional. We'll use your initials if you skip."
      canGoBack
      onBack={onBack}
      canContinue
      onNext={onNext}
      showSkip
      onSkip={onSkip}
    >
      <View style={styles.content}>
        {/* Upload tile or preview */}
        <Pressable
          style={styles.uploadTile}
          onPress={logo ? handleRemove : handleUpload}
          accessibilityRole="button"
          accessibilityLabel={logo ? 'Remove logo' : 'Upload logo'}
        >
          {logo ? (
            // Logo preview (would be Image in real app)
            <View style={styles.logoPreview}>
              <Text style={styles.logoPreviewText}>Logo</Text>
            </View>
          ) : (
            // Upload prompt with Camera icon
            <Camera size={28} color={colors.inkMuted} />
          )}
        </Pressable>

        {/* Monogram preview */}
        {!logo && (
          <View style={styles.monogramSection}>
            <Text style={styles.monogramLabel}>OR WE'LL USE</Text>
            <View style={styles.monogramTile}>
              <Text style={styles.monogramText}>{monogram}</Text>
            </View>
          </View>
        )}
      </View>
    </StepShell>
  );
}

const styles = StyleSheet.create({
  content: {
    alignItems: 'center',
    paddingTop: 24,
  },
  uploadTile: {
    width: 88,
    height: 88,
    borderRadius: radii.avatar,
    backgroundColor: colors.surface,
    borderWidth: 1.5,
    borderColor: colors.borderStrong,
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoPreview: {
    width: '100%',
    height: '100%',
    borderRadius: radii.avatar,
    backgroundColor: colors.accentSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoPreviewText: {
    fontFamily: 'InterTight-SemiBold',
    fontSize: 14,
    color: colors.accent,
  },
  monogramSection: {
    alignItems: 'center',
    marginTop: 32,
  },
  monogramLabel: {
    fontFamily: 'JetBrainsMono-Medium',
    fontSize: 9.5,
    fontWeight: '500',
    letterSpacing: 1.425,
    color: colors.inkMuted,
    textTransform: 'uppercase',
    marginBottom: 12,
  },
  monogramTile: {
    width: 64,
    height: 64,
    borderRadius: radii.avatar,
    backgroundColor: colors.surfaceAlt,
    alignItems: 'center',
    justifyContent: 'center',
  },
  monogramText: {
    fontFamily: 'InterTight-ExtraBold',
    fontSize: 28,
    fontWeight: '800',
    color: colors.inkMuted,
  },
});
