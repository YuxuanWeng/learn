import cx from 'classnames';
import { FRTypeShortMap, OptionTypeStringMap } from '@fepkg/business/constants/map';
import { hasOption } from '@fepkg/business/utils/bond';
import { transform2DealTime } from '@fepkg/business/utils/deal';
import { transform2DateContent } from '@fepkg/common/utils/date';
import { RequestConfig } from '@fepkg/request/types';
import { APIs } from '@fepkg/services/apis';
import { MarketDeal } from '@fepkg/services/types/common';
import { Side } from '@fepkg/services/types/enum';
import type { MarketDealSearch } from '@fepkg/services/types/market-deal/search';
import axios from 'axios';
import { uniqBy } from 'lodash-es';
import request from '@/common/request';
import { getRestDayNum } from '@/common/utils/bond';
import { logDataError } from '@/common/utils/logger/data';
import { isNotIntentional } from '@/common/utils/quote-price';
import { Exercise, Maturity } from '@/components/Quote/types';
import { DealTableColumn } from '@/pages/ProductPanel/components/DealTable/types';
import {
  getLiqSpeedStrForDealTable,
  transform2PVBP,
  transform2PriceContent,
  transform2RepaymentMethod,
  transform2ValModifiedDuration,
  transform2WeekendDay
} from '@/pages/ProductPanel/utils';

export const getSideInfo = (side: Side, original: MarketDeal) => {
  const { bid_institution_name, bid_trader_name, bid_trader_is_vip } = original;
  const { ofr_institution_name, ofr_trader_name, ofr_trader_is_vip } = original;

  let instName = '';
  let traderName = '';
  let isHighlight = false;

  if (side === Side.SideBid) {
    instName = bid_institution_name ?? '';
    traderName = bid_trader_name ?? '';
    isHighlight = !!bid_trader_is_vip;
  } else if (side === Side.SideOfr) {
    instName = ofr_institution_name ?? '';
    traderName = ofr_trader_name ?? '';
    isHighlight = !!ofr_trader_is_vip;
  }

  let cp = '';
  cp = instName;

  if (traderName) cp += `(${traderName})`;

  return { cp, cpHighlightCls: cx(isHighlight && 'text-yellow-100') };
};

export const getComment = (original: MarketDeal) => {
  const { comment, comment_flag_bridge, comment_flag_pay_for, exercise_manual, is_exercise, bond_basic_info } =
    original;
  const originalComment = comment.trim();
  let res = '';
  const isHasOption = hasOption(bond_basic_info);
  if (exercise_manual && isHasOption) {
    if (is_exercise) res = Exercise.label;
    else res = Maturity.label;
  }
  if (comment_flag_bridge) res += ' 过桥';
  if (comment_flag_pay_for) res += ' 代付';

  if (res) {
    return res.concat(' ', originalComment);
  }
  return originalComment;
};

export const transform2DealTableColumn = (original: MarketDeal): DealTableColumn => {
  const {
    bond_basic_info,
    volume,
    traded_date,
    delivery_date,
    deal_time,
    operator_name,
    operator_id,
    liquidation_speed_list
  } = original;
  const {
    rest_day_to_workday,
    mkt_type,
    maturity_date,
    fr_type,
    option_type,
    listed_date,
    repayment_method,
    val_modified_duration,
    val_basis_point_value
  } = bond_basic_info;

  const restDayNum = getRestDayNum(rest_day_to_workday);
  const listed = isNotIntentional(mkt_type);
  const weekendDay = transform2WeekendDay(maturity_date);
  const frType = fr_type != undefined ? FRTypeShortMap[fr_type] : '';
  const bondCode = bond_basic_info.display_code;
  const volumeContent = transform2PriceContent(volume);
  const bidInfo = getSideInfo(Side.SideBid, original);
  const ofrInfo = getSideInfo(Side.SideOfr, original);
  const tradedDate = transform2DateContent(traded_date);
  const deliveryDate = transform2DateContent(delivery_date);
  const dealTime = transform2DealTime(deal_time);
  const liquidationSpeedContent = getLiqSpeedStrForDealTable(liquidation_speed_list);
  const optionType = option_type != undefined ? OptionTypeStringMap[option_type] ?? '' : '';
  const listedDate = transform2DateContent(listed_date);
  const repaymentMethod = transform2RepaymentMethod(repayment_method);
  const valModifiedDuration = transform2ValModifiedDuration(val_modified_duration);
  const pvbp = transform2PVBP(val_basis_point_value);
  const operatorName = operator_name ?? operator_id ?? '';
  const comment = getComment(original);

  return {
    original,
    restDayNum,
    listed,
    weekendDay,
    frType,
    bondCode,
    volume: volumeContent,
    bidInfo,
    ofrInfo,
    tradedDate,
    deliveryDate,
    dealTime,
    liquidationSpeedContent,
    optionType,
    listedDate,
    repaymentMethod,
    valModifiedDuration,
    pvbp,
    operatorName,
    comment
  };
};

export type FetchMarketDealParams = {
  /** 筛选项 */
  params: MarketDealSearch.Request;
  /** 筛选项是否发生了变化 */
  paramsChanged?: boolean;
  /** requestConfig request 配置项 */
  requestConfig?: RequestConfig;
};

/**
 * @description 通过筛选条件获取市场成交
 * @url /api/v1/bdm/bds/bds_api/market_deal/search
 */
export const fetchMarketDeal = async ({ params, paramsChanged, requestConfig }: FetchMarketDealParams) => {
  const api = APIs.marketDeal.search;

  let traceId = '';
  try {
    const {
      deal_list = [],
      total,
      base_response
    } = await request.post<MarketDealSearch.Response>(api, params, requestConfig);
    traceId = base_response?.trace_id ?? '';

    const uniqDeals = uniqBy(deal_list, 'deal_id');
    // 如果有重复数据
    if (uniqDeals.length !== deal_list.length) {
      logDataError({ api, logName: 'data-duplication', traceId });
    }

    return { list: uniqDeals.map(transform2DealTableColumn), total };
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

    throw new Error('fetchMarketDeal has error but params not change.');
  }
};
