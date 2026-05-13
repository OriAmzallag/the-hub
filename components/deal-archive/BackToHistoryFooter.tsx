/**
 * BackToHistoryFooter Component
 * Sticky footer with "Back to history" button for Deal Summary.
 */

import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { BlurView } from 'expo-blur';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ChevronLeft } from 'lucide-react-native';
import { colors, radii } from '@/constants/theme';

interface BackToHistoryFooterProps {
  onPress: () => void;
}

export function BackToHistoryFooter({ onPress }: BackToHistoryFooterProps) {
  const insets = useSafeAreaInsets();

  return (
    <BlurView intensity={80} tint="dark" style={styles.blurContainer}>
      <View
        style={[
          styles.footer,
          { paddingBottom: Math.max(insets.bottom, 24) },
        ]}
      >
        <Pressable
          style={styles.button}
          onPress={onPress}
          accessibilityRole="button"
          accessibilityLabel="Back to history"
        >
          <ChevronLeft size={16} strokeWidth={2.5} color={colors.ink} />
          <Text style={styles.buttonText}>Back to history</Text>
        </Pressable>
      </View>
    </BlurView>
  );
}

const styles = StyleSheet.create({
  blurContainer: {
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
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 14,
    paddingHorizontal: 24,
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: colors.borderStrong,
    borderRadius: radii.pill,
  },
  buttonText: {
    fontFamily: 'InterTight-Bold',
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: -0.3,
    color: colors.ink,
  },
});
