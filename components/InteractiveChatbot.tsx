// // components/InteractiveChatbot.ts

// 'use client'

// import React, { useState } from 'react'
// import { Sidebar } from "@/components/ui/Sidebar"
// import { NooriChatbot } from '../components/NooriChatbot'
// import { FrankChatbot } from '../components/FrankChatbot'
// import { TrudoChatbot } from '../components/TrudoChatbot'

// type Chatbot = 'noori' | 'frank' | 'trudo'

// export function InteractiveChatbot() {
//   const [selectedChatbot, setSelectedChatbot] = useState<Chatbot>('noori')

//   const renderChatbot = () => {
//     switch(selectedChatbot) {
//       case 'noori':
//         return <NooriChatbot />
//       case 'frank':
//         return <FrankChatbot />
//       case 'trudo':
//         return <TrudoChatbot />
//       default:
//         return <NooriChatbot />
//     }
//   }

//   return (
//     <div className="min-h-screen flex bg-gradient-to-br from-gray-900 to-black text-white font-sans">
//       {/* Sidebar */}
//       <Sidebar selectedChatbot={selectedChatbot} onSelectChatbot={setSelectedChatbot} />

//       {/* Main Chat Area */}
//       <div className="flex-1 flex flex-col">
//         {renderChatbot()}
//       </div>
//     </div>
//   )
// }


// components/InteractiveChatbot.tsx

'use client'

import React, { useState } from 'react'
import { Sidebar } from "@/components/ui/Sidebar"
import { ChatbotContainer } from '@/components/ChatbotContainer' // Import ChatbotContainer
import type { Chatbot } from '@/types/chatbot' // Import the Chatbot type

export function InteractiveChatbot() {
  const [selectedChatbot, setSelectedChatbot] = useState<Chatbot>('noori')

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-gray-900 to-black text-white font-sans">
      {/* Sidebar */}
      <Sidebar selectedChatbot={selectedChatbot} onSelectChatbot={setSelectedChatbot} />

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        <ChatbotContainer selectedChatbot={selectedChatbot} />
      </div>
    </div>
  )
}
