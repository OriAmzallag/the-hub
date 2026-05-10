/**
 * ViewAsPublicCard Component
 * CTA card for influencers to view their public storefront.
 */

import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { ExternalLink, ChevronRight } from 'lucide-react-native';
import { colors, typography, recipes } from '@/constants/theme';

interface ViewAsPublicCardProps {
  onPress: () => void;
}

export function ViewAsPublicCard({ onPress }: ViewAsPublicCardProps) {
  return (
    <Pressable
      style={({ pressed }) => [styles.container, pressed && styles.pressed]}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel="See as a Business sees you, view public storefront"
    >
      <View style={styles.iconTile}>
        <ExternalLink size={18} color={colors.bg} />
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.title}>See as a Business sees you</Text>
        <Text style={styles.caption}>VIEW PUBLIC STOREFRONT</Text>
      </View>
      <ChevronRight size={20} color={colors.accent} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    ...recipes.accentTile,
    marginTop: 24,
    paddingVertical: 14,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  pressed: {
    opacity: 0.7,
  },
  iconTile: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textContainer: {
    marginLeft: 14,
    flex: 1,
  },
  title: {
    ...typography.bannerTitle,
    color: colors.ink,
  },
  caption: {
    ...typography.monoTimestamp,
    color: colors.accent,
    marginTop: 2,
  },
});
