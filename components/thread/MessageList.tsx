/**
 * MessageList Component
 * Scrollable container for thread messages with auto-scroll
 */

import React, { useRef, useEffect } from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { colors } from '@/constants/theme';
import { SystemMessage } from './SystemMessage';
import { MessageBubble } from './MessageBubble';
import { HandoffOfferCard } from './HandoffOfferCard';
import { HandoffAcceptedCard } from './HandoffAcceptedCard';
import type { ThreadMessage } from '@/types/thread';

interface MessageListProps {
  messages: ThreadMessage[];
  counterpartyName: string;
  counterpartyFirstName: string;
  counterpartyPhone: string;
}

/**
 * Determines if a system message should use accent styling.
 * Currently only "mark done" messages get accent treatment.
 */
function isAccentSystemMessage(text: string): boolean {
  const lowerText = text.toLowerCase();
  return lowerText.includes('marked the deal as done');
}

export function MessageList({
  messages,
  counterpartyName,
  counterpartyFirstName,
  counterpartyPhone,
}: MessageListProps) {
  const scrollRef = useRef<ScrollView>(null);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    const timer = setTimeout(() => {
      scrollRef.current?.scrollToEnd({ animated: true });
    }, 100);
    return () => clearTimeout(timer);
  }, [messages]);

  return (
    <ScrollView
      ref={scrollRef}
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
    >
      {messages.map((message) => {
        switch (message.type) {
          case 'system':
            return (
              <SystemMessage
                key={message.id}
                text={message.text || ''}
                timestamp={message.timestamp}
                icon={message.icon}
                accent={isAccentSystemMessage(message.text || '')}
              />
            );

          case 'message':
            return <MessageBubble key={message.id} message={message} />;

          case 'handoff-offer':
            return (
              <HandoffOfferCard
                key={message.id}
                counterpartyName={counterpartyName}
              />
            );

          case 'handoff-accepted':
            return (
              <HandoffAcceptedCard
                key={message.id}
                counterpartyFirstName={counterpartyFirstName}
                counterpartyPhone={counterpartyPhone}
              />
            );

          default:
            return null;
        }
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  content: {
    paddingTop: 8,
    paddingBottom: 16,
  },
});
