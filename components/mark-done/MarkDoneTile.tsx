/**
 * MarkDoneTile Component
 * Sticky tile in Coordination Thread for marking deal as done.
 *
 * Entry point #1 for Mark Done flow.
 * Visible only when deal is IN_PROGRESS AND viewer is Influencer.
 *
 * Visual spec (from mark-done.reference.jsx):
 * - Container: padding 12/14, radius 12, accentSoft bg, accentBorder border
 * - Icon: 32x32, radius 9, accent bg, check 17/3
 * - Title: display 14/700/-0.025em, ink
 * - Caption: mono 9/0.16em uppercase, inkMuted
 * - Chevron: ArrowRight 14/2.4, accent
 */

import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Check, ArrowRight } from 'lucide-react-native';
import { colors } from '@/constants/theme';

interface MarkDoneTileProps {
  onPress: () => void;
}

export function MarkDoneTile({ onPress }: MarkDoneTileProps) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel="Mark deal as done, when the work is delivered"
    >
      {({ pressed }) => (
        <View style={[styles.container, pressed && styles.containerPressed]}>
          {/* Icon container */}
          <View style={styles.iconContainer}>
            <Check size={17} strokeWidth={3} color={colors.bg} />
          </View>

          {/* Text content */}
          <View style={styles.textContainer}>
            <Text style={styles.title}>Mark deal as done</Text>
            <Text style={styles.caption}>WHEN THE WORK IS DELIVERED</Text>
          </View>

          {/* Chevron */}
          <View style={styles.chevronContainer}>
            <ArrowRight size={14} strokeWidth={2.4} color={colors.accent} />
          </View>
        </View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 14,
    backgroundColor: colors.accentSoft,
    borderWidth: 1,
    borderColor: colors.accentBorder,
    borderRadius: 12,
  },
  containerPressed: {
    transform: [{ scale: 0.99 }],
  },
  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: 9,
    backgroundColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontFamily: 'InterTight-Bold',
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: -0.35, // -0.025em
    color: colors.ink,
    lineHeight: 16.8, // 1.2
  },
  caption: {
    fontFamily: 'JetBrainsMono-Medium',
    fontSize: 9,
    fontWeight: '500',
    letterSpacing: 1.44, // 0.16em
    textTransform: 'uppercase',
    color: colors.inkMuted,
    marginTop: 2,
  },
  chevronContainer: {
    marginLeft: 12,
  },
});
