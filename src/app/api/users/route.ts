import { NextRequest, NextResponse } from 'next/server';
import { createUser, getAllUsers, getUserByEmail, getUserByUsername } from '@/app/services/backend/user-service';

// 获取所有用户或根据邮箱/用户名查询用户
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');
    const username = searchParams.get('username');
    
    // 如果提供了邮箱参数，返回该邮箱的用户
    if (email) {
      const user = await getUserByEmail(email);
      if (!user) {
        return NextResponse.json(
          { error: 'User not found' },
          { status: 404 }
        );
      }
      return NextResponse.json(user);
    }
    
    // 如果提供了用户名参数，返回该用户名的用户
    if (username) {
      const user = await getUserByUsername(username);
      if (!user) {
        return NextResponse.json(
          { error: 'User not found' },
          { status: 404 }
        );
      }
      return NextResponse.json(user);
    }
    
    // 否则返回所有用户
    const users = await getAllUsers();
    return NextResponse.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json(
      { error: 'Failed to fetch users' },
      { status: 500 }
    );
  }
}

// 创建新用户
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, username, password, firstName, lastName } = body;
    
    // 验证必填字段
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }
    
    const user = await createUser({
      email,
      username,
      password,
      firstName,
      lastName,
    });
    
    // 不返回密码
    const { password: _, ...userWithoutPassword } = user;
    
    return NextResponse.json(userWithoutPassword, { status: 201 });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error('Error creating user:', error);
    
    // 处理唯一性约束错误
    if (error.code === 'P2002' && error.meta?.target?.includes('email')) {
      return NextResponse.json(
        { error: 'A user with this email already exists' },
        { status: 409 }
      );
    }
    
    if (error.code === 'P2002' && error.meta?.target?.includes('username')) {
      return NextResponse.json(
        { error: 'A user with this username already exists' },
        { status: 409 }
      );
    }
    
    return NextResponse.json(
      { error: 'Failed to create user' },
      { status: 500 }
    );
  }
}