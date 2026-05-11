/**
 * Post Perk Screen
 * Business-side flow for creating + publishing a new perk.
 * Three states: form -> preview -> success
 */

import React, { useState } from 'react';
import { View, Pressable, Text, StyleSheet, StatusBar } from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ChevronLeft } from 'lucide-react-native';
import { colors, typography } from '@/constants/theme';
import type { PostPerkFormState } from '@/components/business/post-perk/types';
import { PostPerkForm } from '@/components/business/post-perk/PostPerkForm';
import { PreviewScreen } from '@/components/business/post-perk/PreviewScreen';
import { PublishSuccess } from '@/components/business/post-perk/PublishSuccess';

type FlowState = 'form' | 'preview' | 'success';

export default function PostPerkScreen() {
  const insets = useSafeAreaInsets();
  const [flowState, setFlowState] = useState<FlowState>('form');
  const [formData, setFormData] = useState<PostPerkFormState | null>(null);

  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/(business)');
    }
  };

  const handlePreview = (data: PostPerkFormState) => {
    setFormData(data);
    setFlowState('preview');
  };

  const handleBackToEdit = () => {
    setFlowState('form');
  };

  const handlePublish = () => {
    // Mock publish - no backend write, just transition to success
    setFlowState('success');
  };

  const handleViewPerk = () => {
    // For MVP, route back to dashboard (no real perk ID to navigate to)
    router.replace('/(business)');
  };

  const handleBackToDashboard = () => {
    router.replace('/(business)');
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* Form state with header */}
      {flowState === 'form' && (
        <View style={styles.formContainer}>
          {/* Header */}
          <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
            <Pressable style={styles.backButton} onPress={handleBack}>
              <ChevronLeft size={24} strokeWidth={2} color={colors.ink} />
            </Pressable>
            <Text style={styles.headerTitle}>Post a perk</Text>
            <View style={styles.headerSpacer} />
          </View>

          {/* Form */}
          <PostPerkForm onPreview={handlePreview} />
        </View>
      )}

      {flowState === 'preview' && formData && (
        <PreviewScreen
          formData={formData}
          onEdit={handleBackToEdit}
          onPublish={handlePublish}
        />
      )}

      {flowState === 'success' && formData && (
        <PublishSuccess
          formData={formData}
          onViewPerk={handleViewPerk}
          onBackToDashboard={handleBackToDashboard}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  formContainer: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
    backgroundColor: colors.surface,
  },
  headerTitle: {
    ...typography.tileTitle,
    color: colors.ink,
  },
  headerSpacer: {
    width: 40,
  },
});
