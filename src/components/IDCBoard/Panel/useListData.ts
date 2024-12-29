import { useEffect, useMemo, useRef, useState } from 'react';
import { FiccBondBasic } from '@fepkg/services/types/common';
import { Side } from '@fepkg/services/types/enum';
import { isUseLocalServer } from '@/common/ab-rules';
import { useOptimalQuoteByKeyMarketQuery } from '@/common/services/hooks/local-server/quote/useOptimalQuoteByKeyMarketQuery';
import { SpotDateMapSettlementType } from '@/common/services/hooks/local-server/utils';
import { useBondOptimalQuoteLiveQuery } from '@/common/services/hooks/useLiveQuery/BondQuote';
import { SpotDate } from '../../IDCSpot/types';
import type { IGrid } from '../types';
import { filterGridsBySpotDate, isOptimalDataEmpty, quotes2GridData } from '../utils';

interface IProps {
  bond?: FiccBondBasic | null;
  showSubOptimal?: boolean;
  spotDate?: SpotDate;
  onListChange?: (list: IGrid[][]) => void;
  isSimplify?: boolean;
}

// SimplifyMode 有一个区别:不需要根据spotDate再做一次数据过滤了
export default function useListData({ bond, showSubOptimal, spotDate, onListChange, isSimplify }: IProps) {
  const emptyList = useMemo(
    () =>
      [
        showSubOptimal ? quotes2GridData([], Side.SideBid, false, bond) : void 0,
        quotes2GridData([], Side.SideBid, true, bond),
        quotes2GridData([], Side.SideOfr, true, bond),
        showSubOptimal ? quotes2GridData([], Side.SideOfr, false, bond) : void 0
      ].filter(Boolean),
    [bond, showSubOptimal]
  );
  const [dataList, setDataList] = useState<IGrid[][]>(emptyList);

  useEffect(() => onListChange?.(dataList), [dataList, onListChange]);

  const isPrevListEmpty = useRef(false);

  const isLocalServer = isUseLocalServer();
  const { data: localizationData } = useBondOptimalQuoteLiveQuery({
    params: {
      keyMarket: bond?.key_market,
      spotDate
    },
    enabled: !isLocalServer
  });

  const { data: localServerData } = useOptimalQuoteByKeyMarketQuery({
    params: {
      key_market: bond?.key_market ?? '',
      settlement_type_list: spotDate ? SpotDateMapSettlementType[spotDate] : [],
      simplified: isSimplify
    },
    enabled: isLocalServer
  });
  const data = isLocalServer ? localServerData : localizationData;

  useEffect(() => {
    if (!data || isOptimalDataEmpty(data)) {
      if (!isPrevListEmpty.current) isPrevListEmpty.current = true;
      // 新旧 emptyList 也可能不同，比如自定义列数导致的
      setDataList(emptyList);
      return;
    }
    const list = [
      showSubOptimal ? quotes2GridData(data.bidSubOptimalQuoteList, Side.SideBid, false, bond) : void 0,
      quotes2GridData(data.bidOptimalQuoteList, Side.SideBid, true, bond),
      quotes2GridData(data.ofrOptimalQuoteList, Side.SideOfr, true, bond),
      showSubOptimal ? quotes2GridData(data.ofrSubOptimalQuoteList, Side.SideOfr, false, bond) : void 0
    ]
      .filter(Boolean)
      .map((grids: IGrid[]) => filterGridsBySpotDate(grids, spotDate, isSimplify))
      .map((grids: IGrid[], idx) => (grids?.length ? grids : emptyList[idx]));
    setDataList(list);
    isPrevListEmpty.current = false;
  }, [data, bond, emptyList, showSubOptimal, isSimplify, spotDate]);

  return { data, dataList };
}
