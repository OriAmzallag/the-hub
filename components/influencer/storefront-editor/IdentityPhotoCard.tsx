/**
 * IdentityPhotoCard Component
 * Photo edit card with label and change button.
 */

import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Image } from 'expo-image';
import { Camera } from 'lucide-react-native';
import { colors, typography, recipes } from '@/constants/theme';

interface IdentityPhotoCardProps {
  imageUri: string | null;
  onChangePress: () => void;
}

export function IdentityPhotoCard({ imageUri, onChangePress }: IdentityPhotoCardProps) {
  return (
    <View style={styles.container}>
      {imageUri ? (
        <Image
          source={{ uri: imageUri }}
          style={styles.photo}
          contentFit="cover"
          cachePolicy="memory-disk"
        />
      ) : (
        <View style={styles.placeholder} />
      )}
      <View style={styles.textContainer}>
        <Text style={styles.label}>Profile photo</Text>
        <Text style={styles.hint}>First portfolio image</Text>
      </View>
      <Pressable
        style={styles.changeButton}
        onPress={onChangePress}
        accessibilityRole="button"
        accessibilityLabel="Change profile photo"
      >
        <Camera size={12} color={colors.ink} />
        <Text style={styles.changeText}>Change</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...recipes.surfaceTile,
    paddingVertical: 16,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  photo: {
    width: 60,
    height: 60,
    borderRadius: 15,
  },
  placeholder: {
    width: 60,
    height: 60,
    borderRadius: 15,
    backgroundColor: colors.surfaceAlt,
  },
  textContainer: {
    marginLeft: 16,
    flex: 1,
  },
  label: {
    ...typography.rowTitle,
    color: colors.ink,
  },
  hint: {
    ...typography.monoTimestamp,
    color: colors.inkMuted,
    marginTop: 2,
  },
  changeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 999,
    backgroundColor: colors.surfaceAlt,
    borderWidth: 1,
    borderColor: colors.borderStrong,
  },
  changeText: {
    ...typography.rowSecondary,
    fontSize: 12,
    color: colors.ink,
  },
});
