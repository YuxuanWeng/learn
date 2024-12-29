import { useState } from 'react';
import { createContainer } from 'unstated-next';
import { TypeSearchFilter } from '@/pages/Home/type';
import { useHomeLayout } from './LayoutProvider';

export const NotifyContainer = createContainer(() => {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(50);

  const { params, setParams } = useHomeLayout();
  const onFilterChange = (v: TypeSearchFilter) => {
    setPage(1);
    setParams(draft => {
      for (const key in v) {
        if (Object.hasOwn(v, key)) {
          draft[key] = v[key];
        }
      }
    });
  };

  const resetParams = () => {
    setParams({});
  };
  return {
    page,
    setPage,
    params,
    onFilterChange,
    pageSize,
    setPageSize,
    resetParams
  };
});

export const NotifyProvider = NotifyContainer.Provider;
export const useNotify = NotifyContainer.useContainer;
