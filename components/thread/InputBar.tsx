/**
 * InputBar Component
 * Compose and send message bar with attach button.
 *
 * Supports disabled state for completed deals with caption below.
 */

import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Paperclip, Send } from 'lucide-react-native';
import { colors, shadows } from '@/constants/theme';

interface InputBarProps {
  onSend: (text: string) => void;
  onAttach?: () => void;
  /** When true, input and buttons are disabled */
  disabled?: boolean;
  /** Caption shown below input when disabled (e.g., "DEAL CLOSED · RATE TO FINISH") */
  disabledCaption?: string;
}

export function InputBar({
  onSend,
  onAttach,
  disabled = false,
  disabledCaption,
}: InputBarProps) {
  const insets = useSafeAreaInsets();
  const [draft, setDraft] = useState('');

  const hasContent = draft.trim().length > 0;
  const canSend = hasContent && !disabled;

  const handleSend = () => {
    if (!canSend) return;
    onSend(draft.trim());
    setDraft('');
  };

  const handleAttach = () => {
    if (disabled) return;
    // No-op for MVP
    onAttach?.();
  };

  return (
    <View style={styles.wrapper}>
      <View style={[styles.container, { paddingBottom: insets.bottom + 10 }]}>
        {/* Attach button */}
        <Pressable
          style={[styles.attachButton, disabled && styles.attachButtonDisabled]}
          onPress={handleAttach}
          disabled={disabled}
          accessibilityRole="button"
          accessibilityLabel="Attach file"
          accessibilityState={{ disabled }}
        >
          <Paperclip size={20} color={colors.inkMuted} strokeWidth={2} />
        </Pressable>

        {/* Input container */}
        <View
          style={[
            styles.inputContainer,
            hasContent && !disabled && styles.inputContainerActive,
            disabled && styles.inputContainerDisabled,
          ]}
        >
          <TextInput
            style={[styles.input, disabled && styles.inputDisabled]}
            value={draft}
            onChangeText={setDraft}
            placeholder="Type a message..."
            placeholderTextColor={colors.inkSubtle}
            multiline
            maxLength={1000}
            editable={!disabled}
          />
        </View>

        {/* Send button */}
        <Pressable
          style={[
            styles.sendButton,
            canSend ? styles.sendButtonActive : styles.sendButtonDisabled,
          ]}
          onPress={handleSend}
          disabled={!canSend}
          accessibilityRole="button"
          accessibilityLabel="Send message"
          accessibilityState={{ disabled: !canSend }}
        >
          <Send
            size={20}
            color={canSend ? colors.bg : colors.inkMuted}
            strokeWidth={2}
          />
        </Pressable>
      </View>

      {/* Disabled caption */}
      {disabled && disabledCaption && (
        <Text style={[styles.disabledCaption, { paddingBottom: insets.bottom > 0 ? 0 : 8 }]}>
          {disabledCaption}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: colors.bg,
  },
  container: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 10,
    backgroundColor: colors.bg,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: 10,
    paddingHorizontal: 14,
  },
  attachButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  attachButtonDisabled: {
    opacity: 0.4,
  },
  inputContainer: {
    flex: 1,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 22,
    paddingHorizontal: 16,
    paddingVertical: 11,
    minHeight: 44,
    justifyContent: 'center',
  },
  inputContainerActive: {
    borderColor: colors.borderStrong,
  },
  inputContainerDisabled: {
    opacity: 0.4,
  },
  input: {
    fontFamily: 'InterTight-Regular',
    fontSize: 15,
    fontWeight: '400',
    color: colors.ink,
    maxHeight: 100,
    padding: 0,
  },
  inputDisabled: {
    color: colors.inkMuted,
  },
  sendButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendButtonDisabled: {
    backgroundColor: colors.surfaceAlt,
    borderWidth: 1,
    borderColor: colors.border,
  },
  sendButtonActive: {
    backgroundColor: colors.accent,
    ...shadows.accentGlow,
  },
  disabledCaption: {
    fontFamily: 'JetBrainsMono-Medium',
    fontSize: 9,
    fontWeight: '500',
    letterSpacing: 1.62, // 0.18em
    textTransform: 'uppercase',
    color: colors.inkSubtle,
    textAlign: 'center',
    paddingTop: 8,
  },
});
