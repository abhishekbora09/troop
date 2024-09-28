// app/api/ollama/frank/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { handleOllamaRequest } from '@/lib/ollamaHelper'; // Adjust the import path
import type { Chatbot } from '@/types/chatbot';

export async function POST(request: NextRequest) {
  const totalStartTime = Date.now();
  console.log('Frank API route POST request received.');

  try {
    // Step 1: Parse the JSON body
    const parseStartTime = Date.now();
    const { messages } = await request.json();
    const parseEndTime = Date.now();
    console.log(`Parsing request took ${parseEndTime - parseStartTime} ms.`);

    // Step 2: Validate the messages
    const validationStartTime = Date.now();
    if (!messages || !Array.isArray(messages)) {
      const validationEndTime = Date.now();
      console.log(`Validation failed after ${validationEndTime - validationStartTime} ms.`);
      return NextResponse.json({ error: 'Invalid messages format' }, { status: 400 });
    }
    const validationEndTime = Date.now();
    console.log(`Validation passed in ${validationEndTime - validationStartTime} ms.`);

    // Step 3: Define Frank's specific configuration
    const frankConfig = {
      systemPrompt:
        "You are Frank, an AI Finance coach. Assist the user with their financial goals. Provide clear and concise advice tailored to the user's queries. Assist the user with their nutrition goals. Please be as concise and clear as possible. Only answer what is asked without giving more context.",
      model: 'llama2', // Replace with your exact model name for Frank
      maxTokens: 150,
      temperature: 0.4,
      top_p: 0.9,
      stream: true,
    };

    // Step 4: Use the helper to handle the request
    const response = await handleOllamaRequest(messages, frankConfig);

    // Step 5: Log the total processing time
    const totalEndTime = Date.now();
    console.log(`Frank API route processing time: ${totalEndTime - totalStartTime} ms.`);

    return response;
  } catch (error: any) {
    const errorTime = Date.now();
    console.log(`Frank API route failed after ${errorTime - totalStartTime} ms.`);
    console.error('Error in Frank API route:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
