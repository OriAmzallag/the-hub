/**
 * SignOutButton Component
 * Decline-styled outline button for sign out action.
 */

import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { LogOut } from 'lucide-react-native';
import { colors, typography, recipes } from '@/constants/theme';

interface SignOutButtonProps {
  onPress?: () => void;
}

export function SignOutButton({ onPress }: SignOutButtonProps) {
  return (
    <Pressable
      style={styles.button}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel="Sign out of The Hub"
    >
      <LogOut size={18} color={colors.decline} />
      <Text style={styles.text}>Sign out</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    ...recipes.declineButton,
    paddingVertical: 12,
    paddingHorizontal: 24,
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
    marginTop: 32,
    gap: 8,
  },
  pressed: {
    opacity: 0.7,
  },
  text: {
    ...typography.rowSecondary,
    color: colors.decline,
  },
});
