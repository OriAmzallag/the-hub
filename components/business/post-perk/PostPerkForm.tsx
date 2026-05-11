/**
 * PostPerkForm Component
 * Main form with all sections for creating a perk.
 */

import React, { useState } from 'react';
import { View, ScrollView, Pressable, Text, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ArrowRight } from 'lucide-react-native';
import { colors, radii } from '@/constants/theme';
import type { PostPerkFormState, FormDeliverable } from './types';
import { INITIAL_FORM_STATE } from './types';
import { CoverImagePicker } from './CoverImagePicker';
import { BasicsFields } from './BasicsFields';
import { CategoryChips } from './CategoryChips';
import { ValueField } from './ValueField';
import { DeliverablesList } from './DeliverablesList';
import { LogisticsFields } from './LogisticsFields';
import { DeliverableSheet } from './DeliverableSheet';

interface PostPerkFormProps {
  onPreview: (formData: PostPerkFormState) => void;
}

// Mock cover images for development (until expo-image-picker is added)
const MOCK_COVER_IMAGES = [
  'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&q=80',
  'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800&q=80',
  'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&q=80',
  'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800&q=80',
];

export function PostPerkForm({ onPreview }: PostPerkFormProps) {
  const insets = useSafeAreaInsets();
  const [formState, setFormState] =
    useState<PostPerkFormState>(INITIAL_FORM_STATE);

  // Deliverable sheet state
  const [sheetOpen, setSheetOpen] = useState(false);
  const [sheetMode, setSheetMode] = useState<'add' | 'edit'>('add');
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  // Mock image picker (until expo-image-picker is integrated)
  const handleImagePick = () => {
    // For development: cycle through mock images or set a random one
    const randomImage =
      MOCK_COVER_IMAGES[Math.floor(Math.random() * MOCK_COVER_IMAGES.length)];
    setFormState((prev) => ({
      ...prev,
      coverImage: prev.coverImage ? null : randomImage,
    }));
  };

  // Deliverable handlers
  const handleAddDeliverable = () => {
    setSheetMode('add');
    setEditingIndex(null);
    setSheetOpen(true);
  };

  const handleEditDeliverable = (index: number) => {
    setSheetMode('edit');
    setEditingIndex(index);
    setSheetOpen(true);
  };

  const handleSaveDeliverable = (
    data: Omit<FormDeliverable, 'id'>
  ) => {
    if (sheetMode === 'add') {
      const newDeliverable: FormDeliverable = {
        ...data,
        id: `del-${Date.now()}`,
      };
      setFormState((prev) => ({
        ...prev,
        deliverables: [...prev.deliverables, newDeliverable],
      }));
    } else if (editingIndex !== null) {
      setFormState((prev) => ({
        ...prev,
        deliverables: prev.deliverables.map((d, i) =>
          i === editingIndex ? { ...d, ...data } : d
        ),
      }));
    }
    setSheetOpen(false);
  };

  const handleRemoveDeliverable = () => {
    if (editingIndex !== null) {
      setFormState((prev) => ({
        ...prev,
        deliverables: prev.deliverables.filter((_, i) => i !== editingIndex),
      }));
    }
    setSheetOpen(false);
  };

  // Validation
  const canPreview =
    formState.coverImage !== null &&
    formState.title.length > 0 &&
    formState.categories.length > 0 &&
    formState.value !== null &&
    formState.deliverables.length > 0 &&
    formState.maxClaims !== null &&
    formState.expiresOn !== '';

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Cover image */}
        <View style={styles.section}>
          <CoverImagePicker
            value={formState.coverImage}
            onPress={handleImagePick}
          />
        </View>

        {/* Basics */}
        <View style={styles.section}>
          <BasicsFields
            title={formState.title}
            description={formState.description}
            onTitleChange={(title) =>
              setFormState((prev) => ({ ...prev, title }))
            }
            onDescriptionChange={(description) =>
              setFormState((prev) => ({ ...prev, description }))
            }
          />
        </View>

        {/* Categories */}
        <View style={styles.section}>
          <CategoryChips
            selected={formState.categories}
            onChange={(categories) =>
              setFormState((prev) => ({ ...prev, categories }))
            }
          />
        </View>

        {/* Value */}
        <View style={styles.section}>
          <ValueField
            value={formState.value}
            onChange={(value) => setFormState((prev) => ({ ...prev, value }))}
          />
        </View>

        {/* Deliverables */}
        <View style={styles.section}>
          <DeliverablesList
            deliverables={formState.deliverables}
            onEdit={handleEditDeliverable}
            onAdd={handleAddDeliverable}
          />
        </View>

        {/* Logistics */}
        <View style={styles.section}>
          <LogisticsFields
            maxClaims={formState.maxClaims}
            deliveryDeadline={formState.deliveryDeadline}
            expiresOn={formState.expiresOn}
            onMaxClaimsChange={(maxClaims) =>
              setFormState((prev) => ({ ...prev, maxClaims }))
            }
            onDeliveryDeadlineChange={(deliveryDeadline) =>
              setFormState((prev) => ({ ...prev, deliveryDeadline }))
            }
            onExpiresOnChange={(expiresOn) =>
              setFormState((prev) => ({ ...prev, expiresOn }))
            }
          />
        </View>
      </ScrollView>

      {/* Sticky footer */}
      <View
        style={[
          styles.footer,
          { paddingBottom: Math.max(insets.bottom, 22) },
        ]}
      >
        <Pressable
          style={[
            styles.previewButton,
            !canPreview && styles.previewButtonDisabled,
          ]}
          onPress={() => canPreview && onPreview(formState)}
          disabled={!canPreview}
        >
          <Text style={styles.previewButtonText}>Preview</Text>
          <ArrowRight size={16} strokeWidth={2.5} color={colors.bg} />
        </Pressable>
      </View>

      {/* Deliverable sheet */}
      <DeliverableSheet
        isOpen={sheetOpen}
        mode={sheetMode}
        initialData={
          editingIndex !== null
            ? formState.deliverables[editingIndex]
            : undefined
        }
        onClose={() => setSheetOpen(false)}
        onSave={handleSaveDeliverable}
        onRemove={handleRemoveDeliverable}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  section: {
    paddingHorizontal: 20,
    paddingTop: 24,
  },
  footer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: colors.bgOverlay94,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: 12,
    paddingHorizontal: 16,
  },
  previewButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 16,
    backgroundColor: colors.accent,
    borderRadius: radii.pill,
    shadowColor: colors.accent,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 24,
    elevation: 8,
  },
  previewButtonDisabled: {
    opacity: 0.5,
    shadowOpacity: 0,
    elevation: 0,
  },
  previewButtonText: {
    fontFamily: 'InterTight-Bold',
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: -0.3,
    color: colors.bg,
  },
});
