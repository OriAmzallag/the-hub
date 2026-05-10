/**
 * ServicesList Component
 * Displays selected services with order badges and remove functionality.
 * Shows empty state when all services are removed.
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '@/constants/theme';
import type { TalentService } from '@/types/talent';
import { SectionHeader } from './SectionHeader';
import { ServiceLineItem } from './ServiceLineItem';

interface ServicesListProps {
  services: TalentService[];
  onRemove: (id: number) => void;
}

export function ServicesList({ services, onRemove }: ServicesListProps) {
  const isEmpty = services.length === 0;

  return (
    <View style={styles.section}>
      <SectionHeader
        title="Services"
        hint={isEmpty ? undefined : `${services.length} selected`}
      />

      {isEmpty ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>
            ALL SERVICES REMOVED — GO BACK TO ADD SOME
          </Text>
        </View>
      ) : (
        <View style={styles.card}>
          {services.map((service, index) => (
            <ServiceLineItem
              key={service.id}
              service={service}
              index={index + 1}
              onRemove={() => onRemove(service.id)}
            />
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    marginBottom: 24,
  },
  card: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 14,
    paddingVertical: 16,
    paddingHorizontal: 14,
    gap: 8,
  },
  emptyContainer: {
    borderWidth: 1,
    borderColor: colors.borderStrong,
    borderStyle: 'dashed',
    borderRadius: 14,
    paddingVertical: 24,
    paddingHorizontal: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    fontFamily: 'JetBrainsMono-Medium',
    fontSize: 10,
    fontWeight: '500',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    color: colors.inkMuted,
    textAlign: 'center',
  },
});
