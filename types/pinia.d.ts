// types/pinia.d.ts
import { PiniaNuxtConfig } from '@pinia/nuxt'

declare module 'nuxt/schema' {
  interface NuxtConfig {
    pinia?: PiniaNuxtConfig
  }
  interface NuxtOptions {
    pinia?: PiniaNuxtConfig
  }
}

export {}