import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

const prismaAdapter = PrismaAdapter(prisma) as NextAuthOptions["adapter"];

export const authOptions: NextAuthOptions = {
    adapter: prismaAdapter,
    session: {
        strategy: "jwt",
    },
    providers: [
        CredentialsProvider({
            name: "credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    throw new Error("请输入邮箱和密码");
                }

                const user = await prisma.user.findUnique({
                    where: { email: credentials.email },
                });

                if (!user || !user.passwordHash) {
                    throw new Error("用户不存在或密码未设置");
                }

                if (!user.isActive) {
                    throw new Error("账户已被禁用");
                }

                if (user.isBanned && user.bannedUntil && user.bannedUntil > new Date()) {
                    throw new Error(`账户已被封禁，解封时间：${user.bannedUntil.toLocaleDateString()}`);
                }

                const isValidPassword = await bcrypt.compare(
                    credentials.password,
                    user.passwordHash
                );

                if (!isValidPassword) {
                    throw new Error("密码错误");
                }

                await prisma.user.update({
                    where: { id: user.id },
                    data: {
                        lastLoginAt: new Date(),
                    },
                });

                return {
                    id: user.id,
                    email: user.email,
                    name: user.displayName || user.username || user.email,
                    image: user.avatarUrl,
                };
            },
        }),
    ],
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
            }
            return token;
        },
        async session({ session, token }) {
            if (session.user) {
                session.user.id = token.id as string;
            }
            return session;
        },
    },
    pages: {
        signIn: "/login",
        error: "/login",
    },
};