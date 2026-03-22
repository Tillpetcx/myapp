import { NextRequest, NextResponse } from 'next/server';

const users = [
    { id: 1, name: '张三', email: 'zhangsan@example.com', role: 'admin' },
    { id: 2, name: '李四', email: 'lisi@example.com', role: 'user' },
    { id: 3, name: '王五', email: 'wangwu@example.com', role: 'user' },
];

export async function GET() {

    // await new Promise(res => setTimeout(res, 3000))
    return NextResponse.json(users);
}

export async function POST(request: NextRequest) {
    const body = await request.json();
    const newUser = {
        id: users.length + 1,
        ...body,
    };
    users.push(newUser);
    await new Promise(res => setTimeout(res, 3000))
    return NextResponse.json(newUser, { status: 201 });
}