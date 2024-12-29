import { defineConfig, loadEnv } from 'vite';
import compression from 'vite-plugin-compression2';
import react from '@vitejs/plugin-react-swc';
import { execSync } from 'node:child_process';
import { join, resolve } from 'path';
import { visualizer } from 'rollup-plugin-visualizer';
import packageConfig from './package.json';

const root = join(__dirname, 'src');
const gitShortHash = execSync('git rev-parse --short HEAD').toString().trim();
const API_ENV_MAP = {
  development: 'dev',
  production: 'dev',
  dev: 'dev',
  test: 'test',
  xintang: 'xintang',
  'xintang-uat': 'xintang-uat'
};

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, __dirname) as ImportMetaEnv;
  const apiProxyMap = {
    dev: env.VITE_DEV_API_HOST,
    test: env.VITE_TEST_API_HOST,
    prod: env.VITE_PROD_API_HOST
  };

  //
  const proxies = {
    '/mock/api/v1/bdm': {
      target: env.VITE_DEV_API_HOST,
      changeOrigin: true
    }
  };

  Object.keys(apiProxyMap).forEach(key => {
    const value = apiProxyMap[key];
    const apiBase = env.VITE_API_COMMON_BASE;

    proxies[`/${key}${apiBase}`] = {
      changeOrigin: true,
      target: value,
      rewrite: path => {
        const res = path.replace(`/${key}${apiBase}`, apiBase);
        return res;
      }
    };
  });

  return {
    define: {
      __APP_VERSION__: JSON.stringify(packageConfig.version),
      // 从 vite --mode 中获得
      __API_ENV__: JSON.stringify(API_ENV_MAP[mode] ?? 'dev'),
      __APP_SHORT_HASH__: JSON.stringify(gitShortHash),
      __APP_WEBSOCKET_HOST__: JSON.stringify(env.VITE_WEBSOCKET_HOST ?? '')
    },
    plugins: [
      react(),
      visualizer({ open: true, gzipSize: true, brotliSize: true }),
      compression({ algorithm: 'brotliCompress', include: [/\.(js|mjs|json|css|html)$/i] })
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
      sourcemap: true,
      emptyOutDir: true,
      rollupOptions: {
        treeshake: 'recommended',
        input: ['/index.html']
      }
    },
    server: {
      proxy: {
        ...proxies,
        [env.VITE_API_COMMON_BASE]: {
          changeOrigin: true,
          target: env.VITE_DEV_API_HOST
        }
      }
    }
  };
});
