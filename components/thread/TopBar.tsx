/**
 * TopBar Component for Inquiry Thread
 * Back button + counterpart avatar + name + verified badge
 */

import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { ChevronLeft, CheckCircle2 } from 'lucide-react-native';
import { Image } from 'expo-image';
import { colors, typography, radii } from '@/constants/theme';
import type { Party } from '@/types/thread';

interface TopBarProps {
  counterparty: Party;
}

export function TopBar({ counterparty }: TopBarProps) {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
    }
  };

  // Generate monogram fallback from name
  const monogram =
    counterparty.monogram ||
    counterparty.name
      .split(' ')
      .map((word) => word[0])
      .join('')
      .slice(0, 2)
      .toUpperCase();

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.content}>
        {/* Back button */}
        <Pressable
          style={styles.backButton}
          onPress={handleBack}
          accessibilityRole="button"
          accessibilityLabel="Go back"
        >
          <ChevronLeft size={20} color={colors.ink} strokeWidth={2} />
        </Pressable>

        {/* Avatar */}
        {counterparty.photo ? (
          <View style={styles.avatarContainer}>
            <Image
              source={{ uri: counterparty.photo }}
              style={styles.avatarPhoto}
              contentFit="cover"
              transition={200}
            />
          </View>
        ) : (
          <View style={styles.avatarMonogram}>
            <Text style={styles.monogramText}>{monogram}</Text>
          </View>
        )}

        {/* Name + verified badge */}
        <View style={styles.nameContainer}>
          <Text style={styles.name} numberOfLines={1}>
            {counterparty.name}
          </Text>
          {counterparty.verified && (
            <CheckCircle2
              size={13}
              color={colors.accent}
              fill={colors.accent}
              strokeWidth={0}
            />
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.bg,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  content: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    gap: 12,
  },
  backButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarContainer: {
    width: 36,
    height: 36,
    borderRadius: radii.avatar,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.borderStrong,
  },
  avatarPhoto: {
    width: '100%',
    height: '100%',
  },
  avatarMonogram: {
    width: 36,
    height: 36,
    borderRadius: radii.avatar,
    backgroundColor: colors.surfaceAlt,
    borderWidth: 1,
    borderColor: colors.borderStrong,
    alignItems: 'center',
    justifyContent: 'center',
  },
  monogramText: {
    fontFamily: 'InterTight-ExtraBold',
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: -0.52, // -0.04em
    color: colors.ink,
  },
  nameContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  name: {
    ...typography.rowTitle,
    color: colors.ink,
  },
});
