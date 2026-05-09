/**
 * StickyCTA Component
 * Bottom action bar that adapts to selection state.
 */

import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { BlurView } from 'expo-blur';
import { ArrowRight } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, shadows } from '@/constants/theme';
import type { TalentService } from '@/types/talent';

interface StickyCTAProps {
  selectedServices: TalentService[];
  onRequestBooking: () => void;
}

export function StickyCTA({ selectedServices, onRequestBooking }: StickyCTAProps) {
  const insets = useSafeAreaInsets();
  const count = selectedServices.length;
  const total = selectedServices.reduce((sum, s) => sum + s.price, 0);
  const isActive = count > 0;

  return (
    <View style={[styles.container, { paddingBottom: insets.bottom + 16 }]}>
      <BlurView intensity={40} tint="dark" style={StyleSheet.absoluteFill} />
      <View style={styles.overlay} />

      <View style={styles.content}>
        {/* Left side - selection info */}
        <View style={styles.leftContent}>
          {isActive ? (
            <>
              <Text style={styles.selectionTextActive}>
                {count} {count === 1 ? 'SERVICE' : 'SERVICES'} SELECTED
              </Text>
              <Text style={styles.totalPrice}>{total}</Text>
            </>
          ) : (
            <Text style={styles.selectionTextInactive}>SELECT A SERVICE</Text>
          )}
        </View>

        {/* Right side - button */}
        <Pressable
          style={[
            styles.button,
            isActive ? styles.buttonActive : styles.buttonDisabled,
          ]}
          onPress={onRequestBooking}
          disabled={!isActive}
          accessibilityRole="button"
          accessibilityLabel="Request a booking"
          accessibilityState={{ disabled: !isActive }}
        >
          <Text
            style={[
              styles.buttonText,
              isActive ? styles.buttonTextActive : styles.buttonTextDisabled,
            ]}
          >
            Request a booking
          </Text>
          <ArrowRight
            size={14}
            strokeWidth={2}
            color={isActive ? colors.bg : colors.inkMuted}
          />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    overflow: 'hidden',
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(26,24,21,0.94)',
  },
  content: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 16,
    paddingHorizontal: 22,
  },
  leftContent: {
    justifyContent: 'center',
  },
  selectionTextInactive: {
    fontFamily: 'JetBrainsMono-Medium',
    fontSize: 10.5,
    fontWeight: '500',
    letterSpacing: 1.575,
    textTransform: 'uppercase',
    color: colors.inkMuted,
  },
  selectionTextActive: {
    fontFamily: 'JetBrainsMono-Medium',
    fontSize: 10.5,
    fontWeight: '500',
    letterSpacing: 1.575,
    textTransform: 'uppercase',
    color: colors.accent,
  },
  totalPrice: {
    fontFamily: 'InterTight-ExtraBold',
    fontSize: 22,
    fontWeight: '800',
    letterSpacing: -0.77,
    color: colors.ink,
    marginTop: 2,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 16,
    paddingHorizontal: 22,
    borderRadius: 100,
  },
  buttonActive: {
    backgroundColor: colors.accent,
    ...shadows.accentGlow,
  },
  buttonDisabled: {
    backgroundColor: colors.surface,
  },
  buttonText: {
    fontFamily: 'JetBrainsMono-Medium',
    fontSize: 10.5,
    fontWeight: '500',
    letterSpacing: 1.575,
    textTransform: 'uppercase',
  },
  buttonTextActive: {
    color: colors.bg,
  },
  buttonTextDisabled: {
    color: colors.inkMuted,
  },
});
