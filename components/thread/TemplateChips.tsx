/**
 * TemplateChips Component
 * Horizontal scrollable quick-reply chips
 */

import React from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet } from 'react-native';
import { MessageCircle } from 'lucide-react-native';
import { colors } from '@/constants/theme';
import type { TemplateChip } from '@/types/thread';

interface TemplateChipsProps {
  templates: TemplateChip[];
  onChipPress: (template: TemplateChip) => void;
}

export function TemplateChips({ templates, onChipPress }: TemplateChipsProps) {
  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {templates.map((template) => (
          <Pressable
            key={template.id}
            style={[
              styles.chip,
              template.isHandoff && styles.chipHandoff,
            ]}
            onPress={() => onChipPress(template)}
            accessibilityRole="button"
            accessibilityLabel={template.label}
          >
            {template.isHandoff && (
              <MessageCircle size={13} color={colors.accent} strokeWidth={2} />
            )}
            <Text
              style={[
                styles.chipText,
                template.isHandoff && styles.chipTextHandoff,
              ]}
            >
              {template.label}
            </Text>
          </Pressable>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderTopWidth: 1,
    borderTopColor: colors.border,
    backgroundColor: colors.bg,
    paddingVertical: 10,
  },
  scrollContent: {
    paddingHorizontal: 14,
    gap: 8,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 100,
    paddingVertical: 9,
    paddingHorizontal: 14,
  },
  chipHandoff: {
    backgroundColor: colors.accentSoft,
    borderColor: colors.accentBorder,
  },
  chipText: {
    fontFamily: 'InterTight-Medium',
    fontSize: 13,
    fontWeight: '500',
    color: colors.ink,
  },
  chipTextHandoff: {
    color: colors.accent,
  },
});
