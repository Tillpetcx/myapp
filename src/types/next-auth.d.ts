import { DefaultSession } from 'next-auth';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      username?: string;
      firstName?: string;
      lastName?: string;
      avatar?: string;
      role: string;
      isActive: boolean;
      isVerified: boolean;
    } & DefaultSession['user'];
  }

  interface User {
    id: string;
    email: string;
    username?: string;
    firstName?: string;
    lastName?: string;
    avatar?: string;
    role: string;
    isActive: boolean;
    isVerified: boolean;
  }

  interface JWT {
    id: string;
    username?: string;
    firstName?: string;
    lastName?: string;
    avatar?: string;
    role: string;
    isActive: boolean;
    isVerified: boolean;
  }
}