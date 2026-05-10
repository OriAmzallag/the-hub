/**
 * ServiceRow Component
 * Single service row with name, platform badge, delivery, price, and edit button.
 */

import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Pencil } from 'lucide-react-native';
import { colors, typography, recipes } from '@/constants/theme';

interface ServiceRowProps {
  name: string;
  platform: string;
  delivery: string;
  price: number;
  onEdit: () => void;
}

export function ServiceRow({ name, platform, delivery, price, onEdit }: ServiceRowProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.name} numberOfLines={1}>
        {name}
      </Text>
      <View style={styles.platformBadge}>
        <Text style={styles.platformText}>{platform}</Text>
      </View>
      <Text style={styles.delivery}>{delivery}</Text>
      <Text style={styles.price}>{price}</Text>
      <Pressable
        onPress={onEdit}
        hitSlop={12}
        style={styles.editButton}
        accessibilityRole="button"
        accessibilityLabel={`Edit ${name} service`}
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
    flex: 1,
  },
  platformBadge: {
    marginLeft: 8,
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 6,
    backgroundColor: colors.surfaceAlt,
  },
  platformText: {
    ...typography.monoBadge,
    color: colors.inkMuted,
  },
  delivery: {
    ...typography.monoStatus,
    color: colors.inkMuted,
    marginLeft: 12,
  },
  price: {
    ...typography.rowSecondary,
    color: colors.ink,
    marginLeft: 12,
  },
  editButton: {
    marginLeft: 12,
  },
});
