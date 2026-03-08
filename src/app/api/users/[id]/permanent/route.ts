import { NextRequest, NextResponse } from 'next/server';
import { permanentlyDeleteUser } from '@/app/api/users/user-service';

// 永久删除用户（物理删除，仅管理员可用）
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // 这里应该添加管理员权限检查
    // const isAdmin = await checkAdminPermission(request);
    // if (!isAdmin) {
    //   return NextResponse.json(
    //     { error: 'Admin permission required' },
    //     { status: 403 }
    //   );
    // }
    
    const user = await permanentlyDeleteUser(params.id);
    
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ 
      message: 'User permanently deleted successfully',
      data: {
        id: user.id
      }
    });
  } catch (error) {
    console.error('Error permanently deleting user:', error);
    return NextResponse.json(
      { error: 'Failed to permanently delete user' },
      { status: 500 }
    );
  }
}