/**
 * SignOutButton Component
 * Decline-styled outline button for sign out action.
 */

import React from 'react';
import { Text, Pressable, StyleSheet } from 'react-native';
import { LogOut } from 'lucide-react-native';
import { colors, typography, radii } from '@/constants/theme';

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
  // Full-width card-radius outline matching the reference. Border uses
  // borderStrong (subtle, neutral) — only the icon + label render in
  // the warm `colors.decline` tone, so the destructive intent reads
  // through the text/icon, not a loud border.
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: colors.borderStrong,
    borderRadius: radii.card,
    marginTop: 16,
    gap: 8,
  },
  text: {
    ...typography.rowSecondary,
    color: colors.decline,
  },
});
