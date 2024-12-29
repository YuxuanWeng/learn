import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { DataLocalizationEvent } from 'app/types/DataLocalization';
import { CommonRoute } from 'app/types/window-v2';

/**
 * 初始化UtilityProcess，要在useUtilityProcessPort生命周期前调用
 */
export const initUtilityProcess = () => {
  // 向主进程发起建立流程
  window.Main?.invoke(DataLocalizationEvent.Start);
};
/**
 * 结束UtilityProcess进程
 */
export const endUtilityProcess = () => {
  window.Main?.invoke(DataLocalizationEvent.End);
};

/**
 * 获取UtilityProcessPort
 * 主进程开启utilityProcess后可使用该hook新建一对ports与UtilityProcess通信
 * 使用前需要确认渲染进程是否在routeList中
 */
export const useDataLocalizationPort = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    if (pathname !== CommonRoute.PreparedWindow) window.UtilityProcess?.newPort?.();

    return () => {
      if (pathname !== CommonRoute.PreparedWindow) window.UtilityProcess?.closePort?.();
    };
  }, [pathname]);

  return null;
};
