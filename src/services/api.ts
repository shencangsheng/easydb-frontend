/* eslint-disable @typescript-eslint/no-explicit-any */
// src/services/api.ts
import apiClient from "./apiClient";
import { AxiosError, AxiosResponse } from "axios";

interface ApiResponse<T> {
  message: string;
  data: T;
}

// 统一处理请求错误
const handleRequestError = (error: AxiosError, method: string) => {
  console.error(`Error in ${method} request:`, error);
  throw error;
};

// 统一处理请求响应
const handleResponse = async <T>(
  requestPromise: Promise<AxiosResponse<ApiResponse<T>>>,
  method: string
): Promise<T> => {
  try {
    const response = await requestPromise;
    return response.data.data;
  } catch (error) {
    return handleRequestError(error as AxiosError, method);
  }
};
// 封装 GET 请求
export const get = async <T, D = any>(
  url: string,
  params?: Record<string, D>
): Promise<T> => {
  return handleResponse<T>(
    apiClient.get<ApiResponse<T>>(url, { params }),
    "GET"
  );
};

// 封装 POST 请求
export const post = async <D, T>(
  url: string,
  data?: Record<string, D>
): Promise<T> => {
  return handleResponse<T>(apiClient.post<ApiResponse<T>>(url, data), "POST");
};

// 封装 PUT 请求
export const put = async <D, T>(
  url: string,
  data?: Record<string, D>
): Promise<T> => {
  return handleResponse<T>(apiClient.put<ApiResponse<T>>(url, data), "PUT");
};

// 封装 DELETE 请求
export const del = async <T>(url: string): Promise<T> => {
  return handleResponse<T>(apiClient.delete<ApiResponse<T>>(url), "DELETE");
};
