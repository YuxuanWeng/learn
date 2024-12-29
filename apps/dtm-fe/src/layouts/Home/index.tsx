import { Suspense } from 'react';
import { Outlet } from 'react-router-dom';
import { MessageCenter } from '@fepkg/business/components/MessageCenter';
import { useOmsBusinessBroadcast } from '@fepkg/business/hooks/useOmsBusinessBroadcast';
import { useReloadWebPage } from '@fepkg/common/hooks';
import { Button } from '@fepkg/components/Button';
import { Logo } from '@fepkg/components/Logo';
import { IconDtm, IconMenuFold, IconMenuUnfold } from '@fepkg/icon-park-react';
import { AccessCode } from '@fepkg/services/access-code';
import { useToken } from '@/hooks/useToken';
import { useAuth } from '@/providers/AuthProvider';
import { toastLogout } from '@/common/request/logout';
import { Export } from '@/components/Export';
import { Loading } from '@/components/Loading';
import { SwitchViewButton } from '@/layouts/Home/SwitchViewButton';
import { NAVIGATOR_WIDTH, Navigator, NavigatorBreadcrumb } from './Navigator';
import { UserInfo } from './UserInfo';
import { HomeLayoutProvider, useHomeLayout } from './useHomeLayout';

const notProdEnvs = new Set(['development', 'dev', 'test']);
const isProd = !notProdEnvs.has(import.meta.env.MODE);

const HooksRender = () => {
  useReloadWebPage();

  return null;
};

const Inner = () => {
  const { access, user } = useAuth();
  const { navigatorOpen, toggleNavigatorOpen } = useHomeLayout();
  const { token } = useToken();
  useOmsBusinessBroadcast({ initToken: token, onLogout: () => toastLogout(void 0, false) });

  return (
    <div className="layout-page">
      <header className="layout-header">
        {navigatorOpen ? (
          <div
            className="flex items-end gap-2 h-7 pl-4"
            style={{ width: NAVIGATOR_WIDTH }}
          >
            <Logo
              system="dtm"
              uat={__API_ENV__ === 'xintang-uat'}
              version={isProd ? __APP_VERSION__ : __APP_SHORT_HASH__}
            />
          </div>
        ) : (
          <IconDtm
            theme="two-tone"
            className="mx-4"
            size={24}
          />
        )}

        <div className="flex-1 flex items-center">
          <Button.Icon
            text
            icon={navigatorOpen ? <IconMenuFold /> : <IconMenuUnfold />}
            onClick={toggleNavigatorOpen}
          />
          {!navigatorOpen ? <NavigatorBreadcrumb /> : null}
        </div>

        {access?.has(AccessCode.CodeDTMHistoryExport) && <Export.TemplateSelect />}

        <SwitchViewButton />

        <MessageCenter
          userId={user?.user_id}
          btnClassName="rounded-lg !h-8 !w-8"
        />

        <div className="w-[136px] ml-4">
          <UserInfo />
        </div>
      </header>

      <main className="layout-main">
        <Navigator />

        <div className="flex flex-col flex-1 w-0">
          <Suspense fallback={<Loading />}>
            <Outlet />
          </Suspense>
        </div>
      </main>
    </div>
  );
};

export const HomeLayout = () => {
  return (
    <HomeLayoutProvider>
      <Inner />
      <HooksRender />
    </HomeLayoutProvider>
  );
};
