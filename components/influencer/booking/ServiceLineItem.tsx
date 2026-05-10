/**
 * ServiceLineItem Component
 * Single row in the services list with badge, details, price, and remove button.
 */

import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { X } from 'lucide-react-native';
import { colors } from '@/constants/theme';
import type { InfluencerService } from '@/types/influencer';

interface ServiceLineItemProps {
  service: InfluencerService;
  index: number; // 1-based for display
  onRemove: () => void;
}

export function ServiceLineItem({ service, index, onRemove }: ServiceLineItemProps) {
  const badgeLabel = index.toString().padStart(2, '0');

  return (
    <View style={styles.container}>
      {/* Order badge */}
      <View style={styles.badge}>
        <Text style={styles.badgeText}>{badgeLabel}</Text>
      </View>

      {/* Service details */}
      <View style={styles.details}>
        <Text style={styles.name}>{service.name}</Text>
        <Text style={styles.meta}>
          {service.platform} · {service.delivery}
        </Text>
      </View>

      {/* Price */}
      <Text style={styles.price}>₪{service.price}</Text>

      {/* Remove button */}
      <Pressable
        style={styles.removeButton}
        onPress={onRemove}
        hitSlop={{ top: 8, right: 8, bottom: 8, left: 8 }}
        accessibilityRole="button"
        accessibilityLabel={`Remove ${service.name}`}
      >
        <X size={13} strokeWidth={2.6} color={colors.inkMuted} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  badge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: {
    fontFamily: 'JetBrainsMono-Bold',
    fontSize: 10,
    fontWeight: '700',
    color: colors.bg,
  },
  details: {
    flex: 1,
    gap: 3,
  },
  name: {
    fontFamily: 'InterTight-Bold',
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: -0.375,
    lineHeight: 16.5,
    color: colors.ink,
  },
  meta: {
    fontFamily: 'JetBrainsMono-Medium',
    fontSize: 9.5,
    fontWeight: '500',
    letterSpacing: 1.14,
    textTransform: 'uppercase',
    color: colors.inkMuted,
  },
  price: {
    fontFamily: 'InterTight-Bold',
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: -0.54,
    color: colors.ink,
  },
  removeButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.borderStrong,
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
});
