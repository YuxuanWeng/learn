import { useState } from 'react';
import { parseJSON } from '@fepkg/common/utils';
import { useMemoizedFn } from 'ahooks';
import { isEqual } from 'lodash-es';
import { useEventListener } from 'usehooks-ts';

const getValue = <T extends Record<string, unknown>>(initialObject: T, storage: Storage, key: keyof T): T[keyof T] => {
  const item = storage.getItem(String(key));
  return item ? ((parseJSON(item) ?? item) as T[keyof T]) : initialObject[key];
};

export class MultiStorageEvent extends Event {
  public key: string | number | symbol;

  constructor(type: string, key: string | number | symbol, eventInitDict?: EventInit) {
    super(type, eventInitDict);
    this.key = key;
  }
}

function useMultiLocalStorage<T extends Record<string, unknown>>(
  initialObject: T,
  storage: Storage = window.localStorage
) {
  const [loading, setLoading] = useState(true);

  const readValue = useMemoizedFn((key: keyof T): T[keyof T] | null => {
    if (typeof window === 'undefined') {
      return null;
    }

    setLoading(true);
    try {
      return getValue(initialObject, storage, key);
    } catch (error) {
      // console.warn(`Error reading localStorage key “${String(key)}”:`, error);
      return null;
    } finally {
      setLoading(false);
    }
  });

  const readValues = useMemoizedFn((): T => {
    if (typeof window === 'undefined') {
      return initialObject;
    }

    setLoading(true);
    try {
      const result = {} as T;
      Object.keys(initialObject).forEach((key: keyof T) => {
        result[key] = getValue(initialObject, storage, key);
      });
      return result;
    } catch (error) {
      // console.warn(`Error reading localStorages”:`, error);
      return initialObject;
    } finally {
      setLoading(false);
    }
  });

  const [storedValues, setStoredValues] = useState<T>(readValues);

  const setValue = useMemoizedFn(
    (key: keyof T, value: T[keyof T] | ((key: keyof T, value: T[keyof T]) => T[keyof T])) => {
      if (typeof window === 'undefined') {
        // console.warn(`Tried setting localStorage key “${String(key)}” even though environment is not a client`);
        return;
      }

      setLoading(true);
      try {
        const newValue = value instanceof Function ? value(key, storedValues[key]) : value;

        storage.setItem(String(key), JSON.stringify(newValue));

        setStoredValues({
          ...storedValues,
          [key]: newValue
        });

        // 需要 dispatchEvent 一个自定义事件以便本页面内容会 change
        window.dispatchEvent(new MultiStorageEvent('local-storage', key));
      } catch (error) {
        // console.warn(`Error setting localStorage key “${String(key)}”:`, error);
      } finally {
        setLoading(false);
      }
    }
  );

  // 需要处理initialValue key的变化
  // const setValues = useMemoizedFn(value => {
  //   if (typeof window === 'undefined') {
  //     console.warn(`Tried setting localStorages even though environment is not a client`);
  //   }

  //   try {
  //     const newValue = value instanceof Function ? value(storedValues) : value;

  //     Object.keys(initialObject).forEach((key: keyof T) => {
  //       storage.setItem(String(key), JSON.stringify(newValue[key]));
  //     });

  //     setStoredValues(newValue);

  //     window.dispatchEvent(new Event('local-storage'));
  //   } catch (error) {
  //     console.warn(`Error setting localStorages”:`, error);
  //   }
  // });

  // useLocalStorage源码里的，但好像没用，setStoredValues初始化的时候已经执行过了
  // useEffect(() => {
  //   setStoredValues(readValues());
  // }, [readValues]);

  const handleStorageChange = useMemoizedFn((event: StorageEvent | MultiStorageEvent | CustomEvent) => {
    const keys = new Set<string | number | symbol>(Object.keys(storedValues));
    const updateKey = (event as StorageEvent | MultiStorageEvent)?.key;

    if (updateKey != void 0 && !keys.has(updateKey)) {
      return;
    }

    setStoredValues(prev => {
      const next = readValues();
      if (isEqual(prev, next)) return prev;
      return next;
    });
  });

  useEventListener('storage', handleStorageChange);
  useEventListener('local-storage', handleStorageChange);

  return {
    loading,
    readValue,
    readValues,
    setValue,
    storedValues
  };
}

export { useMultiLocalStorage };
