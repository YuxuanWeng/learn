import { useEffect } from 'react';
import { useMemoizedFn } from 'ahooks';
import { BroadcastChannelEnum } from 'app/types/broad-cast';

export const useAccessChange = (onChange?: (access: Set<number>) => void) => {
  const handleAccessChange = useMemoizedFn((access: Set<number>) => {
    onChange?.(access);
  });

  useEffect(() => {
    const off = window.Broadcast.on(BroadcastChannelEnum.BROADCAST_ACCESS_CHANGE, handleAccessChange);

    return () => {
      off();
    };
  }, [handleAccessChange]);
};
