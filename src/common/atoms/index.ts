import { useMemo } from 'react';
import { useMemoizedFn } from 'ahooks';
import { DialogChannelData } from 'app/types/dialog-v2';
import { WindowName } from 'app/types/window-v2';
import { atom, useAtom, useAtomValue, useSetAtom } from 'jotai';
import type { MessagePortCache } from '@/types/global';

export const GLOBAL_SCOPE = Symbol('global-score');

/** 当前网络是否在线 */
export const isOnlineAtom = atom(true);
export const useIsOnline = () => useAtomValue(isOnlineAtom, GLOBAL_SCOPE);
export const useSetIsOnline = () => useSetAtom(isOnlineAtom, GLOBAL_SCOPE);

/** 当前数据同步是否异常 */
export const isSyncErrorAtom = atom(false);
export const useIsSyncError = () => useAtomValue(isSyncErrorAtom, GLOBAL_SCOPE);
export const isConnectionLossAtom = atom(false);
export const useIsConnectionLoss = () => useAtomValue(isConnectionLossAtom, GLOBAL_SCOPE);

/** 暂无网络提示显示状态 */
export const offlineTipVisibleAtom = atom(false);
export const useOfflineTipVisible = () => useAtomValue(offlineTipVisibleAtom, GLOBAL_SCOPE);
export const useSetOfflineTipVisible = () => useSetAtom(offlineTipVisibleAtom, GLOBAL_SCOPE);

export const windowNameAtom = atom('');
export const useWindowName = () => useAtomValue(windowNameAtom, GLOBAL_SCOPE);
export const useSetWindowName = () => useSetAtom(windowNameAtom, GLOBAL_SCOPE);

export const isMaximizeAtom = atom(false);
export const useIsMaximize = () => useAtom(isMaximizeAtom, GLOBAL_SCOPE);

export const parentPortAtom = atom<MessagePort | null>(null);
export const useSetParentPort = () => useSetAtom(parentPortAtom, GLOBAL_SCOPE);
export const useParentPort = () => {
  const port = useAtomValue(parentPortAtom, GLOBAL_SCOPE);
  const post = useMemoizedFn((data: DialogChannelData) => {
    port?.postMessage(data);
  });

  return { port, post };
};

export const childPortCacheAtom = atom<MessagePortCache>({});
export const useChildPortCache = () => useAtomValue(childPortCacheAtom, GLOBAL_SCOPE);
export const useSetChildPortCache = () => useSetAtom(childPortCacheAtom, GLOBAL_SCOPE);

export const useChildPort = (names: WindowName) => {
  const cache = useChildPortCache();
  const port = cache[names];
  return { port };
};
export const useChildPorts = (names: Set<WindowName>) => {
  const cache = useChildPortCache();
  const ports = useMemo(() => {
    const res: MessagePort[] = [];

    for (const key in cache) {
      if (Object.hasOwn(cache, key)) {
        if (names.has(key as WindowName)) {
          res.push(cache[key]);
        }
      }
    }

    return res;
  }, [cache, names]);

  return { ports };
};

export const windowLaunchNumberAtom = atom(1);
export const useWindowLaunchNumber = () => useAtomValue(windowLaunchNumberAtom, GLOBAL_SCOPE);
export const useSetWindowLaunchNumber = () => useSetAtom(windowLaunchNumberAtom, GLOBAL_SCOPE);
export const useAddWindowLaunchNumber = () => {
  const setWindowLaunchNumber = useSetWindowLaunchNumber();
  return () => setWindowLaunchNumber(Date.now());
};

/** window是否禁用 */
export const windowDisabledAtom = atom(false);
export const useWindowDisabledState = () => useAtom(windowDisabledAtom, GLOBAL_SCOPE);

/** UserQuery是否出现错误 */
export const isUserQueryError = atom(false);
