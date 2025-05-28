/* eslint-disable @typescript-eslint/no-explicit-any */
// src/services/api.ts
import apiClient from "./apiClient";
import { AxiosError, AxiosResponse } from "axios";

export interface ApiResponse<T> {
  resp_msg: string;
  data: T;
  resp_code: number;
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

// 封装下载文件的 POST 请求
export const downloadFile = async (
  url: string,
  data?: Record<string, any>
): Promise<void> => {
  try {
    const response = await apiClient.post(url, data, {
      responseType: "blob",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/octet-stream",
      },
    });

    // 从响应头中获取文件名
    const contentDisposition =
      response.headers["content-disposition"] || response.headers["attachment"];
    let filename = "download";

    if (contentDisposition) {
      const filenameMatch = contentDisposition.match(
        /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/i
      );
      if (filenameMatch && filenameMatch[1]) {
        filename = filenameMatch[1].replace(/['"]/g, "").trim();
      }
    }

    // 创建 Blob URL 并触发下载
    const blob = new Blob([response.data], {
      type: response.headers["content-type"] || "application/octet-stream",
    });
    const downloadUrl = window.URL.createObjectURL(blob);

    // 使用隐藏的 a 元素进行下载
    const link = document.createElement("a");
    link.style.display = "none";
    link.href = downloadUrl;
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();

    // 延迟清理，确保下载开始
    setTimeout(() => {
      window.URL.revokeObjectURL(downloadUrl);
      document.body.removeChild(link);
    }, 100);
  } catch (error) {
    handleRequestError(error as AxiosError, "DOWNLOAD");
  }
};
