// src/services/apiClient.ts
import axios from "axios";

// 创建一个 Axios 实例
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL, // 使用环境变量配置基础 URL
  timeout: 10000, // 设置请求超时时间
});

// 请求拦截器
apiClient.interceptors.request.use(
  (config) => {
    // 在发送请求之前做些什么
    // 例如：添加认证 token
    // config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => {
    // 对请求错误做些什么
    return Promise.reject(error);
  }
);

// 响应拦截器
apiClient.interceptors.response.use(
  (response) => {
    // 对响应数据做些什么
    return response;
  },
  (error) => {
    // 对响应错误做些什么
    return Promise.reject(error);
  }
);

export default apiClient;
