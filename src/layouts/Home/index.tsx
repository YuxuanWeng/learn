import { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { useMemoizedFn } from 'ahooks';
import { LayoutSettingsEnum } from 'app/types/layout-settings';
import localforage from 'localforage';
import { useBeforeWindowSafelyClosedEffect } from '@/common/hooks/useBeforeWindowSafelyClosedEffect';
import { UNDO } from '@/common/utils/undo';
import { AppBar } from '@/components/AppBar';
import { Navigator } from '@/components/Navigator';
import { SystemSetting } from '@/pages/Base/SystemSetting';
import { ActiveProductTypeProvider } from './hooks/useActiveProductType';

const HomeLayout = ({ home = true }) => {
  // -- 如果是看板页，给 #root 添加边框 start
  useEffect(() => {
    const root = document.getElementById('root');
    const prevBorder = root?.style.border;
    if (home && root) {
      root.style.border = '0 none';
    }
    return () => {
      if (!home && root) {
        root.style.border = prevBorder ?? '0 none';
      }
    };
  }, [home]);
  // -- 如果是看板页，给 #root 添加边框 end

  useEffect(() => {
    if (home) window.Main.invoke(LayoutSettingsEnum.LoadLayoutWindowV2);
  }, [home]);

  const beforeWinClose = useMemoizedFn(async () => {
    if (home) await localforage.removeItem(UNDO); // 清空UNDO列表
    // ..一些其他异步处理；
    return true;
  });

  useBeforeWindowSafelyClosedEffect(() => {
    // 一些清理工作
    if (home) localforage.removeItem(UNDO); // 清空UNDO列表
  });

  return (
    <main className={home ? 'home-main' : 'home-main-not-navigator'}>
      <AppBar
        isHome={home}
        beforeClose={beforeWinClose}
      />

      <ActiveProductTypeProvider>
        {home && <Navigator />}
        <Outlet />

        {home && <SystemSetting />}
      </ActiveProductTypeProvider>
    </main>
  );
};

export default HomeLayout;
