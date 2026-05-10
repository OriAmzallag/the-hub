/**
 * WhenChips Component
 * 2x2 grid of date selection chips for the booking request.
 */

import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Calendar } from 'lucide-react-native';
import { colors } from '@/constants/theme';
import { DATE_CHIPS } from '@/constants/bookingDateChips';
import type { DateChipId } from '@/types/booking';
import { SectionHeader } from './SectionHeader';

interface WhenChipsProps {
  selected: DateChipId | null;
  onSelect: (id: DateChipId) => void;
}

export function WhenChips({ selected, onSelect }: WhenChipsProps) {
  return (
    <View style={styles.section}>
      <SectionHeader title="When" />

      <View style={styles.grid}>
        {DATE_CHIPS.map((chip) => {
          const isActive = selected === chip.id;
          const isPickDate = chip.id === 'pick';

          return (
            <Pressable
              key={chip.id}
              style={[styles.chip, isActive && styles.chipActive]}
              onPress={() => onSelect(chip.id)}
              accessibilityRole="button"
              accessibilityState={{ selected: isActive }}
              accessibilityLabel={chip.label}
            >
              <View style={styles.labelRow}>
                {isPickDate && (
                  <Calendar
                    size={14}
                    strokeWidth={2}
                    color={isActive ? colors.accent : colors.ink}
                  />
                )}
                <Text style={[styles.label, isActive && styles.labelActive]}>
                  {chip.label}
                </Text>
              </View>
              <Text style={styles.days}>
                {isPickDate ? 'CALENDAR' : chip.days}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    marginBottom: 24,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    width: '48.5%',
    paddingVertical: 14,
    paddingHorizontal: 14,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 14,
  },
  chipActive: {
    backgroundColor: colors.accentSoft,
    borderColor: colors.accentBorder,
    // Ring shadow effect
    shadowColor: colors.accentSoft,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 4,
    elevation: 0,
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  label: {
    fontFamily: 'InterTight-Bold',
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: -0.28,
    color: colors.ink,
  },
  labelActive: {
    color: colors.accent,
  },
  days: {
    fontFamily: 'JetBrainsMono-Medium',
    fontSize: 9.5,
    fontWeight: '500',
    letterSpacing: 1.14,
    textTransform: 'uppercase',
    color: colors.inkMuted,
    marginTop: 4,
  },
});
