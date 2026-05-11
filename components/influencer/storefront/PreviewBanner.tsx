/**
 * PreviewBanner Component
 * Replaces the StickyCTA when the influencer views their own storefront
 * via "See as a Business sees you". Same blurred frosted plate as the
 * CTA bar so the visual chrome stays anchored, but the booking action
 * is swapped for an explanatory caption + a "Done" exit button.
 */

import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { BlurView } from 'expo-blur';
import { Eye } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, recipes } from '@/constants/theme';

interface PreviewBannerProps {
  onDone: () => void;
}

export function PreviewBanner({ onDone }: PreviewBannerProps) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingBottom: insets.bottom + 16 }]}>
      <BlurView intensity={40} tint="dark" style={StyleSheet.absoluteFill} />
      <View style={styles.overlay} />

      <View style={styles.content}>
        <View style={styles.leftContent}>
          <View style={styles.captionRow}>
            <Eye size={11} strokeWidth={2} color={colors.accent} />
            <Text style={styles.captionText}>PREVIEW MODE</Text>
          </View>
          <Text style={styles.subText}>How a Business sees your storefront</Text>
        </View>

        <Pressable
          style={styles.doneButton}
          onPress={onDone}
          accessibilityRole="button"
          accessibilityLabel="Exit preview"
        >
          <Text style={styles.doneText}>Done</Text>
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
    backgroundColor: colors.bgOverlay94,
  },
  content: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 16,
    paddingHorizontal: 22,
  },
  leftContent: {
    flex: 1,
  },
  captionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  captionText: {
    fontFamily: 'JetBrainsMono-SemiBold',
    fontSize: 9.5,
    fontWeight: '600',
    letterSpacing: 1.71,
    textTransform: 'uppercase',
    color: colors.accent,
  },
  subText: {
    fontFamily: 'InterTight-Regular',
    fontSize: 13,
    color: colors.inkMuted,
    marginTop: 6,
  },
  doneButton: {
    ...recipes.secondaryButton,
    paddingVertical: 12,
    paddingHorizontal: 22,
  },
  doneText: {
    fontFamily: 'InterTight-Bold',
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: -0.35,
    color: colors.ink,
  },
});
