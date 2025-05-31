import axios from "axios";
import type { AxiosInstance, CancelTokenSource } from "axios";
import type { AxiosRequestConfig } from "axios";
import { defineNuxtPlugin } from "#app";
import { useInfoStore } from "~/stores/user";

export default defineNuxtPlugin((nuxtApp) => {
  const config = useRuntimeConfig();
  const userInfo = useInfoStore();

  // 创建 Axios 实例
  const api: AxiosInstance = axios.create({
    baseURL: (config.public.apiBaseUrl as string) || "https://api.example.com",
    timeout: 30 * 1000,
  });

  // 保存当前请求的取消 Token，key用 method + url 简单做唯一标识
  const pendingRequests = new Map<string, CancelTokenSource>();

  // 生成请求唯一 key
  function getRequestKey(config: AxiosRequestConfig) {
    return `${config.method}-${config.url}`;
  }

  // 请求拦截器
  api.interceptors.request.use(
    (config) => {
      // 自动携带 token
      const token = userInfo?.token || "";
      if (token) {
        config.headers = config.headers || {};
        config.headers.Authorization = `Bearer ${token}`;
      }

      // 生成取消token并挂载
      const source = axios.CancelToken.source();
      config.cancelToken = source.token;

      // 生成请求key，取消重复请求
      const requestKey = getRequestKey(config);
      if (pendingRequests.has(requestKey)) {
        // 取消之前未完成的请求
        pendingRequests.get(requestKey)?.cancel("取消重复请求");
        pendingRequests.delete(requestKey);
      }
      pendingRequests.set(requestKey, source);

      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  // 响应拦截器
  api.interceptors.response.use(
    (response) => {
      // 响应完成，删除对应取消token
      const requestKey = getRequestKey(response.config);
      pendingRequests.delete(requestKey);

      // 返回实际数据
      return response.data;
    },
    (error) => {
      if (axios.isCancel(error)) {
        console.log("请求取消", error.message);
      }

      if (error.response?.status === 401) {
        const router = useRouter();
        router.push("/login");
      }

      if (error.config) {
        const requestKey = getRequestKey(error.config);
        pendingRequests.delete(requestKey);
      }

      return Promise.reject(error);
    }
  );

  // 增加取消请求的辅助方法
  function cancelRequest(method: string, url: string, message = "请求被取消") {
    const key = `${method}-${url}`;
    if (pendingRequests.has(key)) {
      pendingRequests.get(key)?.cancel(message);
      pendingRequests.delete(key);
    }
  }

  // 全局注入 axios 和取消请求方法
  return {
    provide: {
      axios: api,
      cancelRequest,
    },
  };
});
