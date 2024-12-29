/* eslint-disable no-underscore-dangle */
/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_ALGO_DEV_API_HOST: string;
  readonly VITE_ALGO_TEST_API_HOST: string;
  readonly VITE_DEV_API_HOST: string;
  readonly VITE_TEST_API_HOST: string;
  readonly VITE_API_ALGO_BASE: string;
  readonly VITE_API_COMMON_BASE: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

declare const __APP_SHORT_HASH__: string;
