import { useLayoutEffect, useState } from 'react';
import { parseJSON } from '@fepkg/common/utils/utils';
import { useMemoizedFn } from 'ahooks';
import { isEqual, isFunction, isUndefined } from 'lodash-es';
import { useEventListener } from 'usehooks-ts';

type StoreValue<T> = Exclude<T, undefined>;

type SetStateAction<T> = StoreValue<T> | ((prevState: StoreValue<T>) => StoreValue<T>);

type SetValue<T> = (value: SetStateAction<T>, forceUpdate?: boolean) => void;

export interface Options<T> {
  serializer?: (value: T) => string;
  deserializer?: (value: string) => T;
  onError?: (error: unknown) => void;
}

export type returnType<T> = [T, SetValue<T>, (key?: string) => void];

/**
 * 自定义useLocalStorage。
 * @property string: key - ls指定key
 * @property T | (() => T): initialValue - 默认值
 * @property options: Options - 其他配置项
 * @returns array: [value, setValue]
 */
export function useLocalStorage<T>(key: string, initialValue: T | (() => T), options: Options<T> = {}): returnType<T> {
  const {
    onError = e => {
      console.error(e);
    }
  } = options;

  const serializer = (value: T) => {
    if (options.serializer) return options.serializer(value);
    return JSON.stringify(value);
  };

  const deserializer = (value: string): T => {
    if (options.deserializer) return options.deserializer(value);
    return parseJSON(value) as T;
  };

  const readValue = useMemoizedFn((): T => {
    const initValue = isFunction(initialValue) ? initialValue() : initialValue;

    // Prevent build error "window is undefined" but keeps working
    if (typeof window === 'undefined') return initValue;

    try {
      const storeValue = window.localStorage.getItem(key);

      return storeValue ? deserializer(storeValue) : initValue;
    } catch (error) {
      onError(`Error reading localStorage key “${key}”: ${error}`);
      return initValue;
    }
  });

  // State to store our value
  // Pass initial state function to useState so logic is only executed once
  const [storedValue, _setStoredValue] = useState<T>(readValue);

  const setStoredValue = useMemoizedFn((newState: T, forceUpdate = false) => {
    _setStoredValue(prev => {
      // force update
      if (forceUpdate) return newState;

      if (!isEqual(newState, prev)) return newState;

      return prev;
    });
  });

  // reInitializes state when key changes
  useLayoutEffect(() => {
    setStoredValue(readValue());
  }, [key, readValue, setStoredValue]);

  // Return a wrapped version of useState's setter function that ...
  // ... persists the new value to localStorage.
  const setValue: SetValue<T> = useMemoizedFn((value, forceUpdate) => {
    // Prevent build error "window is undefined" but keeps working
    if (typeof window === 'undefined') {
      onError(`Tried setting localStorage key “${key}” even though environment is not a client`);
    }

    try {
      // Allow value to be a function so we have the same API as useState
      const newValue = isFunction(value) ? value(storedValue as StoreValue<T>) : value;

      if (isUndefined(newValue)) throw new Error('Setting undefined is not allowed in localStorage');

      window.localStorage.setItem(key, serializer(newValue));

      // Save state
      setStoredValue(newValue, forceUpdate);

      // We dispatch a custom event so every useLocalStorage hook are notified
      window.dispatchEvent(new Event('local-storage'));
    } catch (error) {
      onError(`Error setting localStorage key “${key}”: ${error}`);
    }
  });

  const remove = useMemoizedFn((_key?: string) => {
    window.localStorage.removeItem(_key ?? key);
    if (_key === key) setStoredValue(readValue());
  });

  const handleStorageChange = useMemoizedFn((event: StorageEvent | CustomEvent) => {
    if ((event as StorageEvent)?.key && (event as StorageEvent).key !== key) {
      return;
    }

    setStoredValue(readValue());
  });

  // this only works for other documents, not the current one
  useEventListener('storage', handleStorageChange);

  // this is a custom event, triggered in writeValueToLocalStorage
  useEventListener('local-storage', handleStorageChange);

  return [storedValue, setValue, remove];
}
