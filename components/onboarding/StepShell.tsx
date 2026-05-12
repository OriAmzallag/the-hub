/**
 * StepShell Component
 * Shared layout wrapper for onboarding steps with progress bar.
 * Used by all steps except Welcome and Done (which are full-screen).
 */

import React from 'react';
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import Animated from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BlurView } from 'expo-blur';
import { ChevronLeft, ArrowRight } from 'lucide-react-native';
import { colors, typography, radii } from '@/constants/theme';
import { useFadeUpEntrance } from '@/hooks';

interface StepShellProps {
  /** Current step number (1-indexed) */
  step?: number;
  /** Total steps in the flow */
  total?: number;
  /** Optional eyebrow text (mono accent caption) */
  eyebrow?: string;
  /** Main title */
  title: string;
  /** Optional subtitle */
  subtitle?: string;
  /** Whether back button is enabled */
  canGoBack?: boolean;
  /** Back button handler */
  onBack?: () => void;
  /** Whether next/continue is enabled */
  canContinue: boolean;
  /** Next button handler */
  onNext: () => void;
  /** Custom next button label (default: "Next") */
  nextLabel?: string;
  /** Whether to show skip button */
  showSkip?: boolean;
  /** Skip button handler */
  onSkip?: () => void;
  /** Step content */
  children: React.ReactNode;
}

export function StepShell({
  step,
  total,
  eyebrow,
  title,
  subtitle,
  canGoBack = true,
  onBack,
  canContinue,
  onNext,
  nextLabel = 'Next',
  showSkip = false,
  onSkip,
  children,
}: StepShellProps) {
  const insets = useSafeAreaInsets();
  const showProgress = step !== undefined && total !== undefined;
  const progressWidth = showProgress ? `${(step / total) * 100}%` : '0%';
  const fadeStyle = useFadeUpEntrance();

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Top bar */}
      <View style={styles.topBar}>
        {/* Back button */}
        {canGoBack && onBack ? (
          <Pressable
            style={styles.backButton}
            onPress={onBack}
            accessibilityRole="button"
            accessibilityLabel="Go back"
          >
            <ChevronLeft size={20} color={colors.ink} />
          </Pressable>
        ) : (
          <View style={styles.backButtonPlaceholder} />
        )}

        {/* Progress bar */}
        {showProgress && (
          <View style={styles.progressContainer}>
            <View style={styles.progressTrack}>
              <View
                style={[styles.progressFill, { width: progressWidth as any }]}
              />
            </View>
          </View>
        )}

        {/* Step counter */}
        {showProgress && (
          <Text style={styles.stepCounter}>
            {step}/{total}
          </Text>
        )}
      </View>

      {/* Scrollable content */}
      <KeyboardAvoidingView
        style={styles.keyboardAvoid}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={insets.top + 56}
      >
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Fade-up wrapper — opacity 0 → 1 + translateY 8 → 0 over
              400ms ease-out on every step mount, matching the .fade-up
              animation from the reference. */}
          <Animated.View style={fadeStyle}>
            {/* Header */}
            <View style={styles.header}>
              {eyebrow && <Text style={styles.eyebrow}>{eyebrow}</Text>}
              <Text style={styles.title}>{title}</Text>
              {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
            </View>

            {/* Step content */}
            <View style={styles.body}>{children}</View>
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Sticky footer */}
      <BlurView intensity={80} tint="dark" style={styles.footerBlur}>
        <View
          style={[
            styles.footer,
            { paddingBottom: Math.max(insets.bottom, 16) },
          ]}
        >
          {/* Skip button */}
          {showSkip && onSkip && (
            <Pressable
              style={styles.skipButton}
              onPress={onSkip}
              accessibilityRole="button"
              accessibilityLabel="Skip for now"
            >
              <Text style={styles.skipText}>SKIP FOR NOW</Text>
            </Pressable>
          )}

          {/* Next CTA */}
          <Pressable
            style={[
              styles.nextButton,
              !canContinue && styles.nextButtonDisabled,
            ]}
            onPress={onNext}
            disabled={!canContinue}
            accessibilityRole="button"
            accessibilityLabel={nextLabel}
            accessibilityState={{ disabled: !canContinue }}
          >
            <Text
              style={[
                styles.nextButtonText,
                !canContinue && styles.nextButtonTextDisabled,
              ]}
            >
              {nextLabel}
            </Text>
            <ArrowRight
              size={18}
              strokeWidth={2.5}
              color={canContinue ? colors.bg : colors.inkMuted}
            />
          </Pressable>
        </View>
      </BlurView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  topBar: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    gap: 12,
  },
  backButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backButtonPlaceholder: {
    width: 36,
    height: 36,
  },
  progressContainer: {
    flex: 1,
  },
  progressTrack: {
    height: 4,
    backgroundColor: colors.borderStrong,
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.accent,
    borderRadius: 2,
  },
  stepCounter: {
    ...typography.monoTimestamp,
    color: colors.inkMuted,
    minWidth: 32,
    textAlign: 'right',
  },
  keyboardAvoid: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingBottom: 180, // Space for sticky footer
  },
  header: {
    paddingTop: 16,
    marginBottom: 28,
  },
  eyebrow: {
    ...typography.monoGreeting,
    color: colors.accent,
    marginBottom: 12,
  },
  title: {
    fontFamily: 'InterTight-ExtraBold',
    fontSize: 32,
    fontWeight: '800',
    letterSpacing: -1.44, // -0.045em
    lineHeight: 32, // 1.0
    color: colors.ink,
  },
  subtitle: {
    fontFamily: 'InterTight-Regular',
    fontSize: 15,
    fontWeight: '400',
    lineHeight: 21.75, // 1.45
    color: colors.ink,
    opacity: 0.65,
    marginTop: 8,
  },
  body: {
    flex: 1,
  },
  footerBlur: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
  },
  footer: {
    paddingTop: 16,
    paddingHorizontal: 24,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    backgroundColor: colors.bgOverlay94,
  },
  skipButton: {
    alignItems: 'center',
    paddingVertical: 8,
    marginBottom: 12,
  },
  skipText: {
    ...typography.monoLabel,
    color: colors.inkMuted,
  },
  nextButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 16,
    paddingHorizontal: 24,
    backgroundColor: colors.accent,
    borderRadius: radii.pill,
    shadowColor: colors.accent,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 24,
    elevation: 8,
  },
  nextButtonDisabled: {
    backgroundColor: colors.surface,
    shadowOpacity: 0,
    elevation: 0,
  },
  nextButtonText: {
    fontFamily: 'InterTight-Bold',
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: -0.3,
    color: colors.bg,
  },
  nextButtonTextDisabled: {
    color: colors.inkMuted,
  },
});
