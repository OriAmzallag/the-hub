/**
 * HandoffOfferCard Component
 * Card showing pending WhatsApp handoff state with pulsing indicator
 */

import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { MessageCircle } from 'lucide-react-native';
import { colors, radii } from '@/constants/theme';

interface HandoffOfferCardProps {
  counterpartyName: string;
}

export function HandoffOfferCard({ counterpartyName }: HandoffOfferCardProps) {
  // Pulsing dot animation
  const dotOpacity = useSharedValue(1);

  useEffect(() => {
    dotOpacity.value = withRepeat(
      withTiming(0.4, {
        duration: 600,
        easing: Easing.inOut(Easing.ease),
      }),
      -1, // Infinite
      true // Reverse
    );
  }, [dotOpacity]);

  const dotStyle = useAnimatedStyle(() => ({
    opacity: dotOpacity.value,
  }));

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <MessageCircle size={14} color={colors.accent} strokeWidth={2} />
        <Text style={styles.headerText}>YOU SUGGESTED WHATSAPP</Text>
      </View>

      {/* Body */}
      <Text style={styles.body}>
        Waiting for {counterpartyName} to confirm sharing numbers. Once they
        accept, you'll both get a WhatsApp link to continue off-platform.
      </Text>

      {/* Pending indicator */}
      <View style={styles.pendingRow}>
        <Animated.View style={[styles.pulsingDot, dotStyle]} />
        <Text style={styles.pendingText}>PENDING</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.accentSoft,
    borderWidth: 1,
    borderColor: colors.accentBorder,
    borderRadius: radii.card,
    padding: 16,
    marginHorizontal: 14,
    marginVertical: 8,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  headerText: {
    fontFamily: 'JetBrainsMono-SemiBold',
    fontSize: 9.5,
    fontWeight: '600',
    letterSpacing: 1.71, // 0.18em
    color: colors.accent,
    textTransform: 'uppercase',
  },
  body: {
    fontFamily: 'InterTight-Regular',
    fontSize: 13.5,
    fontWeight: '400',
    lineHeight: 13.5 * 1.5,
    color: colors.ink,
    marginTop: 10,
  },
  pendingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 12,
  },
  pulsingDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.accent,
  },
  pendingText: {
    fontFamily: 'JetBrainsMono-Medium',
    fontSize: 9,
    fontWeight: '500',
    letterSpacing: 1.62, // 0.18em
    color: colors.accent,
    textTransform: 'uppercase',
  },
});
