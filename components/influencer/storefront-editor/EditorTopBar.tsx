/**
 * EditorTopBar Component
 * Top bar with back button, title, and Save pill.
 */

import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { ArrowLeft } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, typography, radii, recipes } from '@/constants/theme';

interface EditorTopBarProps {
  onBack: () => void;
  onSave: () => void;
  hasChanges: boolean;
}

export function EditorTopBar({ onBack, onSave, hasChanges }: EditorTopBarProps) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: insets.top + 16 }]}>
      <Pressable
        style={styles.backButton}
        onPress={onBack}
        hitSlop={12}
        accessibilityRole="button"
        accessibilityLabel="Go back"
      >
        <ArrowLeft size={24} color={colors.ink} />
      </Pressable>
      <Text style={styles.title}>Edit storefront</Text>
      <Pressable
        style={[
          styles.saveButton,
          hasChanges ? styles.saveButtonEnabled : styles.saveButtonDisabled,
        ]}
        onPress={onSave}
        disabled={!hasChanges}
        accessibilityRole="button"
        accessibilityLabel="Save changes"
        accessibilityState={{ disabled: !hasChanges }}
      >
        <Text
          style={[
            styles.saveText,
            hasChanges ? styles.saveTextEnabled : styles.saveTextDisabled,
          ]}
        >
          Save
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  // Vertical metrics match `components/ui/ScreenHeader`:
  // paddingTop = insets.top + 16, paddingBottom: 14. Content height
  // is driven by the tallest child (the Save pill), so the overall
  // box reads at the same height as ScreenHeader on tabs that use it.
  container: {
    paddingHorizontal: 20,
    paddingBottom: 14,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    backgroundColor: colors.bg,
  },
  backButton: {
    padding: 4,
  },
  title: {
    ...typography.sectionTitle,
    color: colors.ink,
    flex: 1,
    marginLeft: 12,
  },
  saveButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: radii.pill,
  },
  saveButtonEnabled: {
    ...recipes.primaryButton,
  },
  saveButtonDisabled: {
    backgroundColor: colors.surfaceAlt,
  },
  saveText: {
    ...typography.rowSecondary,
  },
  saveTextEnabled: {
    color: colors.bg,
  },
  saveTextDisabled: {
    color: colors.inkMuted,
  },
});
