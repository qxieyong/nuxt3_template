// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-05-15",
  ssr: true,
  devtools: { enabled: true },
  modules: ["@element-plus/nuxt", "@pinia/nuxt", "@nuxtjs/i18n"],
  css: ["~/assets/scss/main.scss"],
  nitro: {
    preset: "static",
  },

  runtimeConfig: {
    public: {
      apiBaseUrl: process.env.API_BASE_URL || "",
      featureFlag: process.env.FEATURE_FLAG === "true",
    },
  },

  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: '@use "~/assets/scss/variables.scss" as *;',
        },
      },
    },

    server: {
      proxy: {
        "/api": {
          target: process.env.API_BASE_URL,
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, ""),
        },
      },
    },

    // 生产环境移除 console 和 debugger(SSR)
    build: {
      terserOptions: {
        compress: {
          drop_console: true,
          drop_debugger: true,
        },
      },
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes("node_modules")) {
              return "vendors";
            }
          },
        },
      },
    },

    // 生产环境移除 console 和 debugger(SSG)
    esbuild:
      process.env.NODE_ENV === "production"
        ? { drop: ["console", "debugger"] }
        : {},
  },

  pinia: {
    autoImports: ["defineStore"], // 可选，自动导入 defineStore === import { defineStore } from 'pinia'
  },

  postcss: {
    plugins: {
      "@tailwindcss/postcss": {},
      autoprefixer: {},
    },
  },

  devServer: {
    port: 3000, // 这里改成你想要的端口
    host: "localhost", // 如果需要外网访问
  },

  i18n: {
    langDir: "locales", // 设置的语言目录
    defaultLocale: "en", // 默认选择英文
    lazy: true,
    strategy: "no_prefix",
    locales: [
      // 设置对应的语言文件列表
      { code: "zh", name: "简体中文", file: "zh.json" },
      { code: "en", name: "English", file: "en.json" },
    ],
    // 语言切换时重定向
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: "i18n_redirected",
      fallbackLocale: "en",
    },
  },

  app: {
    head: {
      title: "标题",
      meta: [{ name: "description", content: "" }],
      link: [
        // ico 格式，兼容最广
        { rel: "icon", type: "image/x-icon", href: "/favicon.ico" },

        // png 格式（可以加多个尺寸）
        {
          rel: "icon",
          type: "image/png",
          href: "/favicon.png",
        },

        // svg 格式（现代浏览器支持）
        { rel: "icon", type: "image/svg+xml", href: "/favicon.svg" },
      ],
    },
  },
});
