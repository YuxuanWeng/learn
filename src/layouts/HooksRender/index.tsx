import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useHasModalObserver } from '@fepkg/common/hooks';
import IPCEventEnum from 'app/types/IPCEvents';
import { CommonRoute } from 'app/types/window-v2';
import { useDataLocalizationPort } from '@/common/hooks/utility-process/useDataLocalizationPort';
import { useOriginalTextReadStatusCache as useCoQuoteOriginalTextReadStatusCache } from '@/pages/Quote/Collaborative/hooks/useOriginalTextReadStatusCache';
import SyncUserSettings from './components/SyncUserSettings';
import { WindowDisabledMask } from './components/WindowDisabledMask';
import { useHomeWindowLogoutListener } from './hooks/useHomeWindowLogoutListener';
import { useHotkeysInit } from './hooks/useHotkeysInit';
import { useMainGetLocalStorage } from './hooks/useMainGetLocalStorage';
import { useMainProcessError } from './hooks/useMainProcessError';
import { useMemoryMonitor } from './hooks/useMemoryMonitor';
import { useOnlineManager } from './hooks/useOnlineManager';
import { useRefreshVersionInfo } from './hooks/useRefreshVersionInfo';
import { useSentry } from './hooks/useSentry';
import { useUpdateUserInfoListener } from './hooks/useUpdateUserInfoListener';
import { useWindowBeActive } from './hooks/useWindowBeActive';
import { useWindowHotkeyRegistration } from './hooks/useWindowHotkeyRegistration';
import { useWindowMessageRegistration } from './hooks/useWindowMessageRegistration';
import { useWindowPerformanceLog } from './hooks/useWindowPerformanceLog';

export const HooksRender = () => {
  useSentry();
  useWindowPerformanceLog();
  useWindowHotkeyRegistration();
  useWindowMessageRegistration();
  useHasModalObserver();
  useMemoryMonitor();
  useOnlineManager();
  useHomeWindowLogoutListener();
  useRefreshVersionInfo();
  useMainGetLocalStorage();
  useMainProcessError();
  useDataLocalizationPort();
  useUpdateUserInfoListener();
  useWindowBeActive();
  useHotkeysInit();
  const { expires: readStatusCacheExpires, update: updateReadStatusCache } = useCoQuoteOriginalTextReadStatusCache();

  // 以下逻辑为少龙老师添加 --- start
  const { pathname } = useLocation();

  useEffect(() => {
    const { sendMessage } = window.Main;
    if (pathname !== '/normal' && ![CommonRoute.SingleQuote].includes(pathname)) {
      sendMessage(IPCEventEnum.DidNavigateInPage, pathname);
    }
  }, [pathname]);
  // 以上逻辑为少龙老师添加 --- end

  // 当协同报价查看原文已读状态缓存过期时，清空已有的全部缓存
  useEffect(() => {
    if (readStatusCacheExpires && readStatusCacheExpires < Date.now()) updateReadStatusCache(null);
  }, [readStatusCacheExpires, updateReadStatusCache]);

  return (
    <>
      <WindowDisabledMask />
      <SyncUserSettings />
    </>
  );
};
