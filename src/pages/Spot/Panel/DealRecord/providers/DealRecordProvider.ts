import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useVirtual } from 'react-virtual';
import { formatDate } from '@fepkg/common/utils/index';
import { APIs } from '@fepkg/services/apis';
import { DealRecord } from '@fepkg/services/types/bds-common';
import { BondDealStatus, UserAccessGrantType } from '@fepkg/services/types/bds-enum';
import type { DealRecordGetByFilter } from '@fepkg/services/types/deal/record-get-by-filter';
import { useQuery } from '@tanstack/react-query';
import { useMemoizedFn } from 'ahooks';
import moment from 'moment';
import { createContainer } from 'unstated-next';
import { isUseLocalServer } from '@/common/ab-rules';
import { getReceiptDealConfirmData } from '@/common/services/api/receipt-deal/get-confirm-data';
import { useDealRecordListQuery } from '@/common/services/hooks/local-server/deal/useDealRecordListQuery';
import { useDealRecordLiveQuery } from '@/common/services/hooks/useLiveQuery/DealInfo';
import { matchInternalCode } from '@/common/utils/internal-code';
import { useProductParams } from '@/layouts/Home/hooks';
import { useAccessGrant } from '@/pages/Base/SystemSetting/components/TradeSettings/useAccessGrant';
import { TypeDealRecord } from '@/pages/Spot/Panel/DealRecord/types';
import { useSpotPanelLoader } from '@/pages/Spot/Panel/Providers/preload';
import { confirmedStatus, getDealRecordList } from '../utils';

export type DealRecordSpotStatus = {
  spotPricingRecordId: string;
  spotVolume: number;
  confirmVolume: number;
  pendingVolume: number;
  rejectVolume: number;
  hideVolume: boolean;
};

export const DealRecordContainer = createContainer(() => {
  const { productType } = useProductParams();
  const { internalCode: initInternalCode } = useSpotPanelLoader();
  // 成交记录日期筛选条件
  const [dealDate, setDealDate] = useState<moment.Moment | null>(null);
  // 当前高亮的成交记录
  const [activeKey, setActiveKey] = useState<string>();

  const [currentTime, setCurrentTime] = useState(Date.now());

  const [searchValue, setSearchValue] = useState(initInternalCode ?? '');

  const searchCodeRef = useRef<HTMLInputElement>(null);
  const timerRef = useRef<NodeJS.Timeout>();
  const dataRendering = useRef(false);

  useEffect(() => {
    timerRef.current = setInterval(() => {
      setCurrentTime(Date.now());
    }, 10000);

    return () => {
      if (timerRef.current != null) {
        clearInterval(timerRef.current);
      }

      timerRef.current = undefined;
    };
  }, []);

  const containerRef = useRef<HTMLUListElement>(null);
  const dealTime = formatDate(dealDate);

  const reqParams: DealRecordGetByFilter.Request = { deal_time: dealTime };
  const queryKey = [APIs.deal.recordGetByFilter, reqParams];

  // /** 我和我的指定人的id集合 */
  const { grantUserIdList: ourSideIds } = useAccessGrant(UserAccessGrantType.UserAccessGrantTypeDealInfo);

  const isLocalServer = isUseLocalServer();
  const {
    data: localizationData,
    refetch: localizationRefetch,
    isLoading: isLocalizationLoading
  } = useDealRecordLiveQuery({
    params: { product_type: productType, broker_list: ourSideIds ?? [], deal_time: dealTime },
    enabled: !isLocalServer,
    onSuccess: () => {
      dataRendering.current = true;
    }
  });
  const {
    data: localServerData,
    refetch: localServerRefetch,
    isLoading: isLocalServerLoading
  } = useDealRecordListQuery({
    params: {
      product_type: productType,
      broker_id_list: ourSideIds,
      deal_time: dealDate ? dealDate.valueOf().toString() : void 0
    },
    enabled: isLocalServer,
    onSuccess: () => {
      dataRendering.current = true;
    }
  });

  const isLoading = isLocalServer ? isLocalServerLoading : isLocalizationLoading;

  const rawList = isLocalServer ? localServerData?.deal_record_list : localizationData?.deal_info_list;

  const [dealList, setDealList] = useState<DealRecord[] | undefined>();

  const idsNeedConfirmStatus = (dealList ?? [])
    .filter(i => Date.now() - Number(i.create_time) > 5 * 60 * 1000)
    .map(i => i.deal_id);

  const { data: confirmStatusData, refetch: refetchConfirmStatus } = useQuery({
    queryKey: [APIs.receiptDeal.getReceiptDealConfirmData, idsNeedConfirmStatus],
    queryFn: async () => {
      return idsNeedConfirmStatus.length
        ? (await getReceiptDealConfirmData({ receipt_deal_id_list: idsNeedConfirmStatus })).deal_confirm_snapshot_list
        : [];
    },
    enabled: idsNeedConfirmStatus.length > 0,
    refetchInterval: 5000,
    staleTime: 5000
  });

  useEffect(() => {
    refetchConfirmStatus().then(() => {
      setDealList(getDealRecordList(rawList, currentTime));
    });
  }, [rawList]);

  const refetch = isLocalServer ? localServerRefetch : localizationRefetch;

  const sortedList = useMemo(() => {
    const dealRecordList = getDealRecordList(dealList, currentTime);
    const sortResult =
      dealRecordList == null
        ? dealRecordList
        : [...dealRecordList].sort((a, b) => {
            if (a.create_time !== b.create_time) {
              return Number(b.create_time) - Number(a.create_time);
            }

            return Number(b.internal_code) - Number(a.internal_code);
          });
    dataRendering.current = false;
    return sortResult;
  }, [currentTime, dealList]);

  const rowVirtualizer = useVirtual({
    size: sortedList?.length ?? 0,
    parentRef: containerRef,
    estimateSize: useCallback(
      (index: number) => {
        const spot = sortedList?.[index];
        const prev = sortedList?.[index - 1];
        const isBlockStart = spot?.isDark !== prev?.isDark && !spot?.isHistory;

        return (
          (spot?.deal_status && confirmedStatus.includes(spot?.deal_status) ? 116 : 88) +
          (isBlockStart && spot?.canShowSum ? 32 : 0)
        );
      },
      [sortedList]
    ),
    overscan: 20
  });

  /** 定位内码 或 dealId 对应的成交记录 */
  const handleFilterCode = useMemoizedFn((val: string, isDealIdLocation?: boolean) => {
    const allData = sortedList ?? [];
    // 能够切换高亮的集合
    let searchedList: TypeDealRecord[] = [];
    if (isDealIdLocation) {
      const searchedItem = allData.find(
        i => i.deal_status && confirmedStatus.includes(i.deal_status) && i.deal_id === val
      );
      // 从明细跳转过来时需要用deal_id去做精确定位，同时要把内码展示在筛选框中
      setSearchValue(searchedItem?.internal_code || '');
      if (searchedItem) {
        searchedList = [searchedItem];
      }
    } else {
      // 只有确认状态才有内码，此处做一个兜底，避免搜到其他状态的内码
      searchedList = allData.filter(
        i => i.deal_status && confirmedStatus.includes(i.deal_status) && matchInternalCode(i.internal_code, val)
      );
    }

    const hightListLength = searchedList.length ?? 0;
    // 当前高亮的位置
    const highlightIdx = searchedList.findIndex(i => i.deal_id === activeKey);
    const nextIdx = highlightIdx + 1 > hightListLength - 1 ? 0 : highlightIdx + 1;
    // 下一个切换高亮的key
    const nextHighlight = searchedList[nextIdx]?.deal_id;
    const nextIndex = allData.findIndex(i => i.deal_id === nextHighlight);
    setActiveKey(nextHighlight);
    rowVirtualizer.scrollToIndex(nextIndex, { align: 'start' });
  });

  const data = ourSideIds == null ? [] : sortedList ?? [];

  const spotInfos = useMemo(() => {
    const result: Record<string, DealRecordSpotStatus> = {};

    for (const i of data) {
      if (i.spot_pricing_record_id == null) continue;
      if (result[i.spot_pricing_record_id] == null) {
        result[i.spot_pricing_record_id] = {
          spotPricingRecordId: i.spot_pricing_record_id,
          confirmVolume: 0,
          spotVolume: 0,
          pendingVolume: 0,
          rejectVolume: 0,
          hideVolume: false
        };
      }

      const target = result[i.spot_pricing_record_id];

      target.spotVolume += i.spot_pricing_volume ?? 0;

      if (i.deal_status === BondDealStatus.DealConfirmed || i.deal_status === BondDealStatus.DealPartConfirmed) {
        target.confirmVolume += i.confirm_volume ?? 0;
      } else if (i.deal_status !== BondDealStatus.DealRefuse && i.deal_status !== BondDealStatus.DealDelete) {
        target.pendingVolume += i.confirm_volume ?? 0;
      }
      target.rejectVolume = target.spotVolume - target.confirmVolume - target.pendingVolume;
    }
    return result;
  }, [data]);

  return {
    data,
    productType,
    queryKey,
    ourSideIds,
    rowVirtualizer,
    containerRef,
    searchCodeRef,
    activeKey,
    dealDate,
    setDealDate,
    handleFilterCode,
    spotInfos,
    searchValue,
    setSearchValue,
    refetch,
    refetchConfirmStatus,
    confirmStatusData,
    isLoading,
    dataRendering
  };
});

export const DealRecordProvider = DealRecordContainer.Provider;
export const useDealRecord = DealRecordContainer.useContainer;
