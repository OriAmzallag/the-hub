/**
 * Influencer PlatformsStep Component
 * Platform selection with follower counts and mock OAuth verification.
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import {
  Instagram,
  Music2,
  Youtube,
  Check,
  ShieldCheck,
  Lock,
  AlertCircle,
} from 'lucide-react-native';
import { colors, typography, radii } from '@/constants/theme';
import { StepShell } from '../StepShell';
import { PLATFORMS, MOCK_REACH } from '@/constants/onboardingOptions';
import type { PlatformsState } from '@/types/onboarding';
import type { PerkPlatform } from '@/types/perk';

interface PlatformsStepProps {
  step: number;
  total: number;
  platforms: PlatformsState;
  onPlatformsChange: (platforms: PlatformsState) => void;
  onBack: () => void;
  onNext: () => void;
}

const PLATFORM_ICONS = {
  Instagram,
  Music2,
  Youtube,
};

export function PlatformsStep({
  step,
  total,
  platforms,
  onPlatformsChange,
  onBack,
  onNext,
}: PlatformsStepProps) {
  const [verifying, setVerifying] = useState<PerkPlatform | null>(null);

  // Validation: at least 1 platform enabled AND all enabled have followers > 0
  const enabledPlatforms = (Object.keys(platforms) as PerkPlatform[]).filter(
    (p) => platforms[p].enabled
  );
  const allHaveFollowers = enabledPlatforms.every(
    (p) => platforms[p].followers > 0
  );
  const canContinue = enabledPlatforms.length >= 1 && allHaveFollowers;

  const togglePlatform = (platformId: PerkPlatform) => {
    const current = platforms[platformId];
    onPlatformsChange({
      ...platforms,
      [platformId]: {
        ...current,
        enabled: !current.enabled,
      },
    });
  };

  const updateFollowers = (platformId: PerkPlatform, followers: number) => {
    onPlatformsChange({
      ...platforms,
      [platformId]: {
        ...platforms[platformId],
        followers,
      },
    });
  };

  const handleVerify = async (platformId: PerkPlatform) => {
    setVerifying(platformId);
    // Mock OAuth roundtrip - 1.2s delay
    await new Promise((resolve) => setTimeout(resolve, 1200));
    // Populate with Maya's canonical reach values
    onPlatformsChange({
      ...platforms,
      [platformId]: {
        ...platforms[platformId],
        followers: MOCK_REACH[platformId],
        verified: true,
      },
    });
    setVerifying(null);
  };

  const formatFollowers = (count: number): string => {
    if (count >= 1000000) return `${(count / 1000000).toFixed(1)}M`;
    if (count >= 1000) return `${(count / 1000).toFixed(1)}K`;
    return count.toString();
  };

  return (
    <StepShell
      step={step}
      total={total}
      eyebrow="Platforms"
      title="Where do you publish?"
      subtitle="Pick your platforms and add follower counts. Verified accounts get a trust badge and rank higher in matching."
      canGoBack
      onBack={onBack}
      canContinue={canContinue}
      onNext={onNext}
    >
      <View style={styles.content}>
        {/* Platform tiles */}
        {PLATFORMS.map((platform) => {
          const state = platforms[platform.id];
          const Icon = PLATFORM_ICONS[platform.icon];
          const isVerifying = verifying === platform.id;

          return (
            <View
              key={platform.id}
              style={[
                styles.platformCard,
                state.enabled && styles.platformCardSelected,
              ]}
            >
              {/* Header row */}
              <Pressable
                style={styles.platformHeader}
                onPress={() => togglePlatform(platform.id)}
                accessibilityRole="button"
                accessibilityLabel={`${state.enabled ? 'Disable' : 'Enable'} ${platform.label}`}
                accessibilityState={{ selected: state.enabled }}
              >
                <View style={styles.platformIcon}>
                  <Icon size={22} color={colors.accent} />
                </View>
                <Text style={styles.platformLabel}>{platform.label}</Text>
                <View
                  style={[
                    styles.checkbox,
                    state.enabled && styles.checkboxEnabled,
                  ]}
                >
                  {state.enabled && (
                    <Check size={13} strokeWidth={3} color={colors.bg} />
                  )}
                </View>
              </Pressable>

              {/* Expanded panel */}
              {state.enabled && (
                <View style={styles.expandedPanel}>
                  {/* Follower input row */}
                  <View style={styles.followerRow}>
                    <Text style={styles.followerLabel}>
                      Followers on {platform.label}
                    </Text>
                    {state.verified && (
                      <View style={styles.lockedPill}>
                        <Lock size={10} color={colors.accent} />
                        <Text style={styles.lockedText}>LOCKED</Text>
                      </View>
                    )}
                  </View>

                  {/* Follower input */}
                  <View style={styles.followerInputContainer}>
                    <TextInput
                      style={[
                        styles.followerInput,
                        state.verified && styles.followerInputLocked,
                      ]}
                      value={
                        state.followers > 0 ? state.followers.toString() : ''
                      }
                      onChangeText={(text) => {
                        const num = parseInt(text.replace(/\D/g, ''), 10) || 0;
                        updateFollowers(platform.id, num);
                      }}
                      placeholder="0"
                      placeholderTextColor={colors.inkSubtle}
                      keyboardType="number-pad"
                      editable={!state.verified}
                      accessibilityLabel={`Followers on ${platform.label}`}
                    />
                  </View>

                  {/* Verify / Verified status */}
                  {state.verified ? (
                    <View style={styles.verifiedPill}>
                      <ShieldCheck size={14} color={colors.accent} />
                      <Text style={styles.verifiedText}>
                        VERIFIED · {formatFollowers(state.followers)} FROM{' '}
                        {platform.label.toUpperCase()}
                      </Text>
                    </View>
                  ) : isVerifying ? (
                    <View style={styles.verifyingPill}>
                      <ActivityIndicator size="small" color={colors.accent} />
                      <Text style={styles.verifyingText}>
                        Verifying with {platform.label}...
                      </Text>
                    </View>
                  ) : (
                    <>
                      <Pressable
                        style={styles.verifyButton}
                        onPress={() => handleVerify(platform.id)}
                        accessibilityRole="button"
                        accessibilityLabel={`Verify with ${platform.label}`}
                      >
                        <ShieldCheck size={16} color={colors.accent} />
                        <Text style={styles.verifyButtonText}>
                          Verify with {platform.label}
                        </Text>
                      </Pressable>
                      <View style={styles.unverifiedRow}>
                        <AlertCircle size={12} color={colors.decline} />
                        <Text style={styles.unverifiedText}>
                          UNVERIFIED · SELF-REPORTED
                        </Text>
                      </View>
                    </>
                  )}
                </View>
              )}
            </View>
          );
        })}

        {/* Why verify card */}
        <View style={styles.whyVerifyCard}>
          <Text style={styles.whyVerifyTitle}>Why verify?</Text>
          <Text style={styles.whyVerifyText}>
            Verified accounts get priority placement in search results and build
            more trust with businesses. Verification pulls your follower count
            directly from the platform, so businesses know it is accurate.
          </Text>
        </View>
      </View>
    </StepShell>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: 12,
  },
  platformCard: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.card,
    overflow: 'hidden',
  },
  platformCardSelected: {
    backgroundColor: colors.accentSoft,
    borderColor: colors.accentBorder,
  },
  platformHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  platformIcon: {
    width: 40,
    height: 40,
    borderRadius: radii.avatar,
    backgroundColor: colors.accentSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  platformLabel: {
    flex: 1,
    marginLeft: 12,
    fontFamily: 'InterTight-Bold',
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: -0.375,
    color: colors.ink,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 1.5,
    borderColor: colors.borderStrong,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxEnabled: {
    backgroundColor: colors.accent,
    borderColor: colors.accent,
  },
  expandedPanel: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    borderTopWidth: 1,
    borderTopColor: colors.accentBorder,
    gap: 12,
  },
  followerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 12,
  },
  followerLabel: {
    ...typography.monoStatus,
    color: colors.inkMuted,
  },
  lockedPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 4,
    paddingHorizontal: 8,
    backgroundColor: colors.accentSoft,
    borderRadius: radii.pill,
  },
  lockedText: {
    ...typography.monoTimestamp,
    color: colors.accent,
  },
  followerInputContainer: {
    backgroundColor: colors.surfaceAlt,
    borderRadius: radii.card,
  },
  followerInput: {
    paddingVertical: 12,
    paddingHorizontal: 14,
    fontFamily: 'InterTight-Bold',
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: -0.45,
    color: colors.ink,
  },
  followerInputLocked: {
    opacity: 0.85,
    color: colors.inkMuted,
  },
  verifiedPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 10,
    paddingHorizontal: 14,
    backgroundColor: colors.accentSoft,
    borderWidth: 1,
    borderColor: colors.accentBorder,
    borderRadius: radii.pill,
  },
  verifiedText: {
    ...typography.monoTimestamp,
    color: colors.accent,
    flex: 1,
  },
  verifyingPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 10,
    paddingHorizontal: 14,
    backgroundColor: colors.surface,
    borderRadius: radii.pill,
  },
  verifyingText: {
    fontFamily: 'InterTight-SemiBold',
    fontSize: 13,
    fontWeight: '600',
    color: colors.inkMuted,
  },
  verifyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 10,
    paddingHorizontal: 14,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.accentBorder,
    borderRadius: radii.pill,
  },
  verifyButtonText: {
    fontFamily: 'InterTight-SemiBold',
    fontSize: 13,
    fontWeight: '600',
    color: colors.accent,
  },
  unverifiedRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingTop: 4,
  },
  unverifiedText: {
    ...typography.monoTimestamp,
    color: colors.decline,
  },
  whyVerifyCard: {
    marginTop: 8,
    padding: 16,
    backgroundColor: colors.surfaceAlt,
    borderRadius: radii.card,
  },
  whyVerifyTitle: {
    fontFamily: 'InterTight-Bold',
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: -0.28,
    color: colors.ink,
    marginBottom: 6,
  },
  whyVerifyText: {
    fontFamily: 'InterTight-Regular',
    fontSize: 12.5,
    fontWeight: '400',
    lineHeight: 17.5,
    color: colors.ink,
    opacity: 0.75,
  },
});
