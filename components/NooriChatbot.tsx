// components/NooriChatbot.tsx

import React from 'react';
import { BaseChatbot } from './BaseChatbot';
import type { Message } from '@/types/chatbot'; // Import Message type

export function NooriChatbot() {
  const initialMessages: Message[] = [
    { 
      id: 1, 
      sender: 'noori', 
      content: "Hello! I'm Noori, your personal AI nutritionist. How can I assist you with your nutrition goals today?" 
    }
  ];

  return (
    <BaseChatbot
      chatbot="noori"
      initialMessages={initialMessages}
      avatarSrc="/images/noori_avatar2.png"
      placeholderText="Ask Noori anything about fitness and nutrition..."
    />
  );
}
