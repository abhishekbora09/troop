// components/TrudoChatbot.tsx

import React from 'react';
import { BaseChatbot } from './BaseChatbot';
import type { Message } from '@/types/chatbot'; // Import Message type

export function TrudoChatbot() {
  const initialMessages: Message[] = [
    { 
      id: 1, 
      sender: 'trudo', 
      content: "Hello! I'm Trudo, your personal AI nutritionist. How can I assist you with your nutrition goals today?" 
    }
  ];

  return (
    <BaseChatbot
      chatbot="trudo"
      initialMessages={initialMessages}
      avatarSrc="/images/trudo_avatar2.png"
      placeholderText="Ask Trudo about nutrition..."
    />
  );
}
