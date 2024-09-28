// components/FrankChatbot.tsx

import React from 'react';
import { BaseChatbot } from './BaseChatbot';
import type { Message } from '@/types/chatbot'; // Import Message type

export function FrankChatbot() {
  const initialMessages: Message[] = [
    { 
      id: 1, 
      sender: 'frank', 
      content: "Hello! I'm Frank, your personal AI nutritionist. How can I assist you with your nutrition goals today?" 
    }
  ];

  return (
    <BaseChatbot
      chatbot="frank"
      initialMessages={initialMessages}
      avatarSrc="/images/frank_avatar2.png"
      placeholderText="Ask Frank about nutrition..."
    />
  );
}
