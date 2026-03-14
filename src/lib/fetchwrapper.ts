// lib/api.ts
import { toast } from 'sonner'; // 可选：使用 sonner / react-hot-toast 等提示库

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000/api';

/**
 * 主流的 fetch 封装工具类（类似 axios 风格）
 * 特点：
 * 1. 统一 baseURL（从 env 读取）
 * 2. 自动处理 JSON 请求/响应
 * 3. 自动携带 Authorization Bearer Token
 * 4. 统一的错误处理 + 可选 toast
 * 5. 支持 Next.js fetch 所有原生选项（cache、next: { revalidate, tags } 等）
 * 6. 支持 GET/POST/PUT/PATCH/DELETE 快捷方法
 */
class ApiClient {
  private baseURL: string;
  private token: string | null = null;

  constructor(baseURL: string = API_BASE_URL) {
    this.baseURL = baseURL;
  }

  /** 设置 Token（登录后调用） */
  setToken(token: string) {
    this.token = token;
  }

  /** 清除 Token（登出时调用） */
  clearToken() {
    this.token = null;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint.startsWith('/') ? '' : '/'}${endpoint}`;

    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...(this.token && { Authorization: `Bearer ${this.token}` }),
      ...options.headers,
    };

    // 自动序列化 body
    let body = options.body;
    if (body && typeof body !== 'string' && !(body instanceof FormData)) {
      body = JSON.stringify(body);
    }

    const config: RequestInit = {
      ...options,
      headers,
      body,
    };

    const response = await fetch(url, config);

    // 统一错误处理
    if (!response.ok) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      let errorData: any = {};
      try {
        errorData = await response.json();
      } catch {
        // 非 JSON 错误（如 500 纯文本）
        errorData = { message: response.statusText };
      }

      const errorMessage =
        errorData.message ||
        errorData.error ||
        `请求失败: ${response.status} ${response.statusText}`;

      // 可选：全局 toast 提示
      if (typeof window !== 'undefined') {
        toast.error(errorMessage);
      }

      // 抛出自定义错误，便于上层 catch
      const error = new Error(errorMessage);
      error.name = 'ApiError';
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (error as any).status = response.status;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (error as any).data = errorData;
      throw error;
    }

    // 支持返回空响应（如 204 No Content）
    if (response.status === 204) return {} as T;

    return response.json() as Promise<T>;
  }

  // ==================== 快捷方法 ====================
  get<T>(endpoint: string, options?: RequestInit) {
    return this.request<T>(endpoint, { ...options, method: 'GET' });
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  post<T>(endpoint: string, body?: any, options?: RequestInit) {
    return this.request<T>(endpoint, { ...options, method: 'POST', body });
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  put<T>(endpoint: string, body?: any, options?: RequestInit) {
    return this.request<T>(endpoint, { ...options, method: 'PUT', body });
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  patch<T>(endpoint: string, body?: any, options?: RequestInit) {
    return this.request<T>(endpoint, { ...options, method: 'PATCH', body });
  }

  delete<T>(endpoint: string, options?: RequestInit) {
    return this.request<T>(endpoint, { ...options, method: 'DELETE' });
  }
}

// ==================== 导出实例 ====================
export const api = new ApiClient();

// 如果你需要多个不同 baseURL 的实例，也可以导出类本身
export { ApiClient };