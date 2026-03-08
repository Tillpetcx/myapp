import { NextRequest, NextResponse } from 'next/server';
import { restoreUser } from '@/app/api/users/user-service';

// 恢复已删除的用户
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await restoreUser(params.id);
    
    if (!user) {
      return NextResponse.json(
        { error: 'User not found or not deleted' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ 
      message: 'User restored successfully',
      data: {
        id: user.id,
        isActive: user.isActive
      }
    });
  } catch (error) {
    console.error('Error restoring user:', error);
    return NextResponse.json(
      { error: 'Failed to restore user' },
      { status: 500 }
    );
  }
}