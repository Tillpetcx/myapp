/**
 * API 响应的基础接口
 */
/* eslint-disable @typescript-eslint/no-explicit-any */
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  status: number;
}

/**
 * 请求配置选项
 */
export interface FetchOptions extends RequestInit {
  timeout?: number; // 请求超时时间（毫秒）
  retries?: number; // 重试次数
  retryDelay?: number; // 重试延迟（毫秒）
  baseURL?: string; // 基础URL
  headers?: Record<string, string>; // 请求头
  params?: Record<string, any>; // URL参数
  data?: any; // 请求体数据
  skipErrorHandler?: boolean; // 跳过全局错误处理
  skipAuthHeader?: boolean; // 跳过添加认证头
}

/**
 * 错误类型
 */
export class ApiError extends Error {
  status: number;
  data?: any;

  constructor(message: string, status: number, data?: any) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }
}

/**
 * 默认配置
 */
const DEFAULT_CONFIG: Partial<FetchOptions> = {
  timeout: 10000, // 10秒超时
  retries: 0, // 默认不重试
  retryDelay: 1000, // 1秒重试延迟
  headers: {
    'Content-Type': 'application/json',
  },
};

/**
 * 获取认证token（可根据实际情况修改）
 */
const getAuthToken = (): string | null => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
  }
  return null;
};

/**
 * 添加认证头
 */
const addAuthHeaders = (headers: Record<string, string>): Record<string, string> => {
  const token = getAuthToken();
  if (token) {
    return {
      ...headers,
      Authorization: `Bearer ${token}`,
    };
  }
  return headers;
};

/**
 * 处理URL参数
 */
const buildURL = (url: string, params?: Record<string, any>): string => {
  if (!params) return url;
  
  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      searchParams.append(key, String(value));
    }
  });
  
  const queryString = searchParams.toString();
  return queryString ? `${url}${url.includes('?') ? '&' : '?'}${queryString}` : url;
};

/**
 * 处理响应
 */
const handleResponse = async <T>(response: Response): Promise<ApiResponse<T>> => {
  const status = response.status;
  
  // 尝试解析JSON响应
  let data: any;
  try {
    data = await response.json();
  } catch (error) {
    // 如果不是JSON响应，使用文本内容
    const text = await response.text();
    data = { message: text };
  }
  
  // 构造统一的响应格式
  const result: ApiResponse<T> = {
    success: response.ok,
    status,
    data: response.ok ? data : undefined,
    message: response.ok ? (data.message || '请求成功') : undefined,
    error: !response.ok ? (data.error || data.message || '请求失败') : undefined,
  };
  
  // 如果响应不成功，抛出错误
  if (!response.ok) {
    throw new ApiError(result.error || '请求失败', status, data);
  }
  
  return result;
};

/**
 * 带超时的fetch
 */
const fetchWithTimeout = (url: string, options: RequestInit, timeout: number): Promise<Response> => {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      reject(new Error(`请求超时 (${timeout}ms)`));
    }, timeout);
    
    fetch(url, options)
      .then(response => {
        clearTimeout(timer);
        resolve(response);
      })
      .catch(error => {
        clearTimeout(timer);
        reject(error);
      });
  });
};

/**
 * 带重试的fetch
 */
const fetchWithRetry = async (
  url: string, 
  options: RequestInit, 
  retries: number, 
  retryDelay: number
): Promise<Response> => {
  let lastError: Error;
  
  for (let i = 0; i <= retries; i++) {
    try {
      return await fetch(url, options);
    } catch (error) {
      lastError = error as Error;
      
      // 如果是最后一次尝试，直接抛出错误
      if (i === retries) {
        throw lastError;
      }
      
      // 等待一段时间后重试
      await new Promise(resolve => setTimeout(resolve, retryDelay));
    }
  }
  
  throw lastError!;
};

/**
 * 核心请求方法
 */
const coreRequest = async <T = any>(
  url: string,
  options: FetchOptions = {}
): Promise<ApiResponse<T>> => {
  // 合并配置
  const config = { ...DEFAULT_CONFIG, ...options };
  
  // 处理基础URL
  const baseURL = config.baseURL || '';
  const fullUrl = baseURL ? `${baseURL}${url}` : url;
  
  // 处理URL参数
  const finalUrl = buildURL(fullUrl, config.params);
  
  // 处理请求头
  let headers = { ...DEFAULT_CONFIG.headers, ...config.headers };
  if (!config.skipAuthHeader) {
    headers = addAuthHeaders(headers);
  }
  
  // 处理请求体
  let body: string | undefined;
  if (config.data) {
    if (typeof config.data === 'string') {
      body = config.data;
    } else {
      body = JSON.stringify(config.data);
    }
  }
  
  // 构造最终请求选项
  const requestOptions: RequestInit = {
    method: config.method || 'GET',
    headers,
    body,
    ...config,
  };
  
  try {
    // 发送请求
    let response: Response;
    
    if (config.timeout && config.timeout > 0) {
      // 带超时的请求
      if (config.retries && config.retries > 0) {
        // 带超时和重试的请求
        response = await fetchWithRetry(finalUrl, requestOptions, config.retries, config.retryDelay!);
      } else {
        // 仅带超时的请求
        response = await fetchWithTimeout(finalUrl, requestOptions, config.timeout);
      }
    } else {
      // 普通请求
      response = await fetch(finalUrl, requestOptions);
    }
    
    // 处理响应
    return await handleResponse<T>(response);
  } catch (error) {
    // 处理错误
    if (error instanceof ApiError) {
      throw error;
    }
    
    // 网络错误或其他错误
    throw new ApiError(
      error instanceof Error ? error.message : '未知错误',
      0,
      error
    );
  }
};

/**
 * 封装的fetch方法
 */
export const fetchWrapper = {
  /**
   * GET请求
   */
  get: <T = any>(url: string, options: FetchOptions = {}) => 
    coreRequest<T>(url, { ...options, method: 'GET' }),
  
  /**
   * POST请求
   */
  post: <T = any>(url: string, data?: any, options: FetchOptions = {}) => 
    coreRequest<T>(url, { ...options, method: 'POST', data }),
  
  /**
   * PUT请求
   */
  put: <T = any>(url: string, data?: any, options: FetchOptions = {}) => 
    coreRequest<T>(url, { ...options, method: 'PUT', data }),
  
  /**
   * PATCH请求
   */
  patch: <T = any>(url: string, data?: any, options: FetchOptions = {}) => 
    coreRequest<T>(url, { ...options, method: 'PATCH', data }),
  
  /**
   * DELETE请求
   */
  delete: <T = any>(url: string, options: FetchOptions = {}) => 
    coreRequest<T>(url, { ...options, method: 'DELETE' }),
  
  /**
   * 自定义请求
   */
  request: coreRequest,
};

/**
 * 设置默认配置
 */
export const setDefaultConfig = (config: Partial<FetchOptions>) => {
  Object.assign(DEFAULT_CONFIG, config);
};

/**
 * 设置认证token获取方法
 */
export const setAuthTokenGetter = (getter: () => string | null) => {
  // 这个函数可以根据需要实现
};