import { useRef } from 'react';
import useResizeObserver from '@react-hook/resize-observer';
import { useMemoizedFn } from 'ahooks';
import { atom, useAtomValue, useSetAtom } from 'jotai';
import { debounce } from 'lodash-es';
import { S_TABLE_ATOM_SCOPE } from '../constants';

const tableContainerRectAtom = atom<ResizeObserverEntry['contentRect'] | undefined>(undefined);
export const useTableContainerRect = () => useAtomValue(tableContainerRectAtom, S_TABLE_ATOM_SCOPE);

export const useTableResizeObserver = () => {
  const ref = useRef<HTMLDivElement>(null);
  const setTableContainerRect = useSetAtom(tableContainerRectAtom, S_TABLE_ATOM_SCOPE);

  const handleResizeCallback = useMemoizedFn(
    debounce((evt: ResizeObserverEntry) => {
      queueMicrotask(() => {
        setTableContainerRect(evt.contentRect);
      });
    }, 100)
  );

  useResizeObserver(ref, handleResizeCallback);

  return [ref] as const;
};
