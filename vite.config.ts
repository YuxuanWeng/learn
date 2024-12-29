import type { ConfigEnv } from 'vite';
import { loadEnv } from 'vite';
import compression from 'vite-plugin-compression2';
import { defineConfig } from 'vitest/config';
import { SentryVitePluginOptions, sentryVitePlugin } from '@sentry/vite-plugin';
import react from '@vitejs/plugin-react-swc';
import { execSync } from 'child_process';
import { join, resolve } from 'path';
import { visualizer } from 'rollup-plugin-visualizer';
import { getAppConfig } from './get-app-config';

const gitShortHash = execSync('git rev-parse --short HEAD').toString().trim();

const appConfig = getAppConfig();

const sentryConfig: SentryVitePluginOptions = {
  url: 'https://shihetech-gp.sentry.io/',
  authToken: 'a4ffaa56ffd04d4faf0b8a4f7d2dc605cd84e51b960a4d558250a1ecd4e45de2',
  org: 'shihetech-gp',
  project: 'oms-react',
  debug: true
};

export default ({ command, mode }: ConfigEnv) => {
  const env = loadEnv(mode, __dirname) as ImportMetaEnv;

  const apiProxyMap = {
    dev: env.VITE_DEV_API_HOST,
    test: env.VITE_TEST_API_HOST,
    algo_dev: env.VITE_ALGO_DEV_API_HOST,
    algo_test: env.VITE_ALGO_TEST_API_HOST
  };

  const proxies = {};

  Object.keys(apiProxyMap).forEach(key => {
    const value = apiProxyMap[key];

    const isAlgo = key.startsWith('algo');

    const apiBase = isAlgo ? env.VITE_API_ALGO_BASE : env.VITE_API_COMMON_BASE;

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
  const app = join(__dirname, 'electron');
  const packages = join(__dirname, 'packages');
  const base =
    command === 'serve'
      ? '/' // DEV
      : './'; // PROD

  return defineConfig({
    define: {
      __APP_SHORT_HASH__: JSON.stringify(gitShortHash)
    },
    root,
    base,
    plugins: [
      react(),
      compression({ algorithm: 'brotliCompress', include: [/\.(js|mjs|json|css|html)$/i] }),
      // 打包依赖展示
      visualizer({ open: true, gzipSize: true, brotliSize: true })
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
        app,
        '@packages': packages,
        protobufjs: 'protobufjs/dist/protobuf.min.js',
        fs: require.resolve('rollup-plugin-node-builtins')
      }
    },
    build: {
      // sourcemap: true,
      outDir: join(root, '/out'),
      emptyOutDir: true,
      rollupOptions: {
        treeshake: 'recommended',
        input: ['/index.html', '/loading.html', '/loadFailure.html', '/factoryReset.html']
      },
      target: ['chrome108']
    },
    server: {
      port: process.env.PORT === undefined ? 3000 : +process.env.PORT,
      proxy: {
        // minio 图片上传链接代理
        '/dev/img': {
          changeOrigin: true,
          target: 'http://minio-api-dev.zoople.cn',
          rewrite: path => path.replace('/dev', '')
        },
        '/test/img': {
          changeOrigin: true,
          target: 'http://minio-api-test.zoople.cn',
          rewrite: path => path.replace('/test', '')
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
    },
    test: {
      root: '.',
      env,
      globals: true,
      environment: 'jsdom',
      include: [
        resolve(__dirname, 'electron/**/*.{test,spec}.*'),
        resolve(__dirname, 'packages/**/*.{test,spec}.*'),
        resolve(__dirname, 'packages-mono/**/*.{test,spec}.*'),
        resolve(__dirname, 'scripts/utils/**.{test,spec}.*'),
        resolve(__dirname, 'src/pages/**/*.{test,spec}.*'),
        resolve(__dirname, 'src/components/**/*.{test,spec}.*'),
        resolve(__dirname, 'src/common/utils/**/*.{test,spec}.*'),
        resolve(__dirname, 'src/common/hooks/**/*.{test,spec}.*')
      ],
      setupFiles: [resolve(__dirname, '__tests__/setup.ts')],
      coverage: {
        reportsDirectory: resolve(__dirname, '.coverage/'),
        include: [
          'src/pages/**/utils',
          'src/components/',
          'src/common/utils',
          'scripts/utils/',
          'packages/utils',
          'packages/logger',
          'packages-mono/components/'
        ],
        all: true,
        exclude: [
          '**/*.spec.*',
          '**/*.stories.*',
          '__tests__',
          'src/components/AntDesignTheme',
          '**/services',
          '**/index.ts',
          '**/types.ts'
        ],
        reporter: ['text', 'html']
      }
    }
  });
};
