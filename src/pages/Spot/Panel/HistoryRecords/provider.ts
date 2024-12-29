import { useState } from 'react';
import moment from 'moment';
import { createContainer } from 'unstated-next';
import { useImmer } from 'use-immer';
import { TypeSearchFilter } from './types';
import { PAGE_SIZE } from './utils';

const todayStartTimeStr = String(moment().startOf('days').valueOf());
const todayEndTimeStr = String(moment().endOf('days').valueOf());

export const HistoryRecordsContainer = createContainer(() => {
  const [filterData, updateFilterData] = useImmer<TypeSearchFilter>({
    create_start_time: String(todayStartTimeStr),
    create_end_time: String(todayEndTimeStr)
  });
  const [page, setPage] = useState(1);
  const onFilterChange = (v: TypeSearchFilter) => {
    setPage(1);
    updateFilterData(v);
  };

  return {
    filterData,
    updateFilterData,
    page,
    setPage,
    size: PAGE_SIZE,
    onFilterChange,
    initStartStr: todayStartTimeStr,
    initEndStr: todayEndTimeStr
  };
});

/** 明细面板的一些全局状态 */
export const HistoryRecordsProvider = HistoryRecordsContainer.Provider;
export const useHistoryRecords = HistoryRecordsContainer.useContainer;
