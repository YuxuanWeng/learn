import { useEffect, useRef } from 'react';
import { BroadcastChannelEnum } from 'app/types/broad-cast';
import { useDealRecord } from '@/pages/Spot/Panel/DealRecord/providers/DealRecordProvider';

// 用于内码定位，获取广播
export const usePositionCode = () => {
  const { data, searchCodeRef, setDealDate, handleFilterCode, searchValue, setSearchValue, dataRendering, isLoading } =
    useDealRecord();
  const isDataInitialized = useRef(false);

  useEffect(() => {
    const locationOff = window.Broadcast.on(
      BroadcastChannelEnum.BROADCAST_DEAL_DETAIL_LOCATION,
      async (internalCode?: string) => {
        setDealDate(null);
        isDataInitialized.current = false;
        setSearchValue(internalCode ?? '');
      }
    );

    return () => {
      locationOff();
    };
  }, [handleFilterCode, setDealDate, setSearchValue]);

  // 打开点价后，等待数据加载完成，再执行内码搜索
  useEffect(() => {
    if (searchValue && data?.length && !isLoading && !isDataInitialized.current && !dataRendering.current) {
      isDataInitialized.current = true;
      searchCodeRef.current?.focus();
      handleFilterCode(searchValue);
    }
  }, [data, dataRendering, handleFilterCode, isLoading, searchCodeRef, searchValue]);
};
