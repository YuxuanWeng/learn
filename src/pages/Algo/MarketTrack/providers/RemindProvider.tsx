import { useEffect, useMemo, useRef, useState } from 'react';
import { useBondSearch } from '@fepkg/business/components/Search/BondSearch';
import { useTraderSearch } from '@fepkg/business/components/Search/TraderSearch';
import { useLocalStorage } from '@fepkg/business/hooks/useLocalStorage';
import { FiccBondBasic, OppositePriceNotification, UserSetting } from '@fepkg/services/types/common';
import { UserSettingFunction } from '@fepkg/services/types/enum';
import { useMemoizedFn } from 'ahooks';
import { isNil } from 'lodash-es';
import { createContainer } from 'unstated-next';
import { LSKeys, getLSKey } from '@/common/constants/ls-keys';
import { mulUpsertUserSetting } from '@/common/services/api/user/setting-mul-upsert';
import { useProductParams } from '@/layouts/Home/hooks';
import { useMarketTrackMessageFeedLiveQuery } from '../PriceRemind/hooks/useMarketTrackMessageFeedLiveQuery';
import { useRemindData } from '../PriceRemind/hooks/useRemindData';
import { useQuerySetting } from '../ReminderConfig/hooks/useQuerySetting';
import { SortEnum } from '../type';
import { fetchBondListFromLocalDB, getRemindKey, getTimeToMaturityNum } from '../util';

/** 对价提醒支持滚动分页，每页30条记录 */
export const PAGESIZE = 30;

const RemindContextContainer = createContainer(() => {
  /** 筛选条件 */
  const [intelligenceSort, setIntelligenceSort] = useState(SortEnum.Time);
  const { productType } = useProductParams();

  const { bondSearchState } = useBondSearch();
  const keyMarket = bondSearchState.selected?.original?.key_market;

  const { traderSearchState } = useTraderSearch();
  const traderId = traderSearchState.selected?.original.trader_id;

  /** 勾选的债券id */
  const [checkedKeyMarketList, setCheckedKeyMarketList] = useState<string[]>([]);

  /** 显示隐藏项 */
  const [showRemindInfo, setShowRemindInfo] = useLocalStorage(
    getLSKey(LSKeys.MarketTrackSpreadStatus, productType),
    false
  );
  // 对价提醒相关的数据
  const { notificationList, setNotificationList } = useMarketTrackMessageFeedLiveQuery({
    productType
  });
  // 分页相关的数据
  const [page, setPage] = useState(1);

  const [bondLiteList, setBondLiteList] = useState<FiccBondBasic[]>([]);

  const bondMapRef = useRef<Map<string, FiccBondBasic>>(new Map());

  const loadingRef = useRef(true);

  const [sendErrorMap, setSendErrorMap] = useState<Map<string, string>>();

  const onChangeShowRemindInfo = useMemoizedFn((btnStatus: boolean) => {
    setShowRemindInfo(btnStatus);
    const params: UserSetting[] = [
      {
        function: UserSettingFunction.UserSettingOppositePriceNotificationWindow,
        value: String(btnStatus)
      }
    ];
    mulUpsertUserSetting({ setting_list: params });
  });

  const updateBondLiteList = useMemoizedFn(async (list: string[]) => {
    const res = await fetchBondListFromLocalDB(list);
    const newBondLiteList = res.bondBasicList;
    if (newBondLiteList.length) {
      setBondLiteList([...bondLiteList, ...newBondLiteList]);
      for (const item of newBondLiteList) {
        const map = bondMapRef.current ?? new Map<string, FiccBondBasic>();
        map.set(item.key_market, item);
      }
    }
  });

  // 债券 交易员搜索逻辑
  const validNotificationList = useMemo(() => {
    if (isNil(keyMarket) && isNil(traderId)) {
      return notificationList;
    }
    const list = notificationList.filter(
      item =>
        (isNil(traderId) || item.trader_id === traderId) && (isNil(keyMarket) || item.bond_key_market === keyMarket)
    );
    if (list.length > 0) {
      setPage(1);
    }
    return list;
  }, [notificationList, keyMarket, traderId]);

  // 所有的keyMarket数据
  const keyMarketListOrigin = useMemo(
    () => [...new Set(validNotificationList.map(item => item.bond_key_market))],
    [validNotificationList]
  );

  // 监听key_market，如果有新的则请求本地数据库获取最新的债券,同时添加到bondMap中
  useEffect(() => {
    const existedKeyMarketList = new Set(bondLiteList.map(item => item.key_market));
    const newKeyMarketList: string[] = [];
    for (const item of keyMarketListOrigin) {
      if (!existedKeyMarketList.has(item)) {
        newKeyMarketList.push(item);
      }
    }
    if (newKeyMarketList.length) {
      updateBondLiteList(newKeyMarketList);
    }
  }, [bondLiteList, keyMarketListOrigin, updateBondLiteList]);

  // 所有交易员id 用来限制搜索项目的交易员范围
  const traderIdList = useMemo(
    () => [...new Set(validNotificationList.map(item => item.trader_id))],
    [validNotificationList]
  );

  const validBondLiteList = useMemo(() => {
    return bondLiteList.filter(bondLite => keyMarketListOrigin.includes(bondLite.key_market));
  }, [bondLiteList, keyMarketListOrigin]);

  // 智能排序的逻辑
  const localPageKeyMarketList = useMemo(() => {
    let keyMarketList: string[] = [];
    if (intelligenceSort === SortEnum.Time) {
      keyMarketList = keyMarketListOrigin;
    } else if (intelligenceSort === SortEnum.KeyMarket) {
      keyMarketList = validBondLiteList
        .sort((a, b) => a.display_code.localeCompare(b.display_code))
        .map(bond => bond.key_market);
    } else if (intelligenceSort === SortEnum.DeadLine) {
      keyMarketList = validBondLiteList
        .sort((a, b) => getTimeToMaturityNum(b.time_to_maturity) - getTimeToMaturityNum(a.time_to_maturity))
        .map(bond => bond.key_market);
    }

    return keyMarketList.slice((page - 1) * PAGESIZE, page * PAGESIZE);
  }, [validBondLiteList, intelligenceSort, keyMarketListOrigin, page]);

  /** 对价提醒数据 不包括债券信息和市场成交等信息 */
  const notificationMap = useMemo(() => {
    const map = new Map<string, OppositePriceNotification[]>();
    // 债券 机构 交易员 方向 是区分要素   以这个要素为准过滤出最新的提醒
    const existedNotificationKeyList: string[] = [];
    for (const item of validNotificationList) {
      const key = getRemindKey(item);
      if (!existedNotificationKeyList.includes(key)) {
        existedNotificationKeyList.push(key);
        const v = map.get(item.bond_key_market) ?? [];
        v.push(item);
        map.set(item.bond_key_market, v);
      }
    }
    return map;
  }, [validNotificationList]);

  /** map k 是key_market v  是对价提醒id   删除会用到 */
  const notificationIdMap = useMemo(() => {
    const map = new Map<string, string[]>();
    for (const item of notificationList) {
      const k = item.bond_key_market;
      const v = map.get(k) ?? [];
      v.push(item.opposite_price_notification_id);
      map.set(k, v);
    }
    return map;
  }, [notificationList]);

  const { data, prefetch } = useRemindData({
    keyMarketList: localPageKeyMarketList,
    notificationMap
  });

  if ((loadingRef.current && data?.length) || notificationList.length === 0) {
    loadingRef.current = false;
  }

  const onPrevPagePrefetch = useMemoizedFn(() => {
    const prev = page - 1;
    if (prev < 1) {
      return;
    }
    prefetch(keyMarketListOrigin.slice((page - 1) * PAGESIZE, page * PAGESIZE));
  });

  const onNextPagePrefetch = useMemoizedFn(() => {
    const max = Math.ceil(keyMarketListOrigin.length / PAGESIZE);
    if (max <= 1) {
      return;
    }
    let next = page + 1;
    if (next > max) next = max;
    if (next === page) {
      return;
    }
    prefetch(keyMarketListOrigin.slice((page - 1) * PAGESIZE, page * PAGESIZE));
  });

  const maxPage = Math.ceil(keyMarketListOrigin.length / PAGESIZE);

  const { data: settings } = useQuerySetting();

  useEffect(() => {
    if (localPageKeyMarketList.length === 0) {
      setPage(draft => (draft > 1 ? draft - 1 : 1));
    }
  }, [localPageKeyMarketList]);

  return {
    remindList: data ?? [],
    keyMarketList: localPageKeyMarketList,
    setIntelligenceSort,
    intelligenceSort,
    checkedKeyMarketList,
    setCheckedKeyMarketList,
    showRemindInfo,
    onChangeShowRemindInfo,
    traderIdList,
    page,
    setPage,
    pageSize: PAGESIZE,
    total: keyMarketListOrigin.length,
    notificationList,
    setNotificationList,
    onPrevPagePrefetch,
    onNextPagePrefetch,
    maxPage,
    notificationIdMap,
    sendErrorMap,
    setSendErrorMap,
    keyMarketListOrigin,
    notificationMap,
    bondMap: bondMapRef.current,
    settings,
    logicList: settings?.notify_logic ?? [],
    loading: loadingRef.current
  };
});

export const RemindProvider = RemindContextContainer.Provider;
export const useRemind = RemindContextContainer.useContainer;
