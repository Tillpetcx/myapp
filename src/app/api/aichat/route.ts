import { NextRequest, NextResponse } from 'next/server';
import { chatStream } from '@/lib/services/chat-service';
import { createStreamingDataResponse } from '@/lib/utils/streaming';

// 创建聊天会话
export async function POST(request: NextRequest) {
  try {
    const { messages, model = 'deepseek-chat', temperature = 0.7 } = await request.json();

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json(
        { error: 'Messages array is required' },
        { status: 400 }
      );
    } else if (!model) {
      return NextResponse.json(
        { error: 'Model is required' },
        { status: 400 }
      );
    }

    // 创建流式响应
    const stream = chatStream(messages, {
      model: model as any,
      temperature,
      systemPrompt: '你是一个有用的AI助手，请用中文回答用户的问题。',
    });

    return createStreamingDataResponse(stream, {
      onChunk: (chunk) => {
        process.stdout.write(chunk);
      },
    });
  } catch (error) {
    console.error('Error in chat API:', error);
    return NextResponse.json(
      { error: 'Failed to process chat request' },
      { status: 500 }
    );
  }
}

// 获取可用模型列表
export async function GET() {
  try {
    const models = [
      { id: 'deepseek-chat', name: 'DeepSeek Chat' },
      { id: 'gpt-3.5-turbo', name: 'GPT-3.5 Turbo' },
      { id: 'gpt-4', name: 'GPT-4' },
      { id: 'gpt-4-turbo', name: 'GPT-4 Turbo' },
    ];

    return NextResponse.json({ models });
  } catch (error) {
    console.error('Error fetching models:', error);
    return NextResponse.json(
      { error: 'Failed to fetch models' },
      { status: 500 }
    );
  }
}