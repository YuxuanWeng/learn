import { IndexHtmlTransformHook, loadEnv } from 'vite';
import compression from 'vite-plugin-compression2';
import { ConfigEnv, defineConfig } from 'vitest/config';
import { SentryVitePluginOptions } from '@sentry/vite-plugin';
import react from '@vitejs/plugin-react-swc';
import { execSync } from 'node:child_process';
import { join, resolve } from 'path';
import { visualizer } from 'rollup-plugin-visualizer';
import packageConfig from './package.json';

// TODO Sentry Config

const gitShortHash = execSync('git rev-parse --short HEAD').toString().trim();

const API_ENV_MAP = {
  development: 'dev',
  production: 'dev',
  dev: 'dev',
  test: 'test',
  xintang: 'xintang',
  'xintang-uat': 'xintang-uat'
};

const transformHtml = (version: string) => {
  const transformIndexHtml: IndexHtmlTransformHook = html => {
    return html.replace('%__APP_SHORT_HASH__%', version);
  };
  return { name: 'html-transform', transformIndexHtml };
};

export default ({ mode }: ConfigEnv) => {
  const env = loadEnv(mode, __dirname) as ImportMetaEnv;

  const sentryConfig: SentryVitePluginOptions = {
    url: env.VITE_SENTRY_URL,
    authToken: env.VITE_SENTRY_AUTH_TOKEN,
    org: env.VITE_SENTRY_ORG,
    project: 'da-react',
    debug: true
  };

  const apiProxyMap = {
    dev: env.VITE_DEV_API_HOST,
    test: env.VITE_TEST_API_HOST
  };

  const proxies = {};

  Object.keys(apiProxyMap).forEach(key => {
    const value = apiProxyMap[key];
    const apiBase = env.VITE_API_COMMON_BASE;

    proxies[`/${key}${apiBase}`] = {
      changeOrigin: true,
      target: value,
      rewrite: path => path.replace(`/${key}${apiBase}`, apiBase)
    };
  });

  // 在项目环境中注入环境变量
  // https://github.com/vitejs/vite/issues/1930
  Object.assign(process.env, loadEnv(mode, process.cwd(), ''));

  const root = join(__dirname, 'src');

  return defineConfig({
    define: {
      __APP_VERSION__: JSON.stringify(packageConfig.version),
      // 从 vite --mode 中获得
      __API_ENV__: JSON.stringify(API_ENV_MAP[mode] ?? 'dev'),
      __APP_SHORT_HASH__: JSON.stringify(gitShortHash),
      __APP_WEBSOCKET_HOST__: JSON.stringify(env.VITE_WEBSOCKET_HOST ?? '')
    },
    plugins: [
      react(),
      compression({ algorithm: 'brotliCompress', include: [/\.(js|mjs|json|css|html)$/i] }),
      // 打包依赖展示
      visualizer({ open: true, gzipSize: true, brotliSize: true }),
      transformHtml(gitShortHash)
      // sentryVitePlugin(sentryConfig)
    ],
    css: {
      preprocessorOptions: {
        less: {
          javascriptEnabled: true
        }
      }
    },
    resolve: {
      alias: {
        '@': root,
        '~': resolve(root, 'assets'),
        protobufjs: 'protobufjs/dist/protobuf.min.js'
      }
    },
    build: {
      // sourcemap: true,
      emptyOutDir: true,
      rollupOptions: {
        treeshake: 'recommended',
        input: ['/index.html']
      }
    },
    server: {
      proxy: {
        // 本地转发trace/log相关url
        '/api/v1/infra': {
          changeOrigin: true,
          target: env.VITE_DEV_API_HOST
        },
        ...proxies,
        [env.VITE_API_COMMON_BASE]: {
          changeOrigin: true,
          target: env.VITE_DEV_API_HOST
        }
      }
    },
    optimizeDeps: {
      exclude: ['path'],
      include: [
        'msw',
        '@faker-js/faker',
        '@faker-js/faker/locale/zh_CN',
        'lodash-es',
        'react-virtual',
        'use-immer',
        'rc-picker',
        'rc-picker/lib/generate/moment',
        'rc-picker/lib/locale/zh_CN',
        'ahooks',
        '@sentry/electron',
        '@dnd-kit/core',
        '@dnd-kit/sortable'
      ]
    }
  });
};
