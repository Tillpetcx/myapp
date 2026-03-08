import { createLLM, type ModelKey, type ChatOptions } from "../llm/factory";
import { HumanMessage, AIMessage, SystemMessage } from "@langchain/core/messages";

export interface ChatMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

function convertToLangChainMessages(messages: ChatMessage[], systemPrompt?: string) {
  const langchainMessages = messages.map((msg) => {
    switch (msg.role) {
      case "system":
        return new SystemMessage(msg.content);
      case "user":
        return new HumanMessage(msg.content);
      case "assistant":
        return new AIMessage(msg.content);
      default:
        throw new Error(`Unsupported message role: ${msg.role}`);
    }
  });

  if (systemPrompt && !messages.some((m) => m.role === "system")) {
    langchainMessages.unshift(new SystemMessage(systemPrompt));
  }

  return langchainMessages;
}

export async function chat(
  messages: ChatMessage[],
  options: ChatOptions = {}
): Promise<string> {
  const model = await createLLM(options.model || "deepseek-chat", {
    temperature: options.temperature,
    maxTokens: options.maxTokens,
  });

  try {
    const langchainMessages = convertToLangChainMessages(
      messages,
      options.systemPrompt
    );
    const response = await model.invoke(langchainMessages);
    return response.content as string;
  } catch (error) {
    console.error("Error in chat:", error);
    throw new Error("Failed to get response from AI");
  }
}

export async function* chatStream(
  messages: ChatMessage[],
  options: ChatOptions = {}
): AsyncGenerator<string, void, unknown> {
  const model = await createLLM(options.model || "deepseek-chat", {
    temperature: options.temperature,
    maxTokens: options.maxTokens,
  });

  try {
    const langchainMessages = convertToLangChainMessages(
      messages,
      options.systemPrompt
    );
    const stream = await model.stream(langchainMessages);

    for await (const chunk of stream) {
      if (typeof chunk.content === "string" && chunk.content.length > 0) {
        yield chunk.content;
        continue;
      }

      if (Array.isArray(chunk.content)) {
        const textParts = chunk.content
          .filter((part): part is string => typeof part === "string")
          .join("");
        if (textParts) {
          yield textParts;
        }
        continue;
      }
    }
  } catch (err: any) {
    console.error("Streaming failed:", err);

    if (err?.response?.status === 429) {
      throw new Error("Rate limit exceeded");
    }
    if (
      err?.code === "ECONNABORTED" ||
      err?.message?.includes("timeout")
    ) {
      throw new Error("Request timeout");
    }

    throw new Error(`AI streaming failed: ${err?.message || String(err)}`);
  }
}