/**
 * PlatformRow Component
 * Single platform row with icon, name, followers, and edit button.
 */

import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Instagram, Youtube, Pencil } from 'lucide-react-native';
import { colors, typography, recipes } from '@/constants/theme';

// Simple TikTok icon component since lucide doesn't have it
function TikTokIcon({ size, color }: { size: number; color: string }) {
  return (
    <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
      <Text style={{ fontSize: size * 0.7, color }}>T</Text>
    </View>
  );
}

interface PlatformRowProps {
  name: string;
  icon: 'instagram' | 'tiktok' | 'youtube';
  followers: string;
  onEdit: () => void;
}

export function PlatformRow({ name, icon, followers, onEdit }: PlatformRowProps) {
  const IconComponent = icon === 'instagram'
    ? Instagram
    : icon === 'youtube'
    ? Youtube
    : TikTokIcon;

  return (
    <View style={styles.container}>
      <IconComponent size={24} color={colors.ink} />
      <Text style={styles.name}>{name}</Text>
      <Text style={styles.followers}>{followers}</Text>
      <Pressable
        onPress={onEdit}
        hitSlop={12}
        accessibilityRole="button"
        accessibilityLabel={`Edit ${name}`}
      >
        <Pencil size={16} color={colors.inkMuted} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...recipes.surfaceTile,
    paddingVertical: 14,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  name: {
    ...typography.rowTitle,
    color: colors.ink,
    marginLeft: 12,
  },
  followers: {
    ...typography.monoLabel,
    color: colors.inkMuted,
    flex: 1,
    textAlign: 'right',
    marginRight: 12,
  },
});
