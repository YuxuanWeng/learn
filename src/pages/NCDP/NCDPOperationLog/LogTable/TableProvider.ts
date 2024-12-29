import { useState } from 'react';
import { useMemoizedFn } from 'ahooks';
import { createContainer } from 'unstated-next';
import { PAGE_SIZE } from '@/pages/Quote/QuoteLog/useOperationLogQuery';
import { useLogQuery } from './useData';

type InitialState = {
  /** 存单 Id */
  ncdpId: string;
  /** 页签是否是已删除 */
  referred: boolean;
};

/** @ts-ignore */
export const LogTableContainer = createContainer((initialState: InitialState) => {
  const { ncdpId, referred } = initialState;
  const [page, setPage] = useState(1);
  const { data, prefetch } = useLogQuery({ ncdpId, page, referred });

  const total = data?.total ?? 0;

  const onPrevPage = useMemoizedFn((scrollCallback: (isPageChange: boolean) => void) => {
    if (page === 1) {
      scrollCallback(false);
      return;
    }
    let prev = page - 1;
    if (prev < 1) prev = 1;
    setPage(prev);
    scrollCallback(true);
  });

  const onNextPage = useMemoizedFn((scrollCallback: (isPageChange: boolean) => void) => {
    if (page >= Math.ceil(total / PAGE_SIZE)) {
      scrollCallback(false);
      return;
    }
    let next = page + 1;
    const max = Math.ceil(total / PAGE_SIZE);
    if (next > max) next = max;
    if (next < 1) next = 1;
    setPage(next);
    scrollCallback(true);
  });

  const onPrevPagePrefetch = useMemoizedFn(() => {
    const prev = page - 1;
    if (prev < 1) {
      return;
    }
    prefetch(prev);
  });

  const onNextPagePrefetch = useMemoizedFn(() => {
    const max = Math.ceil(total / PAGE_SIZE);
    if (max <= 1) {
      return;
    }
    let next = page + 1;
    if (next > max) next = max;
    if (next === page) {
      return;
    }
    prefetch(next);
  });
  return {
    list: data?.list ?? [],
    total,
    page,
    setPage,
    prefetch,
    onPrevPage,
    onNextPage,
    onPrevPagePrefetch,
    onNextPagePrefetch
  };
});

export const LogTableProvider = LogTableContainer.Provider;
export const useLogTable = LogTableContainer.useContainer;
