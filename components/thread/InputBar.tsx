/**
 * InputBar Component
 * Compose and send message bar with attach button
 */

import React, { useState } from 'react';
import { View, TextInput, Pressable, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Paperclip, Send } from 'lucide-react-native';
import { colors, shadows } from '@/constants/theme';

interface InputBarProps {
  onSend: (text: string) => void;
  onAttach?: () => void;
}

export function InputBar({ onSend, onAttach }: InputBarProps) {
  const insets = useSafeAreaInsets();
  const [draft, setDraft] = useState('');

  const hasContent = draft.trim().length > 0;

  const handleSend = () => {
    if (!hasContent) return;
    onSend(draft.trim());
    setDraft('');
  };

  const handleAttach = () => {
    // No-op for MVP
    onAttach?.();
  };

  return (
    <View style={[styles.container, { paddingBottom: insets.bottom + 10 }]}>
      {/* Attach button */}
      <Pressable
        style={styles.attachButton}
        onPress={handleAttach}
        accessibilityRole="button"
        accessibilityLabel="Attach file"
      >
        <Paperclip size={20} color={colors.inkMuted} strokeWidth={2} />
      </Pressable>

      {/* Input container */}
      <View
        style={[
          styles.inputContainer,
          hasContent && styles.inputContainerActive,
        ]}
      >
        <TextInput
          style={styles.input}
          value={draft}
          onChangeText={setDraft}
          placeholder="Type a message..."
          placeholderTextColor={colors.inkSubtle}
          multiline
          maxLength={1000}
        />
      </View>

      {/* Send button */}
      <Pressable
        style={[
          styles.sendButton,
          hasContent ? styles.sendButtonActive : styles.sendButtonDisabled,
        ]}
        onPress={handleSend}
        disabled={!hasContent}
        accessibilityRole="button"
        accessibilityLabel="Send message"
        accessibilityState={{ disabled: !hasContent }}
      >
        <Send
          size={20}
          color={hasContent ? colors.bg : colors.inkMuted}
          strokeWidth={2}
        />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
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
  input: {
    fontFamily: 'InterTight-Regular',
    fontSize: 15,
    fontWeight: '400',
    color: colors.ink,
    maxHeight: 100,
    padding: 0,
  },
  sendButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendButtonDisabled: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  sendButtonActive: {
    backgroundColor: colors.accent,
    ...shadows.accentGlow,
  },
});
