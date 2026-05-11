/**
 * EditorSection Component
 * Section with title, description, and children.
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, typography } from '@/constants/theme';

interface EditorSectionProps {
  title: string;
  description?: string;
  children: React.ReactNode;
}

export function EditorSection({ title, description, children }: EditorSectionProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      {description && <Text style={styles.description}>{description}</Text>}
      <View style={styles.children}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 32,
  },
  title: {
    ...typography.tileTitle,
    color: colors.ink,
  },
  description: {
    ...typography.bodyPreview,
    color: colors.inkMuted,
    marginTop: 6,
  },
  children: {
    marginTop: 16,
    gap: 8,
  },
});
