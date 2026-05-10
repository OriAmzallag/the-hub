/**
 * PortfolioGrid Component
 * 3-column grid with cover badge, remove buttons, and add tile.
 */

import React from 'react';
import { View, Text, Pressable, StyleSheet, useWindowDimensions } from 'react-native';
import { Image } from 'expo-image';
import { X, Plus } from 'lucide-react-native';
import { colors, typography, radii } from '@/constants/theme';

interface PortfolioGridProps {
  images: string[];
  onRemove: (index: number) => void;
  onAdd: () => void;
}

export function PortfolioGrid({ images, onRemove, onAdd }: PortfolioGridProps) {
  const { width: screenWidth } = useWindowDimensions();
  // Container padding (20 each side) + gaps (8 * 2)
  const containerWidth = screenWidth - 40 - 16;
  const tileSize = Math.floor(containerWidth / 3);

  return (
    <View style={styles.container}>
      {images.map((uri, index) => (
        <View key={uri} style={[styles.tile, { width: tileSize, height: tileSize }]}>
          <Image
            source={{ uri }}
            style={styles.image}
            contentFit="cover"
            cachePolicy="memory-disk"
          />
          {index === 0 && (
            <View style={styles.coverBadge}>
              <Text style={styles.coverText}>COVER</Text>
            </View>
          )}
          <Pressable
            style={styles.removeButton}
            onPress={() => onRemove(index)}
            hitSlop={8}
            accessibilityRole="button"
            accessibilityLabel={`Remove image ${index + 1}`}
          >
            <X size={14} color={colors.ink} />
          </Pressable>
        </View>
      ))}
      <Pressable
        style={({ pressed }) => [
          styles.addTile,
          { width: tileSize, height: tileSize },
          pressed && styles.pressed,
        ]}
        onPress={onAdd}
        accessibilityRole="button"
        accessibilityLabel="Add portfolio image"
      >
        <Plus size={24} color={colors.inkMuted} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tile: {
    borderRadius: radii.card,
    overflow: 'hidden',
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  coverBadge: {
    position: 'absolute',
    bottom: 8,
    left: 8,
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 6,
    backgroundColor: colors.accent,
  },
  coverText: {
    ...typography.monoBadge,
    color: colors.bg,
  },
  removeButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.bgOverlay70,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addTile: {
    borderRadius: radii.card,
    borderWidth: 1.5,
    borderColor: colors.borderStrong,
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
  },
  pressed: {
    opacity: 0.7,
  },
});
