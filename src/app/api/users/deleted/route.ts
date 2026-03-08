import { NextRequest, NextResponse } from 'next/server';
import { getDeletedUsers } from '@/app/api/users/user-service';

// 获取已删除的用户列表
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const sortBy = searchParams.get('sortBy') || 'deletedAt';
    const sortOrder = searchParams.get('sortOrder') || 'desc';
    
    const users = await getDeletedUsers();
    
    // 简单分页逻辑
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedUsers = users.slice(startIndex, endIndex);
    
    return NextResponse.json({
      data: paginatedUsers,
      pagination: {
        page,
        limit,
        total: users.length,
        totalPages: Math.ceil(users.length / limit),
      },
    });
  } catch (error) {
    console.error('Error fetching deleted users:', error);
    return NextResponse.json(
      { error: 'Failed to fetch deleted users' },
      { status: 500 }
    );
  }
}