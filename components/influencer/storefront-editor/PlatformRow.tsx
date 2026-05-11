/**
 * PlatformRow Component
 * Single platform row with icon, name + handle, follower count + label,
 * and edit affordance. Mirrors the public storefront's PlatformsTile
 * typography (ink bold followers, mono inkMuted label).
 */

import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Instagram, Youtube, Music2, Pencil } from 'lucide-react-native';
import { colors, typography, recipes } from '@/constants/theme';

interface PlatformRowProps {
  name: string;
  icon: 'instagram' | 'tiktok' | 'youtube';
  followers: string;
  onEdit: () => void;
}

const ICONS = {
  instagram: Instagram,
  tiktok: Music2,
  youtube: Youtube,
} as const;

export function PlatformRow({ name, icon, followers, onEdit }: PlatformRowProps) {
  const IconComponent = ICONS[icon];

  return (
    <View style={styles.container}>
      <View style={styles.iconWrap}>
        <IconComponent size={20} strokeWidth={1.8} color={colors.ink} />
      </View>
      <Text style={styles.name}>{name}</Text>
      <View style={styles.followersBlock}>
        <Text style={styles.followers}>{followers}</Text>
        <Text style={styles.followersLabel}>Followers</Text>
      </View>
      <Pressable
        onPress={onEdit}
        hitSlop={12}
        style={styles.editButton}
        accessibilityRole="button"
        accessibilityLabel={`Edit ${name}`}
      >
        <Pencil size={14} color={colors.inkMuted} />
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
  iconWrap: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: colors.surfaceAlt,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  name: {
    ...typography.rowTitle,
    color: colors.ink,
    flex: 1,
    marginLeft: 12,
  },
  followersBlock: {
    alignItems: 'flex-end',
    marginRight: 14,
  },
  followers: {
    ...typography.rowSecondary,
    color: colors.ink,
  },
  followersLabel: {
    ...typography.monoTimestamp,
    color: colors.inkMuted,
    marginTop: 4,
  },
  editButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
