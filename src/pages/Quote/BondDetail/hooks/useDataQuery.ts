/**
 * 封装除了几个表格数据外的其他区域的请求
 */
import { APIs } from '@fepkg/services/apis';
import type { BaseDataBondFilter } from '@fepkg/services/types/base-data/bond-filter';
import type { BaseDataBondGetByKeyMarket } from '@fepkg/services/types/base-data/bond-get-by-key-market';
import type { BaseDataBondMget } from '@fepkg/services/types/base-data/bond-mget';
import type { BaseDataBondRatingGet } from '@fepkg/services/types/base-data/bond-rating-get';
import { BondRating, FiccBondBasic, FiccBondDetail } from '@fepkg/services/types/common';
import { FiccBondInfoLevelV2 } from '@fepkg/services/types/enum';
import { QueryFunction, useQuery } from '@tanstack/react-query';
import { cloneDeep } from 'lodash-es';
import { fetchBondKey } from '@/common/services/api/base-data/bond-key-get';
import { fetchBondRating } from '@/common/services/api/base-data/bond-rating-get';
import { fetchBondByIssuerCode } from '@/common/services/api/base-data/issuer-code-get';
import { fetchBondByIssuerInst } from '@/common/services/api/base-data/issuer-inst-mul-get';
import { fetchBondByKeyMarket } from '@/common/services/api/base-data/key-market-get';
import { LatestBondInfo, TypePublisher } from '../type';
import { PAGE_SIZE } from '../utils';

/**
 *
 * 这块要求按照描述值的首字母排序，map中的数据是已经排好序的，为了获取有序的数据，每次都必须要遍历一次map
 *
 */
const fromListToStr = (list: string[], map: Map<string, string>) => {
  const arr: string[] = [];
  for (const [k, v] of map) {
    if (list.includes(k)) {
      arr.push(v);
    }
  }
  const distArr = [...new Set(arr)];
  return distArr.length > 0 ? distArr.join(' ') : '--';
};

/**
 * 流通市场信息表格数据排序
 * 备注：1.现有数据顺序随机，不符合测试要求，测试要求从上到下是 银行间债券市场->上海证券交易所->深圳证券交易所
 *  2.和后端协商增加排序，后端说如果需要增加排序，需要他们组内讨论，通过之后排期解决,太麻烦了
 *  3.这块数据量最多只有3条，前端可以解决，并且更便捷
 */
const circulationMarketSort = (bondList?: FiccBondBasic[]) => {
  const sortedBondList: FiccBondBasic[] = [];
  if (bondList === undefined) {
    return sortedBondList;
  }
  const sortedFields = ['CIB', 'SSE', 'SZE'];
  for (const field of sortedFields) {
    const bond = bondList.find(b => b.listed_market === field);
    if (bond) {
      sortedBondList.push(bond);
    }
  }
  return sortedBondList;
};

/**
 * 基于获取最新债券信息接口生成最新的债券信息
 */
export const latestBondInfoConvert = (obj: BaseDataBondGetByKeyMarket.Response): LatestBondInfo | undefined => {
  const data = cloneDeep(obj);
  const { bond_basic_list, bond_detail_list, inst_info_list, related_info_list } = data;
  const bondBasicInfo = bond_basic_list?.[0];
  const bondDetailInfo = bond_detail_list?.[0];
  if (!bondDetailInfo) {
    // if (!bondInfo || !bondAppendixInfo) {
    return undefined;
  }
  const issuer_rating_list = related_info_list?.[0]?.issuer_rating_list || [];
  // 枚举字段和描述生成map
  const map = new Map<string, string>();
  if (inst_info_list)
    for (const item of inst_info_list) {
      map.set(item.inst_code, item.full_name_zh);
    }
  // 债券评级机构取中文描述
  bondDetailInfo.rating_inst_code = bondDetailInfo?.rating_inst_code ? map.get(bondDetailInfo.rating_inst_code) : '--';
  // 担保人取中文描述
  bondDetailInfo.warranter = bondDetailInfo.warranter ? map.get(bondDetailInfo.warranter) : '--';
  // 主承销商取中文描述
  const underwriterCode = bondDetailInfo?.underwriter_code?.split('|') ?? [];
  bondDetailInfo.underwriter_code = fromListToStr(underwriterCode, map);
  //  承销团取中文描述
  const underwriterGroup = (
    bondDetailInfo?.underwriter_group === '' || bondDetailInfo?.underwriter_group === undefined
      ? []
      : (JSON.parse(bondDetailInfo.underwriter_group) as string[])
  ).filter(item => !underwriterCode.includes(item));
  bondDetailInfo.underwriter_group = fromListToStr(underwriterGroup, map);
  // 发行人取中文描述
  const publisher = [bondDetailInfo.issuer_code, map.get(bondDetailInfo.issuer_code) ?? '--'];
  return {
    bondBasicInfo,
    bondDetailInfo,
    issuer_rating: issuer_rating_list,
    benchmarkRate: related_info_list?.[0]?.benchmark_rate,
    publisher
  };
};

/** 相关展示数据的获取 */
export const useDisplayDataQuery = (params: Pick<BaseDataBondGetByKeyMarket.Request, 'key_market_list'>) => {
  const fetchDetailParams = { ...params, info_level: FiccBondInfoLevelV2.InfoLevelDetail, with_related_info: true };
  const fetchBasicParams = { ...params, info_level: FiccBondInfoLevelV2.InfoLevelBasic };
  const queryKey = [APIs.baseData.keyMarketGet, params];
  const queryFn: QueryFunction<LatestBondInfo | undefined> = async ({ signal }) => {
    const detailData = fetchBondByKeyMarket(fetchDetailParams, { signal });
    const basicData = fetchBondByKeyMarket(fetchBasicParams, { signal });
    const data = (await Promise.all([detailData, basicData])).reduce((prev, cur) => {
      const objKeys = Object.keys(cur);
      for (const val of objKeys) {
        if (cur[val].length) prev[val] = cur[val];
      }
      return { ...prev };
    });
    return latestBondInfoConvert(data);
  };
  return useQuery<LatestBondInfo | undefined, unknown>({
    queryKey,
    queryFn,
    enabled: params.key_market_list && params.key_market_list.length > 0,
    refetchOnWindowFocus: true
  });
};

/** 根据发行商代码查询发行人信息 */
export const usePublisherQuery = (issuer_code?: string) => {
  const params = {
    inst_code_list: issuer_code ? [issuer_code] : []
  };
  const queryKey = [APIs.baseData.issuerInstMulGet, params];
  const queryFn: QueryFunction<TypePublisher> = async ({ signal }) => {
    const { inst_info_list } = await fetchBondByIssuerInst(params, {
      signal
    });
    if (inst_info_list && inst_info_list.length > 0) {
      return {
        company: inst_info_list[0].full_name_zh,
        type: inst_info_list[0].inst_type
      };
    }
    return {};
  };
  return useQuery<TypePublisher, unknown>({
    queryKey,
    queryFn,
    enabled: params.inst_code_list.length > 0,
    refetchOnWindowFocus: true
  });
};

/**
 * 获取流通市场信息表格数据
 */
export const useCirculationMarketQuery = (bondInfo?: FiccBondDetail) => {
  const params: BaseDataBondMget.Request = {
    bond_key_list: [bondInfo?.bond_key].filter(Boolean),
    with_maturity: true
  };
  const queryKey = [APIs.baseData.bondMget, params];
  const queryFn: QueryFunction<FiccBondBasic[]> = async ({ signal }) => {
    const { bond_basic_list: circulationMarket } = await fetchBondKey(params, { signal });
    return circulationMarketSort(circulationMarket);
  };
  return useQuery<FiccBondBasic[], unknown>({
    queryKey,
    queryFn,
    enabled: bondInfo !== undefined,
    refetchOnWindowFocus: true
  });
};

/**
 * 获取债项历史评级表格数据
 */
export const useHistoryLevelQuery = (bondInfo?: FiccBondBasic | FiccBondDetail) => {
  const params: BaseDataBondRatingGet.Request = {
    bond_key: bondInfo?.bond_key ?? '',
    offset: 0,
    count: 50
  };
  const queryKey = [APIs.baseData.bondRatingGet, params];
  const queryFn: QueryFunction<BondRating[]> = async ({ signal }) => {
    const { bond_rating: bondHistoryLevel } = await fetchBondRating(params, {
      signal
    });
    return bondHistoryLevel ?? [];
  };
  return useQuery<BondRating[], unknown>({
    queryKey,
    queryFn,
    enabled: bondInfo !== undefined,
    refetchOnWindowFocus: true
  });
};

/**
 * 获取发行人所有债券表格数据
 */
export const usePublishAllBondQuery = (page: number, tab: string, issuer_code?: string) => {
  const params: BaseDataBondFilter.Request = {
    issuer_code_list: [issuer_code].filter(Boolean),
    offset: (page - 1) * PAGE_SIZE,
    count: PAGE_SIZE,
    listed_market: tab
  };
  const queryKey = [APIs.baseData.issuerCodeGet, params];
  return useQuery<BaseDataBondFilter.Response, unknown>({
    queryKey,
    queryFn: ({ signal }) => fetchBondByIssuerCode(params, { signal }),
    enabled: issuer_code !== undefined,
    refetchOnWindowFocus: true,
    refetchOnReconnect: 'always',
    keepPreviousData: true,
    notifyOnChangeProps: ['data']
  });
};
