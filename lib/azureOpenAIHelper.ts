// lib/azureOpenAIHelper.ts

import { AzureOpenAI } from "openai";
import "@azure/openai/types"; // Adds Azure-specific type definitions
import { Message, ChatbotConfig } from "@/types/chatbot";

// Extract environment variables
const deployment = process.env.AZURE_OPENAI_DEPLOYMENT || "";
const apiVersion = "2024-07-01-preview";
const apiKey = process.env.AZURE_OPENAI_API_KEY || "";
const endpoint = process.env.AZURE_OPENAI_ENDPOINT || ""; // Optional, depends on client implementation
const model = process.env.AZURE_OPENAI_MODEL || "gpt-35-turbo"; // Default if not specified

// Validate environment variables
if (!apiKey) {
  console.error("Azure OpenAI API key is missing. Please set AZURE_OPENAI_API_KEY in your environment variables.");
  throw new Error("Azure OpenAI API key is missing.");
}

if (!deployment) {
  console.error("Azure OpenAI deployment name is missing. Please set AZURE_OPENAI_DEPLOYMENT in your environment variables.");
  throw new Error("Azure OpenAI deployment name is missing.");
}

if (!apiVersion) {
  console.error("Azure OpenAI API version is missing. Please set it appropriately.");
  throw new Error("Azure OpenAI API version is missing.");
}

// Initialize AzureOpenAI client with API Key
let client: AzureOpenAI;

try {
  client = new AzureOpenAI({
    apiKey,        // API Key for authentication
    deployment,    // Deployment name
    apiVersion,    // API version
    endpoint,      // Optional: Specify if not using the default
  });
  console.log("Initialized AzureOpenAI client successfully.");
} catch (initError) {
  console.error("Failed to initialize AzureOpenAI client:", initError);
  throw initError;
}

export async function handleAzureOpenAIRequest(
  messages: Message[],
  config: ChatbotConfig
): Promise<ReadableStream<any>> {
  // Construct the chat messages array
  const chatMessages = [
    { role: "system", content: config.systemPrompt },
    ...messages.map((msg: Message) => ({
      role: msg.sender === "user" ? "user" : "assistant",
      content: msg.content,
    })),
  ];

  // Define completion options
  const completionOptions: any = {
    model: config.model,
    messages: chatMessages,
    max_tokens: config.maxTokens,
    temperature: config.temperature,
    top_p: config.top_p,
    stream: config.stream,
  };

  try {
    console.log("Sending request to Azure OpenAI with options:", completionOptions);
    
    // Create the chat completion stream
    const responseStream = await client.chat.completions.create(completionOptions);
    console.log("Received response stream from Azure OpenAI.");

  

    // // Wrap the response stream in a ReadableStream for Next.js
    // const stream = new ReadableStream({
    //   async start(controller) {
    //     try {
    //       for await (const chunk of responseStream) {
    //         const content = chunk.choices[0]?.delta?.content;
    //         if (content) {
    //           const formattedChunk = `data: ${content}\n\n`;
    //           controller.enqueue(new TextEncoder().encode(formattedChunk));
    //           console.log("Enqueued content chunk:", content);
    //         }
    //       }
    //       controller.close();
    //       console.log("Streaming completed successfully.");
    //     } catch (err) {
    //       console.error("Error while streaming from Azure OpenAI:", err);
    //       controller.error(err);
    //     }
    //   },
    // });

    // return stream;


    // Wrap the response stream in a ReadableStream for Next.js
    const stream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of responseStream) {
            // Assuming each chunk is an object, serialize it to JSON string
            const jsonChunk = JSON.stringify(chunk);
            const formattedChunk = `data: ${jsonChunk}\n\n`;
            controller.enqueue(new TextEncoder().encode(formattedChunk));
            console.log("Enqueued content chunk:", jsonChunk);
          }
          controller.close();
          console.log("Streaming completed successfully.");
        } catch (err) {
          console.error("Error while streaming from Azure OpenAI:", err);
          controller.error(err);
        }
      },
    });

    return stream;
  } catch (error: any) {
    console.error("Error in handleAzureOpenAIRequest:", error);
    throw error; // Re-throw to be caught in the API route
  }
}
