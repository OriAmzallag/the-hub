/**
 * PhoneStep Component
 * Two-stage phone verification: phone entry -> OTP entry.
 */

import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet } from 'react-native';
import { colors, typography, radii } from '@/constants/theme';
import { StepShell } from './StepShell';
import { FieldCard } from './FieldCard';

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
        title="What's your number?"
        subtitle="We'll send you a verification code."
        canGoBack
        onBack={onBack}
        canContinue={canContinuePhone}
        onNext={onNext}
        nextLabel="Send code"
      >
        <FieldCard label="PHONE NUMBER">
          <View style={styles.phoneRow}>
            {/* Fixed prefix */}
            <View style={styles.prefixTile}>
              <Text style={styles.prefixText}>+972</Text>
            </View>

            {/* Separator */}
            <View style={styles.separator} />

            {/* Phone input */}
            <TextInput
              style={styles.phoneInput}
              value={phone}
              onChangeText={onPhoneChange}
              placeholder="50 123 4567"
              placeholderTextColor={colors.inkSubtle}
              keyboardType="phone-pad"
              autoFocus
              accessibilityLabel="Phone number"
            />
          </View>
        </FieldCard>
      </StepShell>
    );
  }

  // OTP stage
  return (
    <StepShell
      title="Enter the code"
      subtitle={`We sent a 6-digit code to +972 ${phone}`}
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
  phoneRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  prefixTile: {
    width: 72,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  prefixText: {
    fontFamily: 'InterTight-Bold',
    fontSize: 22,
    fontWeight: '700',
    letterSpacing: -0.55, // -0.025em
    color: colors.inkMuted,
  },
  separator: {
    width: 1,
    height: 28,
    backgroundColor: colors.border,
  },
  phoneInput: {
    flex: 1,
    paddingVertical: 14,
    paddingLeft: 14,
    paddingRight: 16,
    fontFamily: 'InterTight-Bold',
    fontSize: 22,
    fontWeight: '700',
    letterSpacing: -0.55, // -0.025em
    color: colors.ink,
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
