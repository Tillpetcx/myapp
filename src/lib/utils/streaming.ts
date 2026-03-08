import { NextResponse } from 'next/server';

export function createStreamingDataResponse(
  stream: AsyncIterable<string>,
  options?: {
    onChunk?: (chunk: string) => void;  // 可选的回调，用于处理每个chunk
  }
) {
  const encoder = new TextEncoder();

  const readable = new ReadableStream({
    async start(controller) {


      // 立刻发送一行，破冰（防止连接被认为卡死）
      controller.enqueue(encoder.encode('data: {"delta":""}\n\n'));
      controller.enqueue(encoder.encode(': heartbeat\n\n'));  // SSE 注释行，心跳
      try {
        for await (const chunk of stream) {
          // chunk 是 string，直接用
          controller.enqueue(
            encoder.encode(`data: ${JSON.stringify({ delta: chunk })}\n\n`)
          );
          // 同时打印到终端（如果需要）
          if (options?.onChunk) {
            options.onChunk(chunk);
          }
        }
        controller.enqueue(encoder.encode('data: [DONE]\n\n'));
        controller.close();
      } catch (err) {
        console.error('Streaming failed:', err);
        controller.enqueue(
          encoder.encode(`data: ${JSON.stringify({ error: String(err) })}\n\n`)
        );
        controller.enqueue(encoder.encode('data: [DONE]\n\n'));
        controller.close();
      }
    },
  });

  return new NextResponse(readable, {
    status: 200,
    headers: {
      'Content-Type': 'text/event-stream; charset=utf-8',
      'Cache-Control': 'no-cache, no-store, no-transform, must-revalidate',
      'Connection': 'keep-alive',
      'Content-Encoding': 'none',           // ← 关键！禁用 gzip/deflate
      'X-Accel-Buffering': 'no',            // 绕过 nginx / 一些 CDN 缓冲
      'Transfer-Encoding': 'chunked',
      // 可选：Vercel / edge runtime 有时需要
      'Vary': 'Accept-Encoding',            // 告诉它不要压缩
    },
  });
}