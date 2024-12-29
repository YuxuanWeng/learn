import { createRoot } from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import zhCN from 'antd/lib/locale/zh_CN';
import { CentrifugeProvider } from '@fepkg/business/providers/Centrifuge';
import { FuzzySearchProvider } from '@fepkg/business/providers/FuzzySearchContext';
import { WatermarkProvider } from '@fepkg/components/Watermark';
import '@fepkg/components/assets/styles/antd-reset/index.less';
import '@fepkg/components/assets/styles/overlayscrollbars-reset.less';
import '@fepkg/icon-park-react/dist/index.less';
import { initRequest } from '@fepkg/request';
import { QueryClientProvider } from '@tanstack/react-query';
import { UtilEventEnum } from 'app/types/IPCEvents';
import { CommonRoute } from 'app/types/window-v2';
import { Provider as JotaiProvider } from 'jotai';
import localforage from 'localforage';
import 'moment/dist/locale/zh-cn';
import { initWebTracer } from '@packages/trace/web';
import request from '@/common/request';
import { useFuzzySearchQuery } from '@/common/services/hooks/useFuzzySearchQuery';
import { queryClient } from '@/common/utils/query-client';
import { router } from '@/router';
import { isServerTimestamp } from './common/ab-rules';
import { GLOBAL_SCOPE } from './common/atoms';
import { AccessProvider } from './common/providers/AccessProvider';
import { LoggerProvider } from './common/providers/LoggerProvider';
import { MemoryInfoView } from './components/MemoryInfoView';
import { NavigatorItemId } from './components/Navigator';
import { ReactQueryDevtoolsForDevAndTest } from './components/ReactQueryDevTools';
import entryLogger from './entryLogger';
import { navigatorCheckedIdAtom } from './layouts/Home/atoms';
import { miscStorage } from './localdb/miscStorage';
import { polyfillOffsetDate } from './polyfills/offset-date';
import '@/assets/styles/global.less';

const isDev = import.meta.env.DEV;

const getJotaiInitialValues = () => {
  let defaultNavigatorCheckedId = NavigatorItemId.Market;

  if (window.location.hash.includes(CommonRoute.HomeReceiptDealPanel)) {
    defaultNavigatorCheckedId = NavigatorItemId.ReceiptDeal;
  }

  return [[navigatorCheckedIdAtom, defaultNavigatorCheckedId]] as const;
};

async function render() {
  entryLogger.log('start');

  // 希望首个渲染进程做的事情
  async function initAppOnce() {
    try {
      entryLogger.log('init-isFirst');
      miscStorage.softLifecycleId = await window.Main.invoke(UtilEventEnum.GetSoftLifecycleId);
      miscStorage.deviceId = await window.Main.invoke(UtilEventEnum.GetDeviceId);
    } catch (e) {
      entryLogger.log('exception:init-isFirst', e);
    }
  }

  let searchParams: URLSearchParams;
  let isFirst: string | null;

  try {
    searchParams = new URLSearchParams(window.location.href.split('?')[1] ?? '');

    isFirst = searchParams.get('isFirst');
  } catch (e) {
    isFirst = null;
  }

  if (isFirst) {
    await initAppOnce();
  }

  if (miscStorage.offset) {
    /**  登录前不需要执行，登录后再执行 */
    polyfillOffsetDate(isServerTimestamp() ? miscStorage.offset : 0);
  }

  const container = document.getElementById('root');

  if (container) {
    initRequest(request);

    const root = createRoot(container);
    const jotaiInitialValues = getJotaiInitialValues();

    root.render(
      <QueryClientProvider client={queryClient}>
        <ConfigProvider
          locale={zhCN}
          autoInsertSpaceInButton={false}
        >
          <JotaiProvider
            initialValues={jotaiInitialValues}
            scope={GLOBAL_SCOPE}
          >
            <LoggerProvider>
              <AccessProvider>
                <WatermarkProvider value={{ content: miscStorage?.userInfo?.name_cn }}>
                  <CentrifugeProvider
                    initialState={{
                      env: miscStorage.apiEnv ?? '',
                      token: miscStorage.token ?? '',
                      websocket: WebSocket,
                      websocketHost: window.appConfig.websocketHost
                    }}
                  >
                    <FuzzySearchProvider value={{ fuzzySearchHook: useFuzzySearchQuery }}>
                      <RouterProvider router={router} />
                      <ReactQueryDevtoolsForDevAndTest />
                      <MemoryInfoView />
                    </FuzzySearchProvider>
                  </CentrifugeProvider>
                </WatermarkProvider>
              </AccessProvider>
            </LoggerProvider>
          </JotaiProvider>
        </ConfigProvider>
      </QueryClientProvider>
    );
  }

  entryLogger.log('rendered');
  entryLogger.send();

  await initWebTracer();
}

async function startMockServer() {
  // make sure msw load first
  // const { worker } = await import('@fepkg/mock/browser');
  // await worker.start({ onUnhandledRequest: 'bypass' });
  render();
}

localforage.config({ name: 'shihe-OMS' });

if (isDev) {
  startMockServer();
} else {
  render();
}

export default null;
