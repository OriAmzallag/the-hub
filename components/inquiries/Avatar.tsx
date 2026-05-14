/**
 * Avatar Component for Inquiries Screen
 * Dispatcher: renders photo avatar or monogram avatar based on counterparty data.
 * Always a 44x44 rounded square (12px radius, NEVER circle).
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Image } from 'expo-image';
import { colors, radii } from '@/constants/theme';
import type { Counterparty } from '@/types/inquiry';

interface AvatarProps {
  counterparty: Counterparty;
  size?: number;
}

export function Avatar({ counterparty, size = 44 }: AvatarProps) {
  const containerStyle = {
    width: size,
    height: size,
    borderRadius: radii.avatar,
  };

  // Photo avatar (Influencer counterparty in Business view)
  if (counterparty.photo) {
    return (
      <View style={[styles.photoContainer, containerStyle]}>
        <Image
          source={{ uri: counterparty.photo }}
          style={styles.photo}
          contentFit="cover"
          transition={200}
          accessibilityLabel={`${counterparty.name}'s photo`}
        />
      </View>
    );
  }

  // Monogram avatar (Business counterparty in Influencer view)
  if (counterparty.monogram) {
    return (
      <View
        style={[styles.monogramContainer, containerStyle]}
        accessibilityLabel={`${counterparty.name} monogram`}
      >
        <Text style={styles.monogramText}>{counterparty.monogram}</Text>
      </View>
    );
  }

  // Fallback: empty monogram with first two letters of name
  const fallbackMonogram = counterparty.name
    .split(' ')
    .map((word) => word[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return (
    <View
      style={[styles.monogramContainer, containerStyle]}
      accessibilityLabel={`${counterparty.name} monogram`}
    >
      <Text style={styles.monogramText}>{fallbackMonogram}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  photoContainer: {
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.borderStrong,
  },
  photo: {
    width: '100%',
    height: '100%',
  },
  monogramContainer: {
    backgroundColor: colors.surfaceAlt,
    alignItems: 'center',
    justifyContent: 'center',
  },
  monogramText: {
    fontFamily: 'InterTight-ExtraBold',
    fontSize: 16,
    fontWeight: '800',
    color: colors.ink,
  },
});
