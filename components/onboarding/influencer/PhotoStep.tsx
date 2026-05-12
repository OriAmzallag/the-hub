/**
 * Influencer PhotoStep Component
 * Required profile photo upload.
 */

import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Camera, X } from 'lucide-react-native';
import { colors, radii, typography } from '@/constants/theme';
import { StepShell } from '../StepShell';

interface PhotoStepProps {
  step: number;
  total: number;
  photo: string | null;
  onPhotoChange: (photo: string | null) => void;
  onBack: () => void;
  onNext: () => void;
}

export function PhotoStep({
  step,
  total,
  photo,
  onPhotoChange,
  onBack,
  onNext,
}: PhotoStepProps) {
  // Photo is required
  const canContinue = photo !== null;

  const handleUpload = () => {
    // Mock upload - in real app would open image picker
    onPhotoChange('mock-photo-url');
  };

  const handleRemove = () => {
    onPhotoChange(null);
  };

  return (
    <StepShell
      step={step}
      total={total}
      title="Add your photo"
      subtitle="Businesses want to see who they're working with."
      canGoBack
      onBack={onBack}
      canContinue={canContinue}
      onNext={onNext}
    >
      <View style={styles.content}>
        {/* Upload tile or preview */}
        {photo ? (
          <View style={styles.photoContainer}>
            <View style={styles.photoPreview}>
              <Text style={styles.photoPreviewText}>Photo</Text>
            </View>
            <Pressable
              style={styles.removeButton}
              onPress={handleRemove}
              accessibilityRole="button"
              accessibilityLabel="Remove photo"
            >
              <X size={16} strokeWidth={2.5} color={colors.ink} />
            </Pressable>
          </View>
        ) : (
          <Pressable
            style={styles.uploadTile}
            onPress={handleUpload}
            accessibilityRole="button"
            accessibilityLabel="Upload photo"
          >
            <Camera size={32} color={colors.inkMuted} />
            <Text style={styles.uploadText}>TAP TO UPLOAD</Text>
          </Pressable>
        )}

        {/* Required hint */}
        {!photo && (
          <Text style={styles.requiredHint}>Required to continue</Text>
        )}
      </View>
    </StepShell>
  );
}

const styles = StyleSheet.create({
  content: {
    alignItems: 'center',
    paddingTop: 32,
  },
  uploadTile: {
    width: 120,
    height: 120,
    borderRadius: radii.avatar,
    backgroundColor: colors.surface,
    borderWidth: 1.5,
    borderColor: colors.borderStrong,
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  uploadText: {
    ...typography.monoTimestamp,
    color: colors.inkMuted,
  },
  photoContainer: {
    position: 'relative',
  },
  photoPreview: {
    width: 120,
    height: 120,
    borderRadius: radii.avatar,
    backgroundColor: colors.accentSoft,
    borderWidth: 1,
    borderColor: colors.accentBorder,
    alignItems: 'center',
    justifyContent: 'center',
  },
  photoPreviewText: {
    fontFamily: 'InterTight-SemiBold',
    fontSize: 14,
    color: colors.accent,
  },
  removeButton: {
    position: 'absolute',
    top: -8,
    right: -8,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  requiredHint: {
    ...typography.monoTimestamp,
    color: colors.inkMuted,
    marginTop: 20,
  },
});
