import { mergeConfig } from 'vite';
import topLevelAwait from 'vite-plugin-top-level-await';
import type { StorybookConfig } from '@storybook/react-vite';
import { join, resolve } from 'path';
import iconsReader from '../scripts/utils/icons';
import twcss from '../tailwind.config';

const root = join(__dirname, '../src');
const app = join(__dirname, '../electron');
const packages = join(__dirname, '../packages');
const config: StorybookConfig = {
  stories: [
    '../src/**/*.stories.@(js|jsx|ts|tsx)',
    '../packages/**/*.stories.@(js|jsx|ts|tsx)',
    '../packages-mono/**/*.stories.@(js|jsx|ts|tsx)'
  ],
  addons: [
    '@storybook/addon-links',
    { name: '@storybook/addon-essentials', options: { actions: false, controls: false } },
    '@storybook/addon-interactions'
  ],
  framework: {
    name: '@storybook/react-vite',
    options: {}
  },
  core: {
    disableTelemetry: true
  },
  features: {
    storyStoreV7: true
  },
  async viteFinal(config) {
    return mergeConfig(config, {
      plugins: [topLevelAwait()],
      css: {
        preprocessorOptions: {
          less: {
            javascriptEnabled: true
          }
        }
      },
      resolve: {
        alias: [
          {
            find: '@/localdb/miscStorage',
            replacement: resolve(__dirname, '../__tests__/miscStoMock')
          },
          {
            // 顺序上要在 @ 之前
            // https://rollupjs.org/guide/en/#resolveid
            find: '@packages/logger',
            replacement: resolve(__dirname, '../__tests__/loggerMock'),
            customResolver: (source, importer, { custom }) => {
              let res = '';
              if (/performance/.test(source)) res = source.slice(0, -12) + '/helpers/performance' + '.js';
              else if (/types/.test(source)) res = packages + '/logger/types.ts';
              else res = source + '/index.js';
              return res;
            }
          },
          { find: '@', replacement: root },
          { find: '~', replacement: resolve(root, 'assets') },
          { find: 'app', replacement: app },
          { find: '@packages', replacement: packages }
        ]
      },
      define: {
        _twColors: JSON.stringify(twcss.theme.extend.colors),
        _twIcons: JSON.stringify(iconsReader.getNames())
      },
      server: {
        port: 6006,
        proxy: {
          '/dev/api/v1/bdm': {
            changeOrigin: true,
            target: 'https://api-dev.zoople.cn',
            rewrite: path => path.replace('/dev/api/v1/bdm', '/api/v1/bdm')
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
          'react',
          'antd',
          'antd/lib/locale/zh_CN',
          '@storybook/theming',
          'moment/dist/locale/zh-cn',
          'storybook-mock-date-decorator'
        ]
      }
    });
  },
  docs: { autodocs: true }
};

export default config;
