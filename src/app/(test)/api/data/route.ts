import { NextResponse } from "next/server";

export async function GET() {

    await new Promise(res => setTimeout(res, 3000))
    return NextResponse.json({
        users: [
            { id: 1, name: "张三", email: "zhangsan@example.com" },
            { id: 2, name: "李四", email: "lisi@example.com" },
            { id: 3, name: "王五", email: "wangwu@example.com" },
        ],
        posts: [
            { id: 1, title: "第一篇文章", content: "这是第一篇文章的内容" },
            { id: 2, title: "第二篇文章", content: "这是第二篇文章的内容" },
            { id: 3, title: "第三篇文章", content: "这是第三篇文章的内容" },
        ],
    });
}