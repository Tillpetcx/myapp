import { initChatModel } from "langchain";
import type { BaseChatModel } from "@langchain/core/language_models/chat_models";

const MODEL_CONFIG = {
    "gpt-3.5-turbo": {
        model: "gpt-3.5-turbo",
        provider: "openai",
        baseURL: "https://api.openai.com/v1",
    },
    "gpt-4": {
        model: "gpt-4",
        provider: "openai",
        baseURL: "https://api.openai.com/v1",
    },
    "gpt-4-turbo": {
        model: "gpt-4-turbo",
        provider: "openai",
        baseURL: "https://api.openai.com/v1",
    },
    "deepseek-chat": {
        model: "deepseek-chat",
        provider: "openai",
        baseURL: "https://api.deepseek.com/v1",
    },
} as const;

type ModelKey = keyof typeof MODEL_CONFIG;

export interface ChatOptions {
    model?: ModelKey;
    temperature?: number;
    maxTokens?: number;
    systemPrompt?: string;
}

export async function createLLM(
    key: ModelKey = "deepseek-chat",
    options?: { temperature?: number; maxTokens?: number }
): Promise<BaseChatModel> {
    const cfg = MODEL_CONFIG[key];

    return initChatModel(cfg.model, {
        provider: cfg.provider,
        baseURL: cfg.baseURL,
        apiKey: getApiKeyForProvider(cfg.provider),
        temperature: options?.temperature ?? 0.7,
        maxTokens: options?.maxTokens ?? 4096,
    });
}

function getApiKeyForProvider(provider: string): string | undefined {
    const map: Record<string, string> = {
        openai: process.env.OPENAI_API_KEY || process.env.DEEPSEEK_API_KEY,
        anthropic: process.env.ANTHROPIC_API_KEY,
    };
    return map[provider.toLowerCase()];
}

export type { ModelKey };