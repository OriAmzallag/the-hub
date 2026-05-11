/**
 * DeliverablesList Component
 * List of deliverable rows with add button.
 */

import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Plus } from 'lucide-react-native';
import { colors, radii, typography } from '@/constants/theme';
import type { FormDeliverable } from './types';
import { DeliverableRow } from './DeliverableRow';

interface DeliverablesListProps {
  deliverables: FormDeliverable[];
  onEdit: (index: number) => void;
  onAdd: () => void;
}

export function DeliverablesList({
  deliverables,
  onEdit,
  onAdd,
}: DeliverablesListProps) {
  return (
    <View style={styles.container}>
      {/* Section header */}
      <Text style={styles.sectionHeader}>WHAT YOU ASK FOR</Text>

      {/* Deliverable rows */}
      <View style={styles.list}>
        {deliverables.map((deliverable, index) => (
          <DeliverableRow
            key={deliverable.id}
            deliverable={deliverable}
            index={index}
            onPress={() => onEdit(index)}
          />
        ))}

        {/* Add button */}
        <Pressable
          style={styles.addButton}
          onPress={onAdd}
          accessibilityRole="button"
          accessibilityLabel="Add deliverable"
        >
          <Plus size={16} strokeWidth={2.2} color={colors.inkMuted} />
          <Text style={styles.addButtonText}>Add deliverable</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 12,
  },
  sectionHeader: {
    ...typography.monoGreeting,
    color: colors.accent,
  },
  list: {
    gap: 8,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    paddingHorizontal: 14,
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: colors.borderStrong,
    borderStyle: 'dashed',
    borderRadius: radii.card,
  },
  addButtonText: {
    fontFamily: 'InterTight-SemiBold',
    fontSize: 14,
    fontWeight: '600',
    letterSpacing: -0.28,
    color: colors.inkMuted,
  },
});
