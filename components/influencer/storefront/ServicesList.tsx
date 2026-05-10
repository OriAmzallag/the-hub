/**
 * ServicesList Component
 * Multi-select service picker with numbered badges.
 */

import React from 'react';
import { View, StyleSheet } from 'react-native';
import { SectionHeader } from './SectionHeader';
import { ServiceRow } from './ServiceRow';
import type { InfluencerService } from '@/types/influencer';

interface ServicesListProps {
  services: InfluencerService[];
  selectedIds: number[];
  onToggle: (id: number) => void;
}

export function ServicesList({ services, selectedIds, onToggle }: ServicesListProps) {
  const getSelectionIndex = (id: number): number => {
    const idx = selectedIds.indexOf(id);
    return idx === -1 ? -1 : idx + 1;
  };

  return (
    <View style={styles.container}>
      <SectionHeader title="Services" />
      {services.map((service) => (
        <ServiceRow
          key={service.id}
          service={service}
          isSelected={selectedIds.includes(service.id)}
          selectionIndex={getSelectionIndex(service.id)}
          onToggle={() => onToggle(service.id)}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 22,
    paddingTop: 20,
  },
});
