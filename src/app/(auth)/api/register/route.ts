import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const registerSchema = z.object({
    email: z.string().email("请输入有效的邮箱地址"),
    password: z.string().min(8, "密码至少需要8个字符"),
    username: z.string().min(3, "用户名至少需要3个字符").max(50, "用户名最多50个字符").optional(),
    displayName: z.string().min(1, "请输入显示名称").max(120, "显示名称最多120个字符").optional(),
});

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const validatedData = registerSchema.parse(body);

        const existingUser = await prisma.user.findFirst({
            where: {
                OR: [
                    { email: validatedData.email },
                    ...(validatedData.username ? [{ username: validatedData.username }] : []),
                ],
            },
        });

        if (existingUser) {
            if (existingUser.email === validatedData.email) {
                return NextResponse.json(
                    { message: "该邮箱已被注册" },
                    { status: 400 }
                );
            }
            if (existingUser.username === validatedData.username) {
                return NextResponse.json(
                    { message: "该用户名已被使用" },
                    { status: 400 }
                );
            }
        }

        const passwordHash = await bcrypt.hash(validatedData.password, 12);

        const user = await prisma.user.create({
            data: {
                email: validatedData.email,
                passwordHash,
                username: validatedData.username,
                displayName: validatedData.displayName || validatedData.username || validatedData.email.split("@")[0],
            },
        });

        return NextResponse.json(
            {
                id: user.id,
                email: user.email,
                username: user.username,
                displayName: user.displayName,
            },
            { status: 201 }
        );
    } catch (error) {
        if (error instanceof z.ZodError) {
            const firstError = error.issues[0];
            return NextResponse.json(
                { message: firstError?.message || "验证错误" },
                { status: 400 }
            );
        }
        console.error("Register error:", error);
        return NextResponse.json(
            { message: "服务器内部错误" },
            { status: 500 }
        );
    }
}