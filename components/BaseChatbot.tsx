// // components/BaseChatbot.tsx

// 'use client';

// import React, { useState, useRef, useEffect } from 'react';
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Camera, Paperclip, Mic, Send, Menu, X } from 'lucide-react';
// import { chatbotColors } from '@/config/chatbotColors';
// import clsx from 'clsx';
// import type { Chatbot, Message } from '@/types/chatbot'; // Import types

// type BaseChatbotProps = {
//   chatbot: Chatbot;
//   initialMessages: Message[];
//   avatarSrc: string;
//   placeholderText: string;
// };

// export function BaseChatbot({ chatbot, initialMessages, avatarSrc, placeholderText }: BaseChatbotProps) {
//   const [input, setInput] = useState('');
//   const [attachments, setAttachments] = useState<File | null>(null);
//   const [messages, setMessages] = useState<Message[]>(initialMessages);
//   const fileInputRef = useRef<HTMLInputElement>(null);
//   const [isLoading, setIsLoading] = useState(false);
//   const messagesEndRef = useRef<HTMLDivElement>(null);

//   // Auto-scroll to the latest message
//   const scrollToBottom = () => {
//     messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
//   };

//   useEffect(() => {
//     scrollToBottom();
//   }, [messages]);

//   // Reset state when chatbot changes
//   useEffect(() => {
//     setMessages(initialMessages);
//     setInput('');
//     setAttachments(null);
//   }, [chatbot]);

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();

//     if (input.trim() || attachments) {
//       const newMessage: Message = {
//         id: messages.length + 1,
//         sender: 'user',
//         content: input.trim(),
//         attachment: attachments ? URL.createObjectURL(attachments) : undefined,
//       };

//       // Add user's message
//       setMessages(prevMessages => [...prevMessages, newMessage]);
//       setInput('');
//       setAttachments(null);

//       const allMessages = [...messages, newMessage];
//       console.log(`Sending messages to API for ${chatbot}:`, allMessages);

//       setIsLoading(true);

//       try {

//         // Determine the API endpoint based on the chatbot
//         const apiEndpoint = `/api/ollama/${chatbot}`;

//         // Send the messages array to the API route
//         const res = await fetch(apiEndpoint, {
//           method: 'POST',
//           headers: {
//             'Content-Type': 'application/json',
//           },
//           body: JSON.stringify({ messages: allMessages, chatbot }),
//         });

//         console.log("API response status:", res.status);

//         if (!res.ok) {
//           const errorData = await res.json();
//           console.error("API error details:", errorData);
//           throw new Error(`HTTP error! status: ${res.status}, details: ${JSON.stringify(errorData)}`);
//         }

//         // Add a placeholder for the chatbot's response
//         const botMessage: Message = {
//           id: allMessages.length + 1,
//           sender: chatbot,
//           content: '',
//         };
//         setMessages(prevMessages => [...prevMessages, botMessage]);
//         scrollToBottom();

//         // Create a reader to process the streamed response
//         const reader = res.body?.getReader();
//         const decoder = new TextDecoder();
//         if (!reader) {
//           throw new Error('No response body');
//         }

//         let doneReading = false;
//         let partialResponse = '';

//         while (!doneReading) {
//           const { value, done } = await reader.read();
//           doneReading = done;
//           if (value) {
//             const chunk = decoder.decode(value);

//             // Split the chunk into lines based on newline character
//             const lines = chunk.split('\n').filter(line => line.trim() !== '');

//             for (const line of lines) {
//               if (line.startsWith('data: ')) {
//                 const data = line.replace(/^data: /, '').trim();

//                 if (data === '[DONE]') {
//                   doneReading = true;
//                   break;
//                 }

//                 try {
//                   const parsed = JSON.parse(data);

//                   // Extract the content delta
//                   const deltaContent = parsed.choices?.[0]?.delta?.content;
//                   if (deltaContent) {
//                     partialResponse += deltaContent;

//                     // Update the chatbot's message with the partial response
//                     setMessages(prevMessages => {
//                       const updatedMessages = [...prevMessages];
//                       const lastMessage = updatedMessages[updatedMessages.length - 1];
//                       if (lastMessage.sender === chatbot) {
//                         // Append the new chunk to the existing content
//                         updatedMessages[updatedMessages.length - 1] = {
//                           ...lastMessage,
//                           content: lastMessage.content + deltaContent,
//                         };
//                       } else {
//                         // If for some reason the last message isn't the chatbot's, add a new message
//                         updatedMessages.push({
//                           id: prevMessages.length + 1,
//                           sender: chatbot,
//                           content: deltaContent,
//                         });
//                       }
//                       return updatedMessages;
//                     });
//                     scrollToBottom();
//                   }
//                 } catch (error) {
//                   console.error('Error parsing streamed data:', error);
//                 }
//               }
//             }
//           }
//         }

//         setIsLoading(false);
//       } catch (error: any) {
//         console.error('Error fetching response from API:', error);
//         setIsLoading(false);

//         // Handle API failure gracefully by adding an error message
//         const errorResponse: Message = {
//           id: messages.length + 1,
//           sender: chatbot,
//           content: `Sorry, something went wrong. Error: ${error.message}`,
//         };

//         setMessages(prevMessages => [...prevMessages, errorResponse]);
//         scrollToBottom();
//       }
//     }
//   };

//   // Handle Attachment
//   const handleAttachment = () => {
//     fileInputRef.current?.click();
//   };

//   const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     if (e.target.files && e.target.files[0]) {
//       setAttachments(e.target.files[0]);
//     }
//   };

//   // Extract the color classes for the current chatbot
//   const {
//     headerBorder,
//     messageBg,
//     sendButton,
//     textColor,
//     focusRing,
//     hoverTextColor,
//     userMessageBg,
//   } = chatbotColors[chatbot];

//   return (
//     <div className="flex-1 flex flex-col">
//       {/* Header */}
//       <header
//         className={clsx(
//           "bg-black bg-opacity-50 p-4 flex items-center justify-between",
//           headerBorder
//         )}
//       >
//         <Button variant="ghost" size="icon" className={clsx("lg:hidden text-gray-400", hoverTextColor)}>
//           <Menu className="h-6 w-6" />
//         </Button>
//         <h2 className={clsx("text-xl font-semibold text-center flex-1 capitalize", textColor)}>
//           Chat with {chatbot}
//         </h2>
//         <div>
//           <img
//             src={avatarSrc}
//             alt={`${chatbot.charAt(0).toUpperCase() + chatbot.slice(1)} Avatar`}
//             className="w-8 h-8 rounded-full flex-shrink-0 object-cover"
//           />
//         </div>
//       </header>

//       {/* Chat Messages */}
//       <div className="flex-1 overflow-auto p-6 space-y-6">
//         {messages.map((message) => (
//           <div
//             key={message.id}
//             className={`flex items-start space-x-4 ${message.sender === 'user' ? 'justify-end' : ''}`}
//           >
//             {message.sender !== 'user' && (
//               <img
//                 src={avatarSrc}
//                 alt={`${chatbot.charAt(0).toUpperCase() + chatbot.slice(1)} Avatar`}
//                 className="w-8 h-8 rounded-full flex-shrink-0 object-cover"
//               />
//             )}
//             <div
//               className={clsx(
//                 "flex-1 rounded-2xl p-4 shadow-lg max-w-[80%]",
//                 message.sender === 'user' ? userMessageBg : messageBg
//               )}
//             >
//               {message.sender !== 'user' && (
//                 <p className={clsx("mb-1 font-extrabold capitalize", textColor)}>
//                   {chatbot}
//                 </p>
//               )}
//               <p className="text-gray-100">
//                 {message.content}
//                 {/* Show typing indicator */}
//                 {message.sender !== 'user' && message.content === '' && (
//                   <span className="inline-block w-2 h-2 bg-gray-400 rounded-full animate-bounce ml-1"></span>
//                 )}
//               </p>
//               {message.attachment && (
//                 <div className="mt-2">
//                   <img src={message.attachment} alt="Attached file" className="max-w-full h-auto rounded" />
//                 </div>
//               )}
//             </div>
//           </div>
//         ))}
//         <div ref={messagesEndRef} />
//       </div>

//       {/* Input Area */}
//       <div className="p-4 bg-black bg-opacity-50">
//         <form onSubmit={handleSubmit} className="max-w-4xl mx-auto">
//           <div className="relative flex items-center">
//             <Input
//               type="text"
//               placeholder={placeholderText}
//               value={input}
//               onChange={(e) => setInput(e.target.value)}
//               className={clsx(
//                 "w-full py-3 pl-4 pr-32 rounded-full bg-gray-800 text-white placeholder-gray-400 border-none focus:ring-2 transition-all duration-300 ease-in-out",
//                 focusRing
//               )}
//               disabled={isLoading}
//             />
//             <div className="absolute right-2 flex items-center space-x-2">
//               {/* Icons with dynamic hover text color */}
//               <Button
//                 type="button"
//                 variant="ghost"
//                 size="icon"
//                 className={clsx("text-gray-400 transition-colors", hoverTextColor)}
//                 disabled={isLoading}
//               >
//                 <Camera className="h-5 w-5" />
//                 <span className="sr-only">Upload image</span>
//               </Button>
//               <Button
//                 type="button"
//                 variant="ghost"
//                 size="icon"
//                 className={clsx("text-gray-400 transition-colors", hoverTextColor)}
//                 onClick={handleAttachment}
//                 disabled={isLoading}
//               >
//                 <Paperclip className="h-5 w-5" />
//                 <span className="sr-only">Attach file</span>
//               </Button>
//               <input
//                 type="file"
//                 ref={fileInputRef}
//                 onChange={handleFileChange}
//                 className="hidden"
//                 accept="image/*"
//                 disabled={isLoading}
//               />
//               <Button
//                 type="button"
//                 variant="ghost"
//                 size="icon"
//                 className={clsx("text-gray-400 transition-colors", hoverTextColor)}
//                 disabled={isLoading}
//               >
//                 <Mic className="h-5 w-5" />
//                 <span className="sr-only">Voice input</span>
//               </Button>
//               {/* Send Button */}
//               <Button
//                 type="submit"
//                 size="icon"
//                 className={clsx(
//                   "text-white rounded-full transition-colors",
//                   sendButton
//                 )}
//                 disabled={isLoading}
//               >
//                 <Send className="h-5 w-5" />
//                 <span className="sr-only">Send message</span>
//               </Button>
//             </div>
//           </div>
//           {/* Attachments */}
//           {attachments && (
//             <div className="mt-2 flex items-center space-x-2">
//               <span className="text-sm text-gray-300">{attachments.name}</span>
//               <Button
//                 type="button"
//                 variant="ghost"
//                 size="icon"
//                 className="text-gray-400 hover:text-red-400 transition-colors"
//                 onClick={() => setAttachments(null)}
//                 disabled={isLoading}
//               >
//                 <X className="h-4 w-4" />
//                 <span className="sr-only">Remove attachment</span>
//               </Button>
//             </div>
//           )}
//         </form>
//       </div>
//     </div>
//   );
// }


// components/BaseChatbot.tsx

'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Camera, Paperclip, Mic, Send, Menu, X } from 'lucide-react';
import { chatbotColors } from '@/config/chatbotColors';
import clsx from 'clsx';
import type { Chatbot, Message } from '@/types/chatbot'; // Import types

// Import react-markdown and plugins
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm'; // For GitHub Flavored Markdown
import rehypeSanitize from 'rehype-sanitize'; // For sanitization
import rehypeHighlight from 'rehype-highlight'; // For syntax highlighting (optional)

// Import CSS for syntax highlighting (if using rehype-highlight)
import 'highlight.js/styles/github.css'; // You can choose any style you prefer

type BaseChatbotProps = {
  chatbot: Chatbot;
  initialMessages: Message[];
  avatarSrc: string;
  placeholderText: string;
};

export function BaseChatbot({ chatbot, initialMessages, avatarSrc, placeholderText }: BaseChatbotProps) {
  const [input, setInput] = useState('');
  const [attachments, setAttachments] = useState<File | null>(null);
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to the latest message
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  // Reset state when chatbot changes
  useEffect(() => {
    setMessages(initialMessages);
    setInput('');
    setAttachments(null);
  }, [chatbot, initialMessages]); // Added initialMessages to dependencies

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();

    if (input.trim() || attachments) {
      const newMessage: Message = {
        id: messages.length + 1, // Consider using UUIDs for unique IDs
        sender: 'user',
        content: input.trim(),
        attachment: attachments ? URL.createObjectURL(attachments) : undefined,
      };

      // Add user's message
      setMessages(prevMessages => [...prevMessages, newMessage]);
      console.log("Updated messages after adding user message:", [...messages, newMessage]);

      setInput('');
      setAttachments(null);

      const allMessages = [...messages, newMessage];
      console.log(`Sending messages to API for ${chatbot}:`, allMessages);

      setIsLoading(true);

      try {

        // Determine the API endpoint based on the chatbot
        const apiEndpoint = `/api/ollama/${chatbot}`;

        // Send the messages array to the API route
        const res = await fetch(apiEndpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ messages: allMessages, chatbot }),
        });

        console.log("API response status:", res.status);

        if (!res.ok) {
          const errorData = await res.json();
          console.error("API error details:", errorData);
          throw new Error(`HTTP error! status: ${res.status}, details: ${JSON.stringify(errorData)}`);
        }

        // Add a placeholder for the chatbot's response
        const botMessage: Message = {
          id: allMessages.length + 1,
          sender: chatbot,
          content: '',
        };
        setMessages(prevMessages => [...prevMessages, botMessage]);
        scrollToBottom();

        // Create a reader to process the streamed response
        const reader = res.body?.getReader();
        const decoder = new TextDecoder();
        if (!reader) {
          throw new Error('No response body');
        }

        let doneReading = false;
        let partialResponse = '';

        while (!doneReading) {
          const { value, done } = await reader.read();
          doneReading = done;
          if (value) {
            const chunk = decoder.decode(value);

            // Split the chunk into lines based on newline character
            const lines = chunk.split('\n').filter(line => line.trim() !== '');

            for (const line of lines) {
              if (line.startsWith('data: ')) {
                const data = line.replace(/^data: /, '').trim();

                if (data === '[DONE]') {
                  doneReading = true;
                  break;
                }

                try {
                  const parsed = JSON.parse(data);

                  // Extract the content delta
                  const deltaContent = parsed.choices?.[0]?.delta?.content;
                  if (deltaContent) {
                    partialResponse += deltaContent;

                    // Update the chatbot's message with the partial response
                    setMessages(prevMessages => {
                      const updatedMessages = [...prevMessages];
                      const lastMessage = updatedMessages[updatedMessages.length - 1];
                      if (lastMessage.sender === chatbot) {
                        // Append the new chunk to the existing content
                        updatedMessages[updatedMessages.length - 1] = {
                          ...lastMessage,
                          content: lastMessage.content + deltaContent,
                        };
                      } else {
                        // If for some reason the last message isn't the chatbot's, add a new message
                        updatedMessages.push({
                          id: prevMessages.length + 1,
                          sender: chatbot,
                          content: deltaContent,
                        });
                      }
                      console.log("Updated messages with AI response chunk:", updatedMessages);
                      return updatedMessages;
                    });
                    scrollToBottom();
                  }
                } catch (error) {
                  console.error('Error parsing streamed data:', error);
                }
              }
            }
          }
        }

        setIsLoading(false);
      } catch (error: any) {
        console.error('Error fetching response from API:', error);
        setIsLoading(false);

        // Handle API failure gracefully by adding an error message
        const errorResponse: Message = {
          id: messages.length + 1,
          sender: chatbot,
          content: `Sorry, something went wrong. Error: ${error.message}`,
        };

        setMessages(prevMessages => [...prevMessages, errorResponse]);
        scrollToBottom();
      }
    }
  }, [input, attachments, messages, chatbot]);

  // Handle Attachment
  const handleAttachment = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setAttachments(e.target.files[0]);
    }
  }, []);

  // Extract the color classes for the current chatbot
  const {
    headerBorder,
    messageBg,
    sendButton,
    textColor,
    focusRing,
    hoverTextColor,
    userMessageBg,
  } = chatbotColors[chatbot];

  return (
    <div className="flex-1 flex flex-col">
      {/* Header */}
      <header
        className={clsx(
          "bg-black bg-opacity-50 p-4 flex items-center justify-between",
          headerBorder
        )}
      >
        <Button variant="ghost" size="icon" className={clsx("lg:hidden text-gray-400", hoverTextColor)}>
          <Menu className="h-6 w-6" />
        </Button>
        <h2 className={clsx("text-xl font-semibold text-center flex-1 capitalize", textColor)}>
          Chat with {chatbot}
        </h2>
        <div>
          <img
            src={avatarSrc}
            alt={`${chatbot.charAt(0).toUpperCase() + chatbot.slice(1)} Avatar`}
            className="w-8 h-8 rounded-full flex-shrink-0 object-cover"
          />
        </div>
      </header>

      {/* Chat Messages */}
      <div className="flex-1 overflow-auto p-6 space-y-6">
        {messages.map((message) => {
          console.log("Rendering message:", message); // Debug log
          return (
            <div
              key={message.id}
              className={`flex items-start space-x-4 ${message.sender === 'user' ? 'justify-end' : ''}`}
            >
              {message.sender !== 'user' && (
                <img
                  src={avatarSrc}
                  alt={`${chatbot.charAt(0).toUpperCase() + chatbot.slice(1)} Avatar`}
                  className="w-8 h-8 rounded-full flex-shrink-0 object-cover"
                />
              )}
              <div
                className={clsx(
                  "flex-1 rounded-2xl p-4 shadow-lg max-w-[80%]",
                  message.sender === 'user' ? `${userMessageBg} text-gray-100` : `${messageBg} text-gray-100`
                )}
              >
                {message.sender !== 'user' && (
                  <p className={clsx("mb-1 font-extrabold capitalize", textColor)}>
                    {chatbot}
                  </p>
                )}
                {/* Render message content using ReactMarkdown */}
                <ReactMarkdown
                  className="prose text-gray-100"
                  remarkPlugins={[remarkGfm]}
                  rehypePlugins={[rehypeSanitize, rehypeHighlight]}
                >
                  {message.content}
                </ReactMarkdown>
                {message.attachment && (
                  <div className="mt-2">
                    <img src={message.attachment} alt="Attached file" className="max-w-full h-auto rounded" />
                  </div>
                )}
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 bg-black bg-opacity-50">
        <form onSubmit={handleSubmit} className="max-w-4xl mx-auto">
          <div className="relative flex items-center">
            <Input
              type="text"
              placeholder={placeholderText}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className={clsx(
                "w-full py-3 pl-4 pr-32 rounded-full bg-gray-800 text-white placeholder-gray-400 border-none focus:ring-2 transition-all duration-300 ease-in-out",
                focusRing
              )}
              disabled={isLoading}
            />
            <div className="absolute right-2 flex items-center space-x-2">
              {/* Icons with dynamic hover text color */}
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className={clsx("text-gray-400 transition-colors", hoverTextColor)}
                disabled={isLoading}
                aria-label="Upload image"
              >
                <Camera className="h-5 w-5" />
                <span className="sr-only">Upload image</span>
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className={clsx("text-gray-400 transition-colors", hoverTextColor)}
                onClick={handleAttachment}
                disabled={isLoading}
                aria-label="Attach file"
              >
                <Paperclip className="h-5 w-5" />
                <span className="sr-only">Attach file</span>
              </Button>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden"
                accept="image/*"
                disabled={isLoading}
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className={clsx("text-gray-400 transition-colors", hoverTextColor)}
                disabled={isLoading}
                aria-label="Voice input"
              >
                <Mic className="h-5 w-5" />
                <span className="sr-only">Voice input</span>
              </Button>
              {/* Send Button */}
              <Button
                type="submit"
                size="icon"
                className={clsx(
                  "text-white rounded-full transition-colors",
                  sendButton
                )}
                disabled={isLoading}
                aria-label="Send message"
              >
                <Send className="h-5 w-5" />
                <span className="sr-only">Send message</span>
              </Button>
            </div>
          </div>
          {/* Attachments */}
          {attachments && (
            <div className="mt-2 flex items-center space-x-2">
              <span className="text-sm text-gray-300">{attachments.name}</span>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="text-gray-400 hover:text-red-400 transition-colors"
                onClick={() => setAttachments(null)}
                disabled={isLoading}
                aria-label="Remove attachment"
              >
                <X className="h-4 w-4" />
                <span className="sr-only">Remove attachment</span>
              </Button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}

