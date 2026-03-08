import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { userService } from '@/app/(Home)/userService';
import { compare } from 'bcryptjs';

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: '邮箱', type: 'email' },
        password: { label: '密码', type: 'password' }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        try {
          // 获取用户信息
          const response = await userService.getUserByEmail(credentials.email);
          
          if (!response.success || !response.data) {
            return null;
          }

          const user = response.data;

          // 验证密码
          const isPasswordValid = await compare(credentials.password, user.password);
          
          if (!isPasswordValid) {
            return null;
          }

          // 返回用户信息，不包含密码
          return {
            id: user.id,
            email: user.email,
            username: user.username,
            firstName: user.firstName,
            lastName: user.lastName,
            avatar: user.avatar,
            role: user.role,
            isActive: user.isActive,
            isVerified: user.isVerified,
          };
        } catch (error) {
          console.error('认证错误:', error);
          return null;
        }
      }
    })
  ],
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    async jwt({ token, user }) {
      // 登录时将用户信息添加到 token
      if (user) {
        token.id = user.id;
        token.username = user.username;
        token.firstName = user.firstName;
        token.lastName = user.lastName;
        token.avatar = user.avatar;
        token.role = user.role;
        token.isActive = user.isActive;
        token.isVerified = user.isVerified;
      }
      return token;
    },
    async session({ session, token }) {
      // 将 token 中的信息添加到 session
      if (token) {
        session.user.id = token.id as string;
        session.user.username = token.username as string;
        session.user.firstName = token.firstName as string;
        session.user.lastName = token.lastName as string;
        session.user.avatar = token.avatar as string;
        session.user.role = token.role as string;
        session.user.isActive = token.isActive as boolean;
        session.user.isVerified = token.isVerified as boolean;
      }
      return session;
    }
  },
  pages: {
    signIn: '/login',
    error: '/login',
  },
  secret: process.env.NEXTAUTH_SECRET,
};