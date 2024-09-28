// components/ChatbotContainer.tsx

import React from 'react';
import { BaseChatbot } from './BaseChatbot';
import { Chatbot } from '@/config/chatbotColors'; // Adjust the import path
import type { Message } from '@/types/chatbot';

// Define initial messages outside the component to prevent re-creation on every render
const initialMessages: Record<Chatbot, Message[]> = {
  noori: [
    {
      id: 1,
      sender: 'noori',
      content: "Hello! I'm Noori, your personal AI nutritionist. How can I assist you with your nutrition goals today?",
    },
  ],
  frank: [
    {
      id: 1,
      sender: 'frank',
      content: "Hello! I'm Frank, your personal AI Finance coach. How can I assist you with your finance goals today?",
    },
  ],
  trudo: [
    {
      id: 1,
      sender: 'trudo',
      content: "Hello! I'm Trudo, your personal AI Travel advisor. How can I assist you with your travel goals today?",
    },
  ],
};

// Define avatar sources outside the component
const avatarSrcs: Record<Chatbot, string> = {
  noori: '/images/noori_avatar2.png',
  frank: '/images/frank_avatar2.png',
  trudo: '/images/trudo_avatar2.png',
};

// Define placeholder texts outside the component
const placeholderTexts: Record<Chatbot, string> = {
  noori: 'Ask Noori about Nutrition...',
  frank: 'Ask Frank about Finance...',
  trudo: 'Ask Trudo about Travel...',
};

type ChatbotContainerProps = {
  selectedChatbot: Chatbot;
};

export function ChatbotContainer({ selectedChatbot }: ChatbotContainerProps) {
  return (
    <BaseChatbot
      key={selectedChatbot} // Ensure re-rendering when selectedChatbot changes
      chatbot={selectedChatbot}
      initialMessages={initialMessages[selectedChatbot]}
      avatarSrc={avatarSrcs[selectedChatbot]}
      placeholderText={placeholderTexts[selectedChatbot]}
    />
  );
}
