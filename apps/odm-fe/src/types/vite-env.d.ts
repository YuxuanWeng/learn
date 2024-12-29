/* eslint-disable no-underscore-dangle */
/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_DEV_API_HOST: string;
  readonly VITE_TEST_API_HOST: string;
  readonly VITE_UAT_API_HOST: string;
  readonly VITE_PROD_API_HOST: string;
  readonly VITE_INTERNAL_API_HOST: string;
  readonly VITE_API_ALGO_BASE: string;
  readonly VITE_API_COMMON_BASE: string;
  readonly VITE_SENTRY_DSN: string;
  readonly VITE_SENTRY_URL: string;
  readonly VITE_SENTRY_ORG: string;
  readonly VITE_SENTRY_AUTH_TOKEN: string;
  readonly VITE_WEBSOCKET_HOST: string;
}

type AppEnv = 'dev' | 'test' | 'xintang' | 'xintang-uat';

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

declare const __APP_VERSION__: string;
declare const __API_ENV__: AppEnv;
declare const __APP_SHORT_HASH__: string;
declare const __APP_WEBSOCKET_HOST__: string;
