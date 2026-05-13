/**
 * Inquiry Thread Screen
 * Shared conversation view for Business and Influencer personas.
 *
 * Route: /inquiries/[threadId]
 * Entry: ThreadRow tap from Inquiries tab (both personas)
 *
 * URL params:
 *   - threadId: Thread identifier (required)
 *   - viewerRole: 'business' | 'influencer' (optional, defaults to 'business')
 */

import React, { useState, useEffect, useCallback } from 'react';
import { View, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { colors } from '@/constants/theme';
import {
  TopBar,
  DealContextCard,
  MessageList,
  TemplateChips,
  InputBar,
} from '@/components/thread';
import {
  getThread,
  getCounterparty,
  getTemplates,
} from '@/constants/mockThread';
import type { ViewerRole, ThreadMessage, TemplateChip } from '@/types/thread';

/**
 * Format current time as HH:MM
 */
function formatTime(): string {
  const d = new Date();
  const h = d.getHours().toString().padStart(2, '0');
  const m = d.getMinutes().toString().padStart(2, '0');
  return `${h}:${m}`;
}

export default function InquiryThreadScreen() {
  // Route params
  const { threadId, viewerRole: roleParam } = useLocalSearchParams<{
    threadId: string;
    viewerRole?: string;
  }>();

  // Resolve viewer role from param (default to business)
  const viewerRole: ViewerRole =
    roleParam === 'influencer' ? 'influencer' : 'business';

  // Get thread data with role-aware side swapping
  const thread = getThread(threadId || '', viewerRole);

  // Local state for messages and handoff
  const [messages, setMessages] = useState<ThreadMessage[]>(
    thread?.messages || []
  );
  const [handoffState, setHandoffState] = useState<
    null | 'pending' | 'accepted'
  >(thread?.handoffState || null);

  // Get counterparty for display
  const counterparty = thread ? getCounterparty(thread, viewerRole) : null;

  // Get role-specific templates
  const templates = getTemplates(viewerRole);

  /**
   * Send a new message
   */
  const sendMessage = useCallback((text: string) => {
    const newMessage: ThreadMessage = {
      id: `msg-${Date.now()}`,
      type: 'message',
      side: 'me',
      text,
      timestamp: formatTime(),
      read: false,
    };
    setMessages((prev) => [...prev, newMessage]);
  }, []);

  /**
   * Offer WhatsApp handoff
   */
  const offerWhatsAppHandoff = useCallback(() => {
    const handoffOffer: ThreadMessage = {
      id: `handoff-${Date.now()}`,
      type: 'handoff-offer',
      side: 'me',
      timestamp: formatTime(),
    };
    setMessages((prev) => [...prev, handoffOffer]);
    setHandoffState('pending');
  }, []);

  /**
   * Handle template chip press
   */
  const handleChipPress = useCallback(
    (template: TemplateChip) => {
      if (template.isHandoff) {
        offerWhatsAppHandoff();
      } else {
        sendMessage(template.label);
      }
    },
    [sendMessage, offerWhatsAppHandoff]
  );

  /**
   * Demo: Auto-accept handoff after 2.5 seconds
   */
  useEffect(() => {
    if (handoffState === 'pending') {
      const timer = setTimeout(() => {
        const acceptedMessage: ThreadMessage = {
          id: `accepted-${Date.now()}`,
          type: 'handoff-accepted',
          timestamp: formatTime(),
        };
        setMessages((prev) => [...prev, acceptedMessage]);
        setHandoffState('accepted');
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, [handoffState]);

  // Handle missing thread
  if (!thread || !counterparty) {
    // In production, show error state or redirect
    return <View style={styles.container} />;
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={0}
    >
      {/* Top bar with counterparty info */}
      <TopBar counterparty={counterparty} />

      {/* Deal context card */}
      <DealContextCard deal={thread.deal} viewerRole={viewerRole} />

      {/* Message list */}
      <MessageList
        messages={messages}
        counterpartyName={counterparty.name}
        counterpartyFirstName={counterparty.firstName}
        counterpartyPhone={counterparty.phone}
      />

      {/* Template chips */}
      <TemplateChips templates={templates} onChipPress={handleChipPress} />

      {/* Input bar */}
      <InputBar onSend={sendMessage} />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
  },
});
