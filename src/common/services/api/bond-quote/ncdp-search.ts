import { IssuerDateTypeMap, MaturityDateTypeMap, RatingMap } from '@fepkg/business/constants/map';
import { transform2DateContent } from '@fepkg/common/utils/date';
import { RequestConfig } from '@fepkg/request/types';
import { APIs } from '@fepkg/services/apis';
import { BondQuoteNcdpSearch } from '@fepkg/services/types/bond-quote/ncdp-search';
import { NCDPInfo } from '@fepkg/services/types/common';
import { IssuerDateType, ProductType } from '@fepkg/services/types/enum';
import axios from 'axios';
import { uniqBy } from 'lodash-es';
import moment from 'moment';
import request from '@/common/request';
import { logDataError } from '@/common/utils/logger/data';
import { NCDPTableColumn } from '@/pages/ProductPanel/components/NCDPTable/types';

export const transform2IssuerDateContent = (referred: boolean, issuerType?: IssuerDateType, issuerDate?: string) => {
  const content = transform2DateContent(issuerDate);
  if (referred) return content;

  const isToday = moment().isSame(content, 'day');
  const weekday = isToday ? '今日' : IssuerDateTypeMap[issuerType ?? 0];

  // 近期不需要括号内容
  if (issuerType === IssuerDateType.IssuerDateTypeRecent) return weekday;
  return `${weekday}(${content})`;
};

export const transform2NCDPTableColumn = (referred: boolean, original: NCDPInfo): NCDPTableColumn => {
  const { issuer_rating_current, issuer_type, issuer_date, maturity_date, update_time } = original;

  const rating = RatingMap[issuer_rating_current];
  const issuerDate = transform2IssuerDateContent(referred, issuer_type, issuer_date);
  const maturityDate = MaturityDateTypeMap[maturity_date];
  const updateTime = transform2DateContent(update_time, referred ? 'YYYY-MM-DD HH:mm:ss' : 'HH:mm:ss');

  return { original, rating, issuerDate, maturityDate, updateTime };
};

export type FetchNCDPInfoParams = {
  /** 筛选项 */
  params: BondQuoteNcdpSearch.Request;
  /** 筛选项是否发生了变化 */
  paramsChanged?: boolean;
  /** requestConfig request 配置项 */
  requestConfig?: RequestConfig;
};

/**
 * @description 通过筛选条件获取ncd一级
 * @url /api/v1/bdm/bds/bds_api/bond_quote/ncdp/search
 */
export const fetchNCDPInfo = async ({ params, paramsChanged = true, requestConfig }: FetchNCDPInfoParams) => {
  const api = APIs.bondQuote.ncdp.search;

  let traceId = '';
  try {
    const {
      ncdp_list = [],
      total,
      base_response
    } = await request.post<BondQuoteNcdpSearch.Response>(api, params, {
      fromProductType: ProductType.NCDP,
      ...requestConfig
    });
    traceId = base_response?.trace_id ?? '';

    const uniqNCDPs = uniqBy(ncdp_list, 'ncdp_id');
    // // 如果有重复数据
    if (uniqNCDPs.length !== ncdp_list.length) {
      logDataError({ api, logName: 'data-duplication', traceId });
    }

    return { list: ncdp_list.map(item => transform2NCDPTableColumn(params.is_deleted, item)), total };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      logDataError({ api, logName: 'request-fail', traceId, error });
    } else {
      logDataError({ api, logName: 'transform-fail', traceId, error });
    }

    // 如果筛选项发生了变化，无论发生什么错误，清空 UI 列表
    if (paramsChanged) {
      return { list: [], total: 0 };
    }

    // 反之，无论发生什么错误，不清空 UI 列表
    throw new Error('fetchNCDPInfo has error but params not changed.');
  }
};
