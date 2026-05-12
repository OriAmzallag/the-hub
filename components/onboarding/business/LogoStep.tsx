/**
 * Business LogoStep Component
 * Optional logo upload with monogram fallback.
 * Reference: Single 140x140 tile showing logo OR monogram, with upload button below.
 */

import React from 'react';
import { View, Text, Image, Pressable, StyleSheet } from 'react-native';
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
    onLogoChange('mock-logo-url');
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
        {/* Single 140x140 tile: shows logo image when uploaded, monogram when not */}
        <Pressable
          style={styles.tile}
          onPress={handleUpload}
          accessibilityRole="button"
          accessibilityLabel={logo ? 'Change logo' : 'Upload logo'}
        >
          {logo ? (
            <Image
              source={{ uri: logo }}
              style={styles.logoImage}
              resizeMode="cover"
            />
          ) : (
            <Text style={styles.monogramText}>{monogram}</Text>
          )}
        </Pressable>

        {/* Full-width upload button */}
        <Pressable
          style={styles.uploadButton}
          onPress={handleUpload}
          accessibilityRole="button"
          accessibilityLabel={logo ? 'Change logo' : 'Upload logo'}
        >
          <Camera size={14} strokeWidth={2.4} color={colors.ink} />
          <Text style={styles.uploadButtonText}>
            {logo ? 'Change logo' : 'Upload logo'}
          </Text>
        </Pressable>
      </View>
    </StepShell>
  );
}

const styles = StyleSheet.create({
  content: {
    alignItems: 'center',
    paddingTop: 24,
    gap: 16,
  },
  tile: {
    width: 140,
    height: 140,
    borderRadius: 28,
    backgroundColor: colors.surfaceAlt,
    borderWidth: 1,
    borderColor: colors.borderStrong,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  logoImage: {
    width: '100%',
    height: '100%',
  },
  monogramText: {
    fontFamily: 'InterTight-ExtraBold',
    fontSize: 56,
    fontWeight: '900',
    letterSpacing: -2.52, // -0.045em
    color: colors.ink,
  },
  uploadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    width: '100%',
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.borderStrong,
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  uploadButtonText: {
    fontFamily: 'InterTight-SemiBold',
    fontSize: 14,
    fontWeight: '600',
    letterSpacing: -0.28,
    color: colors.ink,
  },
});
