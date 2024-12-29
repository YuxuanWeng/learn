import { useEffect, useState } from 'react';
import { useMemoizedFn } from 'ahooks';
import { BroadcastChannelEnum } from 'app/types/broad-cast';
import localforage from 'localforage';
import { UNDO } from '../utils/undo';

type SetForage<T> = (value: T, key?: string, callback?: () => void) => Promise<T>;
type GetForage<T> = (defaultValue?: T, callback?: () => void) => Promise<T>;
type DeleteForage = (key?: string, callback?: () => void) => Promise<void>;

export type LocalforageCache<T> = {
  /** 过期时间 */
  expires: number;
  /** 存储数据 */
  data: T;
};

export const useLocalforage = <T>(key: string, init?: T) => {
  const [forageData, setForageData] = useState<T | undefined>(init);
  const [initialized, setInitialized] = useState(false);

  const setter: SetForage<T> = useMemoizedFn(async (value, _key, callback?) => {
    setForageData(value);
    const response = await localforage.setItem(_key ?? key, value, callback);
    return response;
  });

  const getter: GetForage<T> = useMemoizedFn(async (defaultData?: T, callback?) => {
    const response = await localforage.getItem(key || UNDO, callback);
    if (response == null) return (defaultData || response) as T;
    return response as T;
  });

  const remove: DeleteForage = useMemoizedFn(async (removeKey?: string, callback?) => {
    await localforage.removeItem(removeKey || key, callback);
    if (removeKey === key || !removeKey) setForageData(undefined);
  });

  const update = useMemoizedFn(async (data: T, _key: string) => {
    if (_key !== key) return;
    await setter(data);
  });

  useEffect(() => {
    const { on } = window.Broadcast;
    const off = on(BroadcastChannelEnum.LOCAL_FORGE_UPDATE, update);
    return () => {
      off();
    };
  }, [update]);

  useEffect(() => {
    getter(init).then(res => {
      setForageData(res);
      setInitialized(true);
    });
  }, [getter, init]);

  return [forageData, getter, setter, remove, initialized] as const;
};
