import React from 'react';
import { ConfigProvider } from 'antd';
import 'antd/dist/antd.css';
import zhCN from 'antd/lib/locale/zh_CN';
import '@fepkg/components/assets/styles/antd-reset/index.less';
import '@fepkg/icon-park-react/dist/index.less';
import { themes } from '@storybook/theming';
import 'moment/dist/locale/zh-cn';
import { mockDateDecorator } from 'storybook-mock-date-decorator';
import { decorator as miscStoDecorator } from '../__tests__/miscStoMock';
import '@/assets/styles/global.less';

export const parameters = {
  actions: { argTypesRegex: '^on[A-Z].*' },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/
    }
  },
  docs: {
    theme: themes.dark
  }
};

export const decorators = [
  miscStoDecorator,
  mockDateDecorator,
  Story => (
    <ConfigProvider
      locale={zhCN}
      autoInsertSpaceInButton={false}
    >
      <Story />
    </ConfigProvider>
  )
];

const electronFakeApi = {
  sendMessage: (message: string) => {},
  minimize: () => {
    console.log('最小化');
  },
  maximize: () => {
    console.log('最大化');
  },
  close: () => {
    console.log('关闭');
  },
  on: (channel: string, callback: (data: any) => void) => {
    console.log('订阅');
  },
  remove: (channel: string) => {
    console.log('删除订阅');
  },
  // 查询当前页要设置的快捷键
  querySettingHotKey: (arg: any) => {
    console.log('查询快捷键');
  },
  // 保存快捷键
  saveHotKey: (arg: any) => {
    console.log('保存快捷键');
  },
  // 每个页面创建时调用，初始化快捷键
  initHotKey: (arg: any) => {
    console.log('初始化快捷键');
  }
};

window.Main = {
  ...window.Main,
  ...electronFakeApi
};

declare global {
  interface Window {
    Main: typeof electronFakeApi;
  }
}
