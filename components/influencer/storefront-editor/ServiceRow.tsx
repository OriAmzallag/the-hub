/**
 * ServiceRow Component
 * Single service row mirroring the public storefront ServiceRow:
 * name + (platform · ⏱ delivery) meta line on the left, ₪price + edit
 * pencil on the right.
 */

import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Clock, Pencil } from 'lucide-react-native';
import { colors, recipes } from '@/constants/theme';

interface ServiceRowProps {
  name: string;
  platform: string;
  delivery: string;
  price: number;
  onEdit: () => void;
}

export function ServiceRow({
  name,
  platform,
  delivery,
  price,
  onEdit,
}: ServiceRowProps) {
  return (
    <View style={styles.container}>
      <View style={styles.leftContent}>
        <Text style={styles.serviceName} numberOfLines={1}>
          {name}
        </Text>
        <View style={styles.metaRow}>
          <Text style={styles.platform}>{platform}</Text>
          <Text style={styles.separator}>·</Text>
          <View style={styles.deliveryRow}>
            <Clock size={12} strokeWidth={2} color={colors.inkMuted} />
            <Text style={styles.delivery}>{delivery}</Text>
          </View>
        </View>
      </View>

      <View style={styles.rightContent}>
        <Text style={styles.price}>₪{price}</Text>
        <Pressable
          onPress={onEdit}
          hitSlop={12}
          style={styles.editButton}
          accessibilityRole="button"
          accessibilityLabel={`Edit ${name} service`}
        >
          <Pencil size={14} color={colors.inkMuted} />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...recipes.surfaceTile,
    paddingVertical: 16,
    paddingHorizontal: 18,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  leftContent: {
    flex: 1,
  },
  serviceName: {
    fontFamily: 'InterTight-Bold',
    fontSize: 17,
    fontWeight: '700',
    letterSpacing: -0.51,
    color: colors.ink,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
    gap: 6,
  },
  platform: {
    fontFamily: 'JetBrainsMono-Medium',
    fontSize: 9.5,
    fontWeight: '500',
    letterSpacing: 1.425,
    textTransform: 'uppercase',
    color: colors.inkMuted,
  },
  separator: {
    fontFamily: 'JetBrainsMono-Medium',
    fontSize: 9.5,
    color: colors.inkSubtle,
  },
  deliveryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  delivery: {
    fontFamily: 'JetBrainsMono-Medium',
    fontSize: 9.5,
    fontWeight: '500',
    letterSpacing: 1.425,
    textTransform: 'uppercase',
    color: colors.inkMuted,
  },
  rightContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    marginLeft: 12,
  },
  price: {
    fontFamily: 'InterTight-Bold',
    fontSize: 22,
    fontWeight: '700',
    letterSpacing: -0.77,
    color: colors.ink,
  },
  editButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
