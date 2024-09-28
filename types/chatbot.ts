// types/chatbot.ts

export type Chatbot = 'noori' | 'frank' | 'trudo';

export type Message = {
  id: number;
  sender: 'user' | Chatbot;
  content: string;
  attachment?: string;
};

export interface ChatbotConfig {
  systemPrompt: string;
  model: string;
  maxTokens: number;
  temperature: number;
  top_p: number;
  stream: boolean;
}
