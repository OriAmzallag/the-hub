/**
 * PhotoAvatar Component
 * 96x96 rounded square avatar with an image.
 */

import React from 'react';
import { StyleSheet } from 'react-native';
import { Image } from 'expo-image';
import { radii } from '@/constants/theme';

interface PhotoAvatarProps {
  uri: string;
}

export function PhotoAvatar({ uri }: PhotoAvatarProps) {
  return (
    <Image
      source={{ uri }}
      style={styles.avatar}
      contentFit="cover"
      cachePolicy="memory-disk"
    />
  );
}

const styles = StyleSheet.create({
  avatar: {
    width: 96,
    height: 96,
    borderRadius: radii.avatarHero,
  },
});
