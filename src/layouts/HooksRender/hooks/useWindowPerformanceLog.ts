import { useCallback, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { MetricsType } from '@fepkg/metrics';
import IPCEventEnum, { InitEventEnum } from 'app/types/IPCEvents';
import { CommonRoute, WindowName } from 'app/types/window-v2';
import { AppPerformanceModule } from 'app/windows/listeners/app-performance-listener';
import { useSetWindowName, useWindowName } from '@/common/atoms';
import { metrics } from '@/common/utils/metrics';

export const useWindowPerformanceLog = () => {
  const { invoke } = window.Main;
  const location = useLocation();

  /** --- 这一坨代码跟 win focus 有关 start */

  const windowName = useWindowName();
  const setWindowName = useSetWindowName();

  const updatePerformanceLog = useCallback(async (name: string) => {
    const module: AppPerformanceModule = await invoke(InitEventEnum.AppPerformance, []);

    if (name === WindowName.MainHome) {
      metrics.timer('app.createtime', Math.abs(module.appReadyTime - module.appStartTime), {
        windowName: name,
        type: MetricsType.appReadyTime,
        remark: 'app.createtime',
        time: Math.abs(module.appReadyTime - module.appStartTime)
      });
    }
    metrics.timer('window.createtime', Math.abs(module.createWindowReadyTime - module.createWindowStartTime), {
      windowName: name,
      type: MetricsType.WindowReadyTime,
      remark: 'window.createtime',
      time: Math.abs(module.createWindowReadyTime - module.createWindowStartTime)
    });
  }, []);

  const handleUpdateLog = useCallback(async () => {
    if (!windowName) {
      const winName: string = await invoke(IPCEventEnum.GetWindowName, []);
      setWindowName(winName);
      return;
    }

    if (windowName && location.pathname && location.pathname !== CommonRoute.PreparedWindow) {
      updatePerformanceLog(windowName);
    }
  }, [location.pathname, windowName, setWindowName, updatePerformanceLog]);

  useEffect(() => {
    handleUpdateLog();
  }, [handleUpdateLog]);

  /** --- 这一坨代码跟 win focus 有关 end */
};
