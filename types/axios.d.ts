import type { AxiosInstance } from "axios";

declare module "#app" {
  interface NuxtApp {
    $axios: AxiosInstance;
    $cancelRequest: (method: string, url: string, message?: string) => void;
  }
}

export {};
