import { useEffect, useMemo, useState } from 'react';
import { APIs } from '@fepkg/services/apis';
import { ProductType } from '@fepkg/services/types/bdm-enum';
import { InstWithTradersFuzzySearch } from '@fepkg/services/types/inst/with-traders-fuzzy-search';
import { TraderSearch } from '@fepkg/services/types/trader/search';
import { useMemoizedFn } from 'ahooks';
import { cloneDeep, uniqBy } from 'lodash-es';
import { createContainer } from 'unstated-next';
import { useImmer } from 'use-immer';
import { v4 as uuidv4 } from 'uuid';
import { fuzzySearchInstWithTraders } from '@/common/services/api/inst/inst-with-traders';
import { useFuzzySearchQuery } from '@/common/services/hooks/useFuzzySearchQuery';
import { InstTraderMap, TraderTinyWithInst } from './types';
import { useScrollPage } from './useScrollEvent';
import { intersectionInstTrader, transformInstTraderData, transformInstWithTraderData } from './util';

export type InitialState = {
  /** 产品类型 */
  productType: ProductType;
  /** 是否禁用 */
  disabled?: boolean;
  /** 搜索前的回调 */
  onBeforeSearch?: () => void;
  /** 搜索接口入参 */
  searchParams?: Omit<TraderSearch.Request, 'keyword' | 'searchEnabled'>;
  /** 默认选中的交易员 */
  defaultTraders?: TraderTinyWithInst[];
};

const PAGE_COUNT = 20;

const SearchInstTraderContainer = createContainer((initialState?: InitialState) => {
  const productType = initialState?.productType ?? ProductType.BNC;
  const disabled = initialState?.disabled ?? false;
  const searchParams = initialState?.searchParams;
  const defaultTraders = initialState?.defaultTraders;
  const onBeforeSearch = initialState?.onBeforeSearch;

  const [instKeyword, setInstKeyword] = useState<string>('');
  const [traderKeyword, setTraderKeyword] = useState<string>('');

  const [total, setTotal] = useState(0);

  /** 搜索到的机构数据 */
  const [searchInstData, setSearchInstData] = useImmer<InstTraderMap>({});

  /** 搜索到的交易员数据 */
  const [searchTraderData, setSearchTraderData] = useImmer<InstTraderMap>({});

  /** 当前已经选中的交易员 */
  const [selectedTraders, setSelectedTraders] = useState<TraderTinyWithInst[]>(defaultTraders ?? []);

  /** 求完交集的数据 */
  const intersectionData = useMemo(() => {
    if (traderKeyword && !instKeyword) {
      return intersectionInstTrader({}, searchTraderData);
    }

    if (!traderKeyword && !instKeyword) {
      return intersectionInstTrader(searchInstData, {});
    }

    return intersectionInstTrader(searchInstData, searchTraderData);
  }, [instKeyword, searchInstData, searchTraderData, traderKeyword]);

  const [selectInstId, setSelectInstId] = useState<string>();

  const [instChecked, setInstChecked] = useImmer<{ [instId: string]: boolean }>({}); // 每个机构是否全选

  const [page, setPage] = useState(0);

  /** 机构半选 */
  const instIndeterminate = useMemo(() => {
    const res: { [instId: string]: boolean } = {};
    const selectedTraderIds = new Set(selectedTraders.map(selectedTrader => selectedTrader.trader_id));
    for (const v of Object.values(intersectionData)) {
      if (!v.traders.length) {
        res[v.inst_id] = false;
      } else {
        const isIndeterminate =
          v.traders.some(trader => selectedTraderIds.has(trader.trader_id)) &&
          !v.traders.every(trader => selectedTraderIds.has(trader.trader_id));
        res[v.inst_id] = isIndeterminate;
      }
    }
    return res;
  }, [intersectionData, selectedTraders]);

  // 预加载
  const fetchData = useMemoizedFn(async (offset: number) => {
    const response = await fuzzySearchInstWithTraders({
      keyword: instKeyword,
      product_type: productType,
      offset: offset * PAGE_COUNT,
      count: PAGE_COUNT
    });

    const formatData = transformInstWithTraderData(
      response.list?.map(v => ({ ...v, inst_id: uuidv4() })),
      defaultTraders
    );
    setSearchInstData({ ...searchInstData, ...formatData });
  });

  const { handleWrapperScroll } = useScrollPage({
    page,
    setPage,
    maxPage: Math.ceil(total / PAGE_COUNT),
    onNextPagePrefetch: fetchData
  });

  /** 搜索交易员 */
  useFuzzySearchQuery<TraderSearch.Response, TraderSearch.Request>({
    api: APIs.trader.search,
    queryWhenEmpty: true,
    keyword: traderKeyword.trim(),
    searchParams: { product_type: productType, count: 9999, ...searchParams },
    queryOptions: { enabled: !disabled, notifyOnChangeProps: ['data'] },
    onlyRemoteQuery: true,
    onQuery: onBeforeSearch,
    staleTime: 0,
    onSuccess: data => {
      setPage(0);
      const formatData = transformInstTraderData(data.list, defaultTraders, productType);
      if (traderKeyword.trim() === '') {
        setSearchTraderData({});
        return;
      }

      // 找到和机构求完交集的第一个机构
      const mergeData = intersectionInstTrader(searchInstData, formatData);
      const instIds = Object.keys(mergeData);

      if ((!selectInstId || !instIds.includes(selectInstId)) && instIds.length) setSelectInstId(instIds[0]);

      setSearchTraderData(formatData);
    }
  });

  /** 搜索机构 */
  useFuzzySearchQuery<InstWithTradersFuzzySearch.Response, InstWithTradersFuzzySearch.Request>({
    api: APIs.inst.fuzzySearchWithTraders,
    queryWhenEmpty: true,
    keyword: instKeyword,
    searchParams: { product_type: productType, offset: 0, count: traderKeyword ? 9999 : PAGE_COUNT },
    queryOptions: {
      enabled: !disabled,
      notifyOnChangeProps: ['data'],
      refetchOnWindowFocus: false
    },
    staleTime: 0,
    onSuccess: data => {
      setPage(0);
      const formatData = transformInstWithTraderData(data.list, defaultTraders);

      setTotal(data.total ?? 0);

      // 找到和交易员求完交集的第一个机构
      const mergeData = intersectionInstTrader(searchTraderData, formatData);
      const instIds = Object.keys(mergeData);

      if ((!selectInstId || !instIds.includes(selectInstId)) && instIds.length) setSelectInstId(instIds[0]);
      setSearchInstData(formatData);
    }
  });

  // 机构下交易员全部选中时，全选机构
  useEffect(() => {
    const searchDataList = Object.values(intersectionData);
    const selectedTraderIds = new Set(selectedTraders.map(selectedTrader => selectedTrader.trader_id));
    for (const v of searchDataList) {
      const isSelectedAll = !!(v.traders.length && v.traders.every(trader => selectedTraderIds.has(trader.trader_id)));
      const isSelectedEmpty = !!(
        v.traders.length && v.traders.every(trader => !selectedTraderIds.has(trader.trader_id))
      );
      if (isSelectedAll) {
        setInstChecked(draft => {
          draft[v.inst_id] = true;
        });
      }
      if (isSelectedEmpty) {
        setInstChecked(draft => {
          draft[v.inst_id] = false;
        });
      }
    }
  }, [intersectionData, selectedTraders, setInstChecked]);

  /** 选中某个机构 */
  const handleInstChecked = (instId: string, checked: boolean) => {
    const currentInst = searchInstData[instId];
    const tradersInSearchInst: TraderTinyWithInst[] =
      currentInst?.traders?.map(v => {
        let cp = currentInst.biz_short_name ?? currentInst.inst_name ?? '';
        if (v.name_zh) cp += `(${v.name_zh})`;
        const res: TraderTinyWithInst = {
          ...v,
          instId,
          cp
        };
        return res;
      }) ?? [];

    const traderIdsInSearchInst = new Set(tradersInSearchInst.map(v => v.trader_id));

    const tradersInSearchTraders: TraderTinyWithInst[] =
      searchTraderData[instId]?.traders?.map(v => {
        const res: TraderTinyWithInst = {
          ...v,
          instId,
          cp: searchTraderData[instId].cp
        };
        return res;
      }) ?? [];

    const traderIdsInSearchTrader = new Set(tradersInSearchInst.map(v => v.trader_id));

    if (checked) {
      // 选中机构下所有交易员
      const mergeSelectedTraders = uniqBy(
        [...selectedTraders, ...tradersInSearchInst, ...tradersInSearchTraders],
        'trader_id'
      );
      setSelectedTraders(mergeSelectedTraders);
    } else {
      const traderIds = new Set([...traderIdsInSearchInst, ...traderIdsInSearchTrader]);
      // 取消选中机构下所有交易员
      const updateSelectedTraders = selectedTraders.filter(v => !traderIds.has(v.trader_id));
      setSelectedTraders(updateSelectedTraders);
    }

    setInstChecked(draft => {
      draft[instId] = checked;
    });
  };

  /** 选中交易员 */
  const handleTradeChecked = (trader: TraderTinyWithInst, checked: boolean) => {
    if (!selectInstId || !searchInstData) return;
    const prevSelectedTraders = cloneDeep(selectedTraders);
    if (!checked) setSelectedTraders(prevSelectedTraders.filter(v => v.trader_id !== trader.trader_id));
    else setSelectedTraders([...prevSelectedTraders, trader]);
  };

  /** 删除某个交易员 */
  const handleDeleteTrader = (traderId: string) => {
    setSelectedTraders(selectedTraders.filter(v => v.trader_id !== traderId));
  };

  return {
    handleInstChecked,
    handleTradeChecked,
    handleDeleteTrader,

    instChecked,
    setInstChecked,
    instIndeterminate,

    instKeyword,
    setInstKeyword,

    traderKeyword,
    setTraderKeyword,

    selectedTraders,
    selectInstId,
    setSelectInstId,

    handleWrapperScroll,

    searchData: intersectionData
  };
});

export const SearchInstTraderProvider = SearchInstTraderContainer.Provider;
export const useSearchInstTrader = SearchInstTraderContainer.useContainer;
