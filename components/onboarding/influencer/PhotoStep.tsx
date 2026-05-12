/**
 * Influencer PhotoStep Component
 * Required profile photo upload.
 * Reference: Single 180x180 tile (dashed border when empty), Change button below when photo exists.
 */

import React from 'react';
import { View, Text, Image, Pressable, StyleSheet } from 'react-native';
import { Camera } from 'lucide-react-native';
import { colors, radii } from '@/constants/theme';
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

  return (
    <StepShell
      step={step}
      total={total}
      eyebrow="Photo"
      title="Add a photo."
      subtitle="Required. This becomes your profile image — the first thing Businesses see."
      canGoBack
      onBack={onBack}
      canContinue={canContinue}
      onNext={onNext}
    >
      <View style={styles.content}>
        {/* Single 180x180 tile */}
        <Pressable
          style={[styles.tile, photo && styles.tileWithPhoto]}
          onPress={handleUpload}
          accessibilityRole="button"
          accessibilityLabel={photo ? 'Change photo' : 'Upload photo'}
        >
          {photo ? (
            <Image
              source={{ uri: photo }}
              style={styles.photoImage}
              resizeMode="cover"
            />
          ) : (
            <>
              <Camera size={32} strokeWidth={1.8} color={colors.inkMuted} />
              <Text style={styles.uploadLabel}>Tap to upload</Text>
            </>
          )}
        </Pressable>

        {/* Change photo button - only shown when photo exists */}
        {photo && (
          <Pressable
            style={styles.changeButton}
            onPress={handleUpload}
            accessibilityRole="button"
            accessibilityLabel="Change photo"
          >
            <Camera size={14} strokeWidth={2.4} color={colors.ink} />
            <Text style={styles.changeButtonText}>Change photo</Text>
          </Pressable>
        )}
      </View>
    </StepShell>
  );
}

const styles = StyleSheet.create({
  content: {
    alignItems: 'center',
    paddingTop: 32,
    gap: 16,
  },
  tile: {
    width: 180,
    height: 180,
    borderRadius: 32,
    backgroundColor: colors.surfaceAlt,
    borderWidth: 1.5,
    borderColor: colors.borderStrong,
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    overflow: 'hidden',
  },
  tileWithPhoto: {
    borderStyle: 'solid',
    borderWidth: 1,
  },
  photoImage: {
    width: '100%',
    height: '100%',
  },
  uploadLabel: {
    fontFamily: 'InterTight-SemiBold',
    fontSize: 14,
    fontWeight: '600',
    letterSpacing: -0.28,
    color: colors.ink,
  },
  changeButton: {
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
  changeButtonText: {
    fontFamily: 'InterTight-SemiBold',
    fontSize: 14,
    fontWeight: '600',
    letterSpacing: -0.28,
    color: colors.ink,
  },
});
