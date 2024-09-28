// components/ui/Sidebar.tsx

import React from 'react';
import clsx from 'clsx';
import { chatbotColors, Chatbot } from '@/config/chatbotColors'; // Adjust the import path as needed

type SidebarProps = {
  selectedChatbot: Chatbot;
  onSelectChatbot: (chatbot: Chatbot) => void;
};

export function Sidebar({ selectedChatbot, onSelectChatbot }: SidebarProps) {
  const chatbots: Chatbot[] = ['noori', 'frank', 'trudo'];

  const selectedColors = chatbotColors[selectedChatbot];

  return (
    <div className="w-64 bg-black bg-opacity-50 p-4 hidden lg:block">
      <div className="mb-8 text-center">
        {/* Troop Logo */}
        <img
          src="/images/troop_logo.png"
          alt="Troop Logo"
          className="w-30 h-30 mx-auto mb-4"
        />
         <h1
          className={clsx(
            "text-3xl font-extrabold text-transparent bg-clip-text",
            "bg-gradient-to-r",
            selectedColors.troopGradient // Apply dynamic gradient
          )}
        >
          TROOP
        </h1>
        <p className="text-xs text-gray-400">Your troop of personal assistants.</p>
      </div>
      <nav className="space-y-4 p-5">
        {chatbots.map((chatbot) => {
          const colors = chatbotColors[chatbot];
          return (
            <button
              key={chatbot}
              onClick={() => onSelectChatbot(chatbot)}
              className={clsx(
                "flex items-center text-xl font-extrabold w-full text-left transition-colors",
                selectedChatbot === chatbot
                  ? colors.textColor
                  : `text-gray-300 ${colors.hoverTextColor}`
              )}
            >
              <img src={`/images/${chatbot}_avatar2.png`} alt={`${chatbot.charAt(0).toUpperCase() + chatbot.slice(1)} Icon`} className="w-6 h-6 mr-3" />
              {chatbot.charAt(0).toUpperCase() + chatbot.slice(1)}
            </button>
          );
        })}
      </nav>
    </div>
  );
}
