import { ReactNode } from 'react';
import { useOmsBusinessBroadcast } from '@fepkg/business/hooks/useOmsBusinessBroadcast';
import { useReloadWebPage } from '@fepkg/common/hooks';
import { Logo } from '@fepkg/components/Logo';
import { useToken } from '@/hooks/useToken';
import { HomeLayoutProvider, useHomeLayout } from '@/providers/LayoutProvider';
import { OutBoundConfigProvider } from '@/providers/OutBoundConfigProvider';
import { toastLogout } from '@/common/request/logout';
import { AsideBar } from './AsideBar';
import { UserInfo } from './UserInfo';
import { ASIDE_BAR_WIDTH, OutBoundMap } from './constant';

const notProdEnvs = new Set(['development', 'dev', 'test']);
const isProd = !notProdEnvs.has(import.meta.env.MODE);

type LayoutProps = { children?: ReactNode };

const Inner = ({ children }: LayoutProps) => {
  const { current } = useHomeLayout();
  useReloadWebPage();
  const { token } = useToken();
  useOmsBusinessBroadcast({ initToken: token, onLogout: () => toastLogout(void 0, false) });
  const currentAcceptor = OutBoundMap[current];

  return (
    <div className="layout-page">
      <header className="layout-header">
        <div
          className="flex items-end gap-2 h-7 pl-4"
          style={{ width: ASIDE_BAR_WIDTH }}
        >
          <Logo
            system="odm"
            uat={__API_ENV__ === 'xintang-uat'}
            version={isProd ? __APP_VERSION__ : __APP_SHORT_HASH__}
          />
        </div>

        <div className="w-[136px]">
          <UserInfo />
        </div>
      </header>

      <main className="layout-main">
        <AsideBar />

        <div className="flex flex-col flex-1 h-full pb-4 pr-4">
          <div className="h-14 flex items-center gap-3 py-3 text-xl font-medium text-gray-000">
            <img
              className="h-6 w-6 rounded"
              src={currentAcceptor.imgSrc}
              alt={currentAcceptor.imgAlt}
            />
            {currentAcceptor.name}
          </div>
          {children}
        </div>
      </main>
    </div>
  );
};

export const Layout = (props: LayoutProps) => {
  return (
    <HomeLayoutProvider>
      <OutBoundConfigProvider>
        <Inner {...props} />
      </OutBoundConfigProvider>
    </HomeLayoutProvider>
  );
};
