import { useEffect } from 'react';
import { useMemoizedFn } from 'ahooks';
import IPCEventEnum from 'app/types/IPCEvents';
import { useIsMaximize } from '@/common/atoms';

export function useMaximize() {
  const [isMaximize, setIsMaximize] = useIsMaximize();

  const toggleMaximize = useMemoizedFn(() => {
    const { invoke } = window.Main;
    invoke(IPCEventEnum.ToggleMaximize, ['ping']).then(setIsMaximize);
  });

  useEffect(() => {
    const { on, invoke, remove } = window.Main;

    invoke(IPCEventEnum.GetIsMaximized).then(setIsMaximize);
    on(IPCEventEnum.ResetWindowIsMaximized, val => setIsMaximize(val as boolean));

    return () => {
      remove(IPCEventEnum.GetIsMaximized);
      remove(IPCEventEnum.ResetWindowIsMaximized);
    };
  }, []);

  return { isMaximize, toggleMaximize };
}
