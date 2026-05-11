/**
 * EditorTopBar Component
 * Top bar with back button, title, and Save pill.
 */

import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { ChevronLeft } from 'lucide-react-native';
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
        hitSlop={8}
        accessibilityRole="button"
        accessibilityLabel="Go back"
      >
        <ChevronLeft size={18} color={colors.ink} />
      </Pressable>
      <View
        pointerEvents="none"
        style={[styles.titleWrap, { top: insets.top + 16 }]}
      >
        <Text style={styles.title}>Edit storefront</Text>
      </View>
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
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    backgroundColor: colors.bg,
  },
  backButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  // Title is absolutely positioned so it stays dead-center regardless of
  // the back/save button widths (which differ — back is a 36×36 circle,
  // save grows with its label). `pointerEvents="none"` on the wrap so
  // taps still hit the buttons underneath.
  titleWrap: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 14,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    ...typography.sectionTitle,
    color: colors.ink,
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
