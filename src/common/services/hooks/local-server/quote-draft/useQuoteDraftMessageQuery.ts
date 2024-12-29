import { useMemo, useRef } from 'react';
import { usePrevious } from '@fepkg/common/hooks';
import { UseDataQueryRequestConfig } from '@fepkg/request/types';
import { APIs } from '@fepkg/services/apis';
import { BondQuoteDraftSearch } from '@fepkg/services/types/bond-quote-draft/search';
import { FiccBondBasic, InstitutionTiny, Trader, TraderLite, User } from '@fepkg/services/types/common';
import { QueryFunction, useQuery } from '@tanstack/react-query';
import { isEqual } from 'lodash-es';
import { fetchBondQuoteDraft } from '@/common/services/api/bond-quote-draft/search';
import { fetchLocalServerMulGetById } from '@/common/services/api/local-server/base-data-mul-get-by-id';
import { QuoteDraftMessageListQueryData } from '@/common/services/hooks/local-server/quote-draft/types';
import {
  formatLocalQuoteDraftDetail,
  formatLocalQuoteDraftMessage,
  formatTrader2TraderLite,
  getBaseDataIdSet,
  getDiffIdList
} from './utils';

type useQuoteDraftMessageListQueryProps = {
  params: BondQuoteDraftSearch.Request;
  requestConfig?: UseDataQueryRequestConfig;
  /** 是否启用轮训 */
  enable: boolean;
  keepPreviousData?: boolean;
  onSuccess?: (data: QuoteDraftMessageListQueryData) => void;
};

const defaultConfig = { interval: 500 };

const BaseDataQueryRefetchInterval = 60 * 1000;

export const useQuoteDraftMessageQuery = ({
  params,
  requestConfig,
  enable,
  keepPreviousData,
  onSuccess
}: useQuoteDraftMessageListQueryProps) => {
  const config = { ...defaultConfig, ...requestConfig };
  const prevParams = usePrevious(params);
  const isParamsChanged = useMemo(() => !isEqual(params, prevParams), [params, prevParams]);

  const lastBaseDataRefreshTime = useRef(0);
  const bondCacheMap = useRef<Map<string, FiccBondBasic>>(new Map());
  const instCacheMap = useRef<Map<string, InstitutionTiny>>(new Map());
  const traderCacheMap = useRef<Map<string, TraderLite>>(new Map());
  const userCacheMap = useRef<Map<string, User>>(new Map());

  const queryKey = [APIs.bondQuoteDraft.search, params] as const;

  const queryFn: QueryFunction<QuoteDraftMessageListQueryData> = async () => {
    const result = await fetchBondQuoteDraft(params);
    const { bondKeyMarketSet, instIdSet, traderIdSet, userIdSet } = getBaseDataIdSet(result.list);
    // 更新基础数据cache(初始化/过期/入参改变)
    if (
      isParamsChanged ||
      !lastBaseDataRefreshTime.current ||
      lastBaseDataRefreshTime.current + BaseDataQueryRefetchInterval < Date.now()
    ) {
      let bondInfoList: FiccBondBasic[] | undefined;
      let instList: InstitutionTiny[] | undefined;
      let traderList: Trader[] | undefined;
      let userList: User[] | undefined;
      if (bondKeyMarketSet.size || instIdSet.size || traderIdSet.size || userIdSet.size) {
        const { bond_info_list, inst_list, trader_list, user_list } = await fetchLocalServerMulGetById({
          key_market_list: [...bondKeyMarketSet],
          inst_id_list: [...instIdSet],
          trader_id_list: [...traderIdSet],
          user_id_list: [...userIdSet]
        });
        bondInfoList = bond_info_list;
        instList = inst_list;
        traderList = trader_list;
        userList = user_list;
      }
      bondCacheMap.current = new Map(bondInfoList?.map(bond => [bond.key_market, bond]));
      instCacheMap.current = new Map(instList?.map(inst => [inst.inst_id, inst]));
      traderCacheMap.current = new Map(traderList?.map(trader => [trader.trader_id, formatTrader2TraderLite(trader)]));
      userCacheMap.current = new Map(userList?.map(user => [user.user_id, user]));
      lastBaseDataRefreshTime.current = Date.now();
    } else {
      // 更新基础数据cache(补差)
      const bondDiffIdList = getDiffIdList(bondCacheMap.current, bondKeyMarketSet);
      const instDiffIdList = getDiffIdList(instCacheMap.current, instIdSet);
      const traderDiffIdList = getDiffIdList(traderCacheMap.current, traderIdSet);
      const userDiffIdList = getDiffIdList(userCacheMap.current, userIdSet);
      // 存在差异则补差
      if (bondDiffIdList.length || instDiffIdList.length || traderDiffIdList.length || userDiffIdList.length) {
        const { bond_info_list, inst_list, trader_list, user_list } = await fetchLocalServerMulGetById({
          key_market_list: [...bondDiffIdList],
          inst_id_list: [...instDiffIdList],
          trader_id_list: [...traderDiffIdList],
          user_id_list: [...userDiffIdList]
        });
        if (bond_info_list)
          for (const bond of bond_info_list) {
            bondCacheMap.current.set(bond.key_market, bond);
          }
        if (inst_list)
          for (const inst of inst_list) {
            instCacheMap.current.set(inst.inst_id, inst);
          }
        if (trader_list)
          for (const trader of trader_list) {
            traderCacheMap.current.set(trader.trader_id, formatTrader2TraderLite(trader));
          }
        if (user_list)
          for (const user of user_list) {
            userCacheMap.current.set(user.user_id, user);
          }
        lastBaseDataRefreshTime.current = Date.now();
      }
    }

    return {
      list: result.list?.map(message =>
        formatLocalQuoteDraftMessage({
          message,
          inst_info: instCacheMap.current.get(message.inst_id ?? ''),
          trader_info: traderCacheMap.current.get(message.trader_id ?? ''),
          broker_info: userCacheMap.current.get(message.broker_id ?? ''),
          creator_info: userCacheMap.current.get(message.creator ?? ''),
          operator_info: userCacheMap.current.get(message.operator ?? ''),
          detail_list: message.detail_order_list
            ?.flatMap(o => o.detail_id_list ?? [])
            .map(detail_id => {
              const detail = message.detail_list?.find(d => d.detail_id === detail_id);
              if (detail)
                return formatLocalQuoteDraftDetail({
                  detail,
                  bond_info: bondCacheMap.current.get(detail.key_market ?? '')
                });
              return void 0;
            })
            .filter(Boolean)
        })
      ),
      total: result.total,
      last_create_time: result.last_create_time
    } as QuoteDraftMessageListQueryData;
  };

  const query = useQuery<QuoteDraftMessageListQueryData>({
    queryKey,
    queryFn,
    enabled: enable,
    refetchOnWindowFocus: false,
    refetchOnMount: 'always',
    refetchOnReconnect: 'always',
    staleTime: config?.interval,
    cacheTime: config?.interval,
    refetchInterval: config?.interval,
    notifyOnChangeProps: ['data'],
    keepPreviousData: keepPreviousData ?? true,
    onSuccess
  });

  return { queryKey, ...query };
};
