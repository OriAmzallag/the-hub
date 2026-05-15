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
 *
 * Mark Done integration (Influencer only, IN_PROGRESS deals):
 *   - Shows MarkDoneTile above InputBar
 *   - Opens MarkDoneSheet on tap
 *   - Posts optional message + system message on confirm
 *   - Shows MarkDoneToast
 *   - Disables input after completion
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
  MarkDoneTile,
  MarkDoneSheet,
  MarkDoneToast,
} from '@/components/mark-done';
import {
  getThread,
  getCounterparty,
  getTemplates,
} from '@/constants/mockThread';
import type { ViewerRole, ThreadMessage, TemplateChip, ThreadDeal } from '@/types/thread';
import type { DealState } from '@/lib/dealLifecycle';

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

  // Local state for messages, handoff, and deal state
  const [messages, setMessages] = useState<ThreadMessage[]>(
    thread?.messages || []
  );
  const [handoffState, setHandoffState] = useState<
    null | 'pending' | 'accepted'
  >(thread?.handoffState || null);
  const [dealState, setDealState] = useState<DealState>(
    thread?.deal.state || 'IN_PROGRESS'
  );

  // Mark Done modal and toast state
  const [showMarkDoneSheet, setShowMarkDoneSheet] = useState(false);
  const [showToast, setShowToast] = useState(false);

  // Get counterparty for display
  const counterparty = thread ? getCounterparty(thread, viewerRole) : null;

  // Get role-specific templates
  const templates = getTemplates(viewerRole);

  // Determine if Mark Done tile should show
  const showMarkDoneTile =
    viewerRole === 'influencer' && dealState === 'IN_PROGRESS';

  // Determine if input should be disabled
  const isInputDisabled =
    dealState === 'COMPLETED' ||
    dealState === 'RATED' ||
    dealState === 'EXPIRED' ||
    dealState === 'DECLINED';

  // Business name for modal
  const businessName = thread?.deal.business.name || 'the business';

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
   * Handle Mark Done confirm
   * Posts optional message (if provided) + system message, updates state, shows toast.
   */
  const handleMarkDoneConfirm = useCallback((finalMessage: string | null) => {
    const timestamp = formatTime();
    const newMessages: ThreadMessage[] = [];

    // If final message provided, add it as a regular message BEFORE system message
    if (finalMessage) {
      newMessages.push({
        id: `msg-final-${Date.now()}`,
        type: 'message',
        side: 'me',
        text: finalMessage,
        timestamp,
        read: false,
      });
    }

    // Add system message for mark done
    // Using 'system' type with special handling in MessageList for accent variant
    newMessages.push({
      id: `sys-markdone-${Date.now()}`,
      type: 'system',
      text: 'You marked the deal as done · Both can rate now',
      timestamp: 'Just now',
      icon: 'check',
    });

    setMessages((prev) => [...prev, ...newMessages]);
    setDealState('COMPLETED');
    setShowMarkDoneSheet(false);
    setShowToast(true);
  }, []);

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

  // Create a modified deal object with current state for DealContextCard
  const currentDeal: ThreadDeal = {
    ...thread.deal,
    state: dealState,
  };

  return (
    <View style={styles.container}>
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={0}
      >
        {/* Top bar with counterparty info */}
        <TopBar counterparty={counterparty} />

        {/* Deal context card - shows current deal state */}
        <DealContextCard deal={currentDeal} viewerRole={viewerRole} />

        {/* Message list */}
        <MessageList
          messages={messages}
          counterpartyName={counterparty.name}
          counterpartyFirstName={counterparty.firstName}
          counterpartyPhone={counterparty.phone}
        />

        {/* Template chips - hide when input disabled */}
        {!isInputDisabled && (
          <TemplateChips templates={templates} onChipPress={handleChipPress} />
        )}

        {/* Mark Done tile - above input, Influencer only, IN_PROGRESS only */}
        {showMarkDoneTile && (
          <View style={styles.markDoneTileContainer}>
            <MarkDoneTile onPress={() => setShowMarkDoneSheet(true)} />
          </View>
        )}

        {/* Input bar */}
        <InputBar
          onSend={sendMessage}
          disabled={isInputDisabled}
          disabledCaption={isInputDisabled ? 'DEAL CLOSED · RATE TO FINISH' : undefined}
        />
      </KeyboardAvoidingView>

      {/* Mark Done Sheet */}
      <MarkDoneSheet
        isOpen={showMarkDoneSheet}
        onClose={() => setShowMarkDoneSheet(false)}
        onConfirm={handleMarkDoneConfirm}
        businessName={businessName}
      />

      {/* Mark Done Toast */}
      <MarkDoneToast
        visible={showToast}
        onDismiss={() => setShowToast(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  keyboardView: {
    flex: 1,
  },
  markDoneTileContainer: {
    paddingHorizontal: 14,
    paddingTop: 10,
    backgroundColor: colors.bg,
  },
});
