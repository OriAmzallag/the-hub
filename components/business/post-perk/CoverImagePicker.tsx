/**
 * CoverImagePicker Component
 * Dashed empty tile or filled image with change pill.
 */

import React from 'react';
import {
  View,
  Text,
  Image,
  Pressable,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { Camera } from 'lucide-react-native';
import { colors, radii, typography } from '@/constants/theme';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const TILE_WIDTH = SCREEN_WIDTH - 40; // 20px padding on each side
const TILE_HEIGHT = TILE_WIDTH * 0.75; // 4:3 aspect ratio

interface CoverImagePickerProps {
  value: string | null;
  onPress: () => void;
}

export function CoverImagePicker({ value, onPress }: CoverImagePickerProps) {
  if (value) {
    return (
      <Pressable style={styles.container} onPress={onPress}>
        <Image source={{ uri: value }} style={styles.image} />
        <View style={styles.changePill}>
          <Camera size={14} strokeWidth={2.2} color={colors.ink} />
          <Text style={styles.changeText}>Change</Text>
        </View>
      </Pressable>
    );
  }

  return (
    <Pressable style={[styles.container, styles.empty]} onPress={onPress}>
      <View style={styles.emptyContent}>
        <Camera size={24} strokeWidth={2} color={colors.inkMuted} />
        <Text style={styles.emptyLabel}>ADD COVER IMAGE</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    width: TILE_WIDTH,
    height: TILE_HEIGHT,
    borderRadius: radii.card,
    overflow: 'hidden',
    position: 'relative',
  },
  empty: {
    backgroundColor: colors.surfaceAlt,
    borderWidth: 1,
    borderColor: colors.borderStrong,
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyContent: {
    alignItems: 'center',
    gap: 10,
  },
  emptyLabel: {
    ...typography.monoLabel,
    color: colors.inkMuted,
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  changePill: {
    position: 'absolute',
    bottom: 12,
    right: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: colors.bgOverlay85,
    borderRadius: radii.pill,
  },
  changeText: {
    fontFamily: 'JetBrainsMono-Medium',
    fontSize: 9,
    fontWeight: '500',
    letterSpacing: 0.9,
    color: colors.ink,
    textTransform: 'uppercase',
  },
});
