import { fetchWrapper, ApiResponse } from '@/lib/fetchwrapper';

// 用户相关的API接口
export interface User {
  id: string;
  email: string;
  username?: string;
  firstName?: string;
  lastName?: string;
  avatar?: string;
  bio?: string;
  phone?: string;
  isActive: boolean;
  isVerified: boolean;
  isDeleted?: boolean;
  deletedAt?: string;
  role: 'USER' | 'ADMIN' | 'MODERATOR';
  createdAt: string;
  updatedAt: string;
}

// 创建用户的请求参数
export interface CreateUserRequest {
  email: string;
  username?: string;
  password: string;
  firstName?: string;
  lastName?: string;
}

// 更新用户的请求参数
export interface UpdateUserRequest {
  email?: string;
  username?: string;
  password?: string;
  firstName?: string;
  lastName?: string;
  avatar?: string;
  bio?: string;
  phone?: string;
  isActive?: boolean;
  isVerified?: boolean;
  role?: 'USER' | 'ADMIN' | 'MODERATOR';
}

// 分页参数
export interface PaginationParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

// 分页响应
export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

/**
 * 用户API服务
 */
export const userService = {
  /**
   * 获取用户列表
   */
  getUsers: (params?: PaginationParams) => 
    fetchWrapper.get<PaginatedResponse<User>>('/api/users', { params }),
  
  /**
   * 根据ID获取用户
   */
  getUserById: (id: string) => 
    fetchWrapper.get<User>(`/api/users/${id}`),
  
  /**
   * 创建用户
   */
  createUser: (userData: CreateUserRequest) => 
    fetchWrapper.post<User>('/api/users', userData),
  
  /**
   * 更新用户
   */
  updateUser: (id: string, userData: UpdateUserRequest) => 
    fetchWrapper.put<User>(`/api/users/${id}`, userData),
  
  /**
   * 逻辑删除用户
   */
  deleteUser: (id: string) => 
    fetchWrapper.delete<{ message: string; data: { id: string; deletedAt: string } }>(`/api/users/${id}`),
  
  /**
   * 恢复已删除的用户
   */
  restoreUser: (id: string) => 
    fetchWrapper.post<User>(`/api/users/${id}/restore`),
  
  /**
   * 永久删除用户（物理删除，仅管理员可用）
   */
  permanentlyDeleteUser: (id: string) => 
    fetchWrapper.delete<User>(`/api/users/${id}/permanent`),
  
  /**
   * 获取已删除的用户列表
   */
  getDeletedUsers: (params?: PaginationParams) => 
    fetchWrapper.get<PaginatedResponse<User>>('/api/users/deleted', { params }),
  
  /**
   * 根据邮箱获取用户
   */
  getUserByEmail: (email: string) => 
    fetchWrapper.get<User>('/api/users', { params: { email } }),
  
  /**
   * 根据用户名获取用户
   */
  getUserByUsername: (username: string) => 
    fetchWrapper.get<User>('/api/users', { params: { username } }),
  
  /**
   * 搜索用户
   */
  searchUsers: (query: string, params?: PaginationParams) => 
    fetchWrapper.get<PaginatedResponse<User>>('/api/users/search', { 
      params: { q: query, ...params } 
    }),
  
  /**
   * 更新用户状态
   */
  updateUserStatus: (id: string, isActive: boolean) => 
    fetchWrapper.patch<User>(`/api/users/${id}/status`, { isActive }),
  
  /**
   * 验证用户邮箱
   */
  verifyUserEmail: (id: string) => 
    fetchWrapper.post<User>(`/api/users/${id}/verify`),
  
  /**
   * 更改用户角色
   */
  changeUserRole: (id: string, role: 'USER' | 'ADMIN' | 'MODERATOR') => 
    fetchWrapper.patch<User>(`/api/users/${id}/role`, { role }),
  
  /**
   * 上传用户头像
   */
  uploadAvatar: (id: string, file: File) => {
    const formData = new FormData();
    formData.append('avatar', file);
    
    return fetchWrapper.post<{ avatarUrl: string }>(`/api/users/${id}/avatar`, formData, {
      headers: {
        // 不设置Content-Type，让浏览器自动设置multipart/form-data
      },
    });
  },
  
  /**
   * 更改密码
   */
  changePassword: (id: string, currentPassword: string, newPassword: string) => 
    fetchWrapper.post<{ message: string }>(`/api/users/${id}/change-password`, {
      currentPassword,
      newPassword,
    }),
  
  /**
   * 重置密码
   */
  resetPassword: (email: string) => 
    fetchWrapper.post<{ message: string }>('/api/users/reset-password', { email }),
  
  /**
   * 确认重置密码
   */
  confirmResetPassword: (token: string, newPassword: string) => 
    fetchWrapper.post<{ message: string }>('/api/users/confirm-reset-password', {
      token,
      newPassword,
    }),
};