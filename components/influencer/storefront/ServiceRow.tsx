/**
 * ServiceRow Component
 * Individual service row with selection state and numbered badge.
 */

import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Clock } from 'lucide-react-native';
import { colors, shadows } from '@/constants/theme';
import type { InfluencerService } from '@/types/influencer';

interface ServiceRowProps {
  service: InfluencerService;
  isSelected: boolean;
  selectionIndex: number; // 1-based, -1 if not selected
  onToggle: () => void;
}

export function ServiceRow({
  service,
  isSelected,
  selectionIndex,
  onToggle,
}: ServiceRowProps) {
  const formattedIndex = selectionIndex > 0
    ? selectionIndex.toString().padStart(2, '0')
    : '';

  return (
    <Pressable
      style={[
        styles.container,
        isSelected && styles.containerSelected,
      ]}
      onPress={onToggle}
      accessibilityRole="checkbox"
      accessibilityState={{ checked: isSelected }}
      accessibilityLabel={`${service.name}, ${service.price} shekels, ${service.delivery} delivery`}
    >
      {/* Left content */}
      <View style={styles.leftContent}>
        <Text style={styles.serviceName}>{service.name}</Text>
        <View style={styles.metaRow}>
          <Text style={styles.platform}>{service.platform}</Text>
          <Text style={styles.separator}>{'·'}</Text>
          <View style={styles.deliveryRow}>
            <Clock size={12} strokeWidth={2} color={colors.inkMuted} />
            <Text style={styles.delivery}>{service.delivery}</Text>
          </View>
        </View>
      </View>

      {/* Right content */}
      <View style={styles.rightContent}>
        <Text style={styles.price}>{service.price}</Text>
        <View
          style={[
            styles.selectionCircle,
            isSelected && styles.selectionCircleSelected,
          ]}
        >
          {isSelected && (
            <Text style={styles.selectionIndex}>{formattedIndex}</Text>
          )}
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 14,
    paddingVertical: 16,
    paddingHorizontal: 18,
    marginBottom: 8,
  },
  containerSelected: {
    backgroundColor: colors.accentSoft,
    borderColor: colors.accentBorder,
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
  },
  price: {
    fontFamily: 'InterTight-Bold',
    fontSize: 22,
    fontWeight: '700',
    letterSpacing: -0.77,
    color: colors.ink,
  },
  selectionCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: colors.borderStrong,
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectionCircleSelected: {
    backgroundColor: colors.accent,
    borderWidth: 0,
    ...shadows.sm,
    shadowColor: colors.accent,
    shadowOpacity: 0.4,
    shadowRadius: 6,
  },
  selectionIndex: {
    fontFamily: 'JetBrainsMono-SemiBold',
    fontSize: 10,
    fontWeight: '600',
    letterSpacing: 1,
    color: colors.bg,
  },
});
