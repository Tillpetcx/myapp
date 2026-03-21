import { NextResponse } from "next/server";

export async function GET() {
    const users = Array.from({ length: 50 }, (_, index) => {
        const id = index + 1; // 生成 1 到 50 的 ID
        return {
            id: id,
            name: `用户 ${id}`,
            email: `user${id}@example.com`
        };
    });

    const posts = Array.from({ length: 50 }, (_, index) => {
        const id = index + 1; // 生成 1 到 50 的 ID
        return {
            id: id,
            title: `文章 ${id}`,
            content: `这是文章 ${id} 的内容`
        };
    });

    await new Promise(res => setTimeout(res, 3000))
    return NextResponse.json({
        users: users,
        posts: posts,
    });
}