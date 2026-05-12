/**
 * PhoneStep Component
 * Two-stage phone verification: phone entry -> OTP entry.
 */

import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet } from 'react-native';
import { colors, typography, radii } from '@/constants/theme';
import { StepShell } from './StepShell';

interface PhoneStepProps {
  phone: string;
  otp: string;
  onPhoneChange: (phone: string) => void;
  onOtpChange: (otp: string) => void;
  onBack: () => void;
  onNext: () => void;
  /** Current stage: 'phone' or 'otp' */
  stage: 'phone' | 'otp';
}

export function PhoneStep({
  phone,
  otp,
  onPhoneChange,
  onOtpChange,
  onBack,
  onNext,
  stage,
}: PhoneStepProps) {
  const [resendDisabled, setResendDisabled] = useState(false);

  // Phone stage validation: 7+ digits (Israeli mobile)
  const phoneDigits = phone.replace(/\D/g, '');
  const canContinuePhone = phoneDigits.length >= 7;

  // OTP stage validation: exactly 6 digits
  const otpDigits = otp.replace(/\D/g, '');
  const canContinueOtp = otpDigits.length === 6;

  const handleResend = () => {
    setResendDisabled(true);
    // Mock resend - re-enable after 30s
    setTimeout(() => setResendDisabled(false), 30000);
  };

  if (stage === 'phone') {
    return (
      <StepShell
        eyebrow="Account"
        title="What's your number?"
        subtitle="We'll text you a verification code. Your number stays private."
        canGoBack
        onBack={onBack}
        canContinue={canContinuePhone}
        onNext={onNext}
        nextLabel="Send code"
      >
        {/* Reference renders the phone field as a single card — prefix +
            separator + input on one row. No "PHONE NUMBER" label above. */}
        <View style={styles.phoneCard}>
          <Text style={styles.prefixText}>+972</Text>
          <View style={styles.separator} />
          <TextInput
            style={styles.phoneInput}
            value={phone}
            onChangeText={(text) => onPhoneChange(text.replace(/\D/g, ''))}
            placeholder="50 123 4567"
            placeholderTextColor={colors.inkSubtle}
            keyboardType="phone-pad"
            autoFocus
            accessibilityLabel="Phone number"
          />
        </View>
      </StepShell>
    );
  }

  // OTP stage
  return (
    <StepShell
      eyebrow="Verify"
      title="Enter the code"
      subtitle={`We sent a 6-digit code to +972 ${phone || 'your phone'}.`}
      canGoBack
      onBack={onBack}
      canContinue={canContinueOtp}
      onNext={onNext}
      nextLabel="Verify"
    >
      <View style={styles.otpContainer}>
        {/* OTP input */}
        <TextInput
          style={styles.otpInput}
          value={otp}
          onChangeText={(text) => {
            // Only allow digits, max 6
            const digits = text.replace(/\D/g, '').slice(0, 6);
            onOtpChange(digits);
          }}
          placeholder="000000"
          placeholderTextColor={colors.inkSubtle}
          keyboardType="number-pad"
          maxLength={6}
          autoFocus
          accessibilityLabel="Verification code"
        />

        {/* Resend link */}
        <Pressable
          style={styles.resendButton}
          onPress={handleResend}
          disabled={resendDisabled}
          accessibilityRole="button"
          accessibilityLabel="Resend code"
          accessibilityState={{ disabled: resendDisabled }}
        >
          <Text
            style={[
              styles.resendText,
              resendDisabled && styles.resendTextDisabled,
            ]}
          >
            RESEND CODE
          </Text>
        </Pressable>
      </View>
    </StepShell>
  );
}

const styles = StyleSheet.create({
  phoneCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 16,
    paddingHorizontal: 18,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 14,
  },
  prefixText: {
    fontFamily: 'InterTight-SemiBold',
    fontSize: 18,
    fontWeight: '600',
    color: colors.inkMuted,
  },
  separator: {
    width: 1,
    height: 24,
    backgroundColor: colors.border,
  },
  phoneInput: {
    flex: 1,
    fontFamily: 'InterTight-Bold',
    fontSize: 22,
    fontWeight: '700',
    letterSpacing: -0.55, // -0.025em
    color: colors.ink,
    padding: 0,
  },
  otpContainer: {
    alignItems: 'center',
    paddingTop: 32,
  },
  otpInput: {
    fontFamily: 'JetBrainsMono-Bold',
    fontSize: 28,
    fontWeight: '700',
    letterSpacing: 8.4, // 0.3em
    color: colors.ink,
    textAlign: 'center',
    minWidth: 200,
    paddingVertical: 16,
  },
  resendButton: {
    marginTop: 20,
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  resendText: {
    ...typography.monoLabel,
    color: colors.accent,
  },
  resendTextDisabled: {
    color: colors.inkMuted,
  },
});
