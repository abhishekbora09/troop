// app/api/ollama/frank/route.ts

import { NextRequest, NextResponse } from "next/server";
import { handleAzureOpenAIRequest } from "@/lib/azureOpenAIHelper";
import { ChatbotConfig, Message } from "@/types/chatbot";

export async function POST(request: NextRequest) {
  const totalStartTime = Date.now();
  console.log("Frank API route POST request received.");

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
      return NextResponse.json({ error: "Invalid messages format" }, { status: 400 });
    }
    const validationEndTime = Date.now();
    console.log(`Validation passed in ${validationEndTime - validationStartTime} ms.`);

    // Step 3: Define Frank's specific configuration for Azure OpenAI
    const frankConfig: ChatbotConfig = {
      systemPrompt:
        "You are Frank, a highly skilled nutritionist and fitness trainer. Assist the user with their nutrition and fitness related goals. Please be as concise and clear as possible. Only answer what is asked without giving more context. Please provide the output in a markdown format. Wheverver necessary, Use bullet points, numbered lists, bold text, and other Markdown features to enhance readability",
      model: process.env.AZURE_OPENAI_MODEL || "gpt-35-turbo",
      maxTokens: 500,
      temperature: 0.7,
      top_p: 0.9,
      stream: true, // Enable streaming
    };

    // Step 4: Use the helper to handle the request
    console.log("Invoking handleAzureOpenAIRequest with messages:", messages);
    const responseStream = await handleAzureOpenAIRequest(messages, frankConfig);
    console.log("Received response stream from handleAzureOpenAIRequest.");

    // Step 5: Log the total processing time
    const totalEndTime = Date.now();
    console.log(`Frank API route processing time: ${totalEndTime - totalStartTime} ms.`);

    // Return the streamed response with appropriate headers
    return new NextResponse(responseStream, {
      headers: { "Content-Type": "text/event-stream" },
    });
  } catch (error: any) {
    const errorTime = Date.now();
    console.log(`Frank API route failed after ${errorTime - totalStartTime} ms.`);
    console.error("Error in Frank API route:", error);

    // Optionally, you can inspect the error object more thoroughly here
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
