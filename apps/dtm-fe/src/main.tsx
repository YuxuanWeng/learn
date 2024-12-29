import { createRoot } from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import zhCN from 'antd/lib/locale/zh_CN';
import { FuzzySearchProvider } from '@fepkg/business/providers/FuzzySearchContext';
import '@fepkg/components/assets/styles/antd-reset/index.less';
import '@fepkg/components/assets/styles/overlayscrollbars-reset.less';
import '@fepkg/icon-park-react/dist/index.less';
import { initRequest } from '@fepkg/request';
import { queryClient } from '@/utils/query-client';
import { initWebTracer } from '@/utils/tracer';
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { Provider as JotaiProvider } from 'jotai';
import 'moment/dist/locale/zh-cn';
import { GLOBAL_SCOPE } from '@/common/atoms';
import request from '@/common/request';
import { useFuzzySearchQuery } from '@/common/services/hooks/useFuzzySearchQuery';
import { router } from '@/router';
import '@/assets/styles/global.less';

const isDev = import.meta.env.DEV;

const render = () => {
  const container = document.querySelector('#root');

  if (container) {
    initWebTracer();
    initRequest(request);

    const root = createRoot(container);

    root.render(
      <QueryClientProvider client={queryClient}>
        <ConfigProvider
          locale={zhCN}
          autoInsertSpaceInButton={false}
        >
          <JotaiProvider scope={GLOBAL_SCOPE}>
            <FuzzySearchProvider value={{ fuzzySearchHook: useFuzzySearchQuery }}>
              <RouterProvider router={router} />

              {isDev && (
                <ReactQueryDevtools
                  initialIsOpen={false}
                  closeButtonProps={{ className: 'select-none' }}
                />
              )}
            </FuzzySearchProvider>
          </JotaiProvider>
        </ConfigProvider>
      </QueryClientProvider>
    );
  }
};

render();
