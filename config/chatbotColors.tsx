// config/chatbotColors.ts

export type Chatbot = 'noori' | 'frank' | 'trudo';

export const chatbotColors: Record<Chatbot, {
  headerBorder: string;
  messageBg: string;
  sendButton: string;
  textColor: string;
  focusRing: string;
  hoverTextColor: string;
  userMessageBg: string;
  troopGradient: string; // New property for TROOP gradient
}> = {
  noori: {
    headerBorder: 'border-green-500',
    messageBg: 'bg-green-800',
    sendButton: 'bg-green-500 hover:bg-green-600',
    textColor: 'text-green-300',
    focusRing: 'focus:ring-green-400',
    hoverTextColor: 'hover:text-green-400',
    userMessageBg: 'bg-green-600',
    troopGradient: 'from-green-700 to-green-400',
  },
  frank: {
    headerBorder: 'border-blue-500',
    messageBg: 'bg-blue-800',
    sendButton: 'bg-blue-500 hover:bg-blue-600',
    textColor: 'text-blue-300',
    focusRing: 'focus:ring-blue-400',
    hoverTextColor: 'hover:text-blue-400',
    userMessageBg: 'bg-blue-600',
    troopGradient: 'from-blue-700 to-blue-400',
  },
  trudo: {
    headerBorder: 'border-yellow-500',
    messageBg: 'bg-yellow-800',
    sendButton: 'bg-yellow-500 hover:bg-yellow-600',
    textColor: 'text-yellow-300',
    focusRing: 'focus:ring-yellow-400',
    hoverTextColor: 'hover:text-yellow-400',
    userMessageBg: 'bg-yellow-600',
    troopGradient: 'from-yellow-700 to-yellow-400',
  },
};
