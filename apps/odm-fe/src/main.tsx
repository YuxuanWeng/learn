import { createRoot } from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import zhCN from 'antd/lib/locale/zh_CN';
import '@fepkg/components/assets/styles/antd-reset/index.less';
import '@fepkg/components/assets/styles/overlayscrollbars-reset.less';
import '@fepkg/icon-park-react/dist/index.less';
import { initRequest } from '@fepkg/request';
import { queryClient } from '@/utils/query-client';
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import 'moment/dist/locale/zh-cn';
import request from './common/request';
import { router } from './router';
import '@/assets/styles/global.less';

const isDev = import.meta.env.DEV;

const Root = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <ConfigProvider
        locale={zhCN}
        autoInsertSpaceInButton={false}
      >
        <RouterProvider router={router} />
        {isDev && (
          <ReactQueryDevtools
            initialIsOpen={false}
            closeButtonProps={{ className: 'select-none' }}
          />
        )}
      </ConfigProvider>
    </QueryClientProvider>
  );
};

const startMock = async () => {
  const { worker } = await import('@fepkg/mock/browser');
  await worker.start({ onUnhandledRequest: 'bypass' });
};

const render = () => {
  const root = document.getElementById('root');
  if (!root) return;
  initRequest(request);

  // 开发环境启用mock
  if (isDev) startMock();
  createRoot(root).render(<Root />);
};

render();
