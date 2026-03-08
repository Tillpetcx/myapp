import { prisma } from '@/lib/prisma';
import { hash } from 'bcryptjs';

export async function createUser(userData: {
  email: string;
  username?: string;
  password: string;
  firstName?: string;
  lastName?: string;
}) {
  try {
    // 对密码进行哈希处理
    const hashedPassword = await hash(userData.password, 10);
    
    const user = await prisma.user.create({
      data: {
        ...userData,
        password: hashedPassword, // 使用哈希后的密码
        profiles: {
          create: {}, // 创建关联的空配置文件
        },
      },
      include: {
        profiles: true, // 包含关联的配置文件
      },
    });
    return user;
  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  }
}


export async function getAllUsers() {
  try {
    const users = await prisma.user.findMany({
      where: {
        isDeleted: false, // 只获取未删除的用户
      },
      include: {
        profiles: true,
        posts: true,
      },
    });
    return users;
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
}


export async function getUserById(id: string) {
  try {
    const user = await prisma.user.findFirst({
      where: {
        id,
        isDeleted: false, // 只获取未删除的用户
      },
      include: {
        profiles: true,
        posts: {
          orderBy: {
            createdAt: 'desc',
          },
        },
      },
    });
    return user;
  } catch (error) {
    console.error('Error fetching user:', error);
    throw error;
  }
}


export async function getUserByEmail(email: string) {
  try {
    const user = await prisma.user.findFirst({
      where: {
        email,
        isDeleted: false, // 只获取未删除的用户
      },
      include: {
        profiles: true,
      },
    });
    return user;
  } catch (error) {
    console.error('Error fetching user by email:', error);
    throw error;
  }
}

export async function getUserByUsername(username: string) {
  try {
    const user = await prisma.user.findFirst({
      where: {
        username,
        isDeleted: false, // 只获取未删除的用户
      },
      include: {
        profiles: true,
      },
    });
    return user;
  } catch (error) {
    console.error('Error fetching user by username:', error);
    throw error;
  }
}


export async function updateUser(id: string, userData: Partial<{
  email: string;
  username: string;
  password: string;
  firstName: string;
  lastName: string;
  avatar: string;
  bio: string;
  phone: string;
  isActive: boolean;
  isVerified: boolean;
  role: 'USER' | 'ADMIN' | 'MODERATOR';
}>) {
  try {
    const user = await prisma.user.update({
      where: { 
        id,
        isDeleted: false, // 只更新未删除的用户
      },
      data: userData,
      include: {
        profiles: true,
      },
    });
    return user;
  } catch (error) {
    console.error('Error updating user:', error);
    throw error;
  }
}


export async function deleteUser(id: string) {
  try {
    const user = await prisma.user.update({
      where: { 
        id,
        isDeleted: false, // 只删除未删除的用户
      },
      data: {
        isDeleted: true,
        deletedAt: new Date(),
        isActive: false, // 删除时同时设置为非活跃状态
      },
    });
    return user;
  } catch (error) {
    console.error('Error deleting user:', error);
    throw error;
  }
}


export async function restoreUser(id: string) {
  try {
    const user = await prisma.user.update({
      where: { 
        id,
        isDeleted: true, // 只恢复已删除的用户
      },
      data: {
        isDeleted: false,
        deletedAt: null,
        // 注意：这里不恢复 isActive 状态，需要单独设置
      },
    });
    return user;
  } catch (error) {
    console.error('Error restoring user:', error);
    throw error;
  }
}


export async function permanentlyDeleteUser(id: string) {
  try {
    const user = await prisma.user.delete({
      where: { id },
    });
    return user;
  } catch (error) {
    console.error('Error permanently deleting user:', error);
    throw error;
  }
}


export async function getDeletedUsers() {
  try {
    const users = await prisma.user.findMany({
      where: {
        isDeleted: true, // 只获取已删除的用户
      },
      include: {
        profiles: true,
      },
      orderBy: {
        deletedAt: 'desc',
      },
    });
    return users;
  } catch (error) {
    console.error('Error fetching deleted users:', error);
    throw error;
  }
}


export async function createPost(postData: {
  title: string;
  content?: string;
  published?: boolean;
  authorId: string;
}) {
  try {
    const post = await prisma.post.create({
      data: postData,
      include: {
        author: true,
      },
    });
    return post;
  } catch (error) {
    console.error('Error creating post:', error);
    throw error;
  }
}