import { FRTypeShortMap, OptionTypeStringMap } from '@fepkg/business/constants/map';
import { transform2DealTime } from '@fepkg/business/utils/deal';
import { getSettlement } from '@fepkg/business/utils/liq-speed';
import { transform2BrokerContent, transform2CPContent, uniqParentChildList } from '@fepkg/business/utils/receipt-deal';
import { normalizeTimestamp, transform2DateContent } from '@fepkg/common/utils';
import { RequestConfig } from '@fepkg/request/types';
import { APIs } from '@fepkg/services/apis';
import { ReceiptDeal } from '@fepkg/services/types/bds-common';
import { ReceiptDealStatus } from '@fepkg/services/types/bds-enum';
import { ReceiptDealSearchV2 } from '@fepkg/services/types/receipt-deal/search-v2';
import axios from 'axios';
import { omit } from 'lodash-es';
import moment from 'moment';
import request from '@/common/request';
import { getRestDayNum } from '@/common/utils/bond';
import { logDataError, logError } from '@/common/utils/logger/data';
import { isNotIntentional } from '@/common/utils/quote-price';
import { miscStorage } from '@/localdb/miscStorage';
import { checkCanEdit } from '@/pages/Deal/Receipt/ReceiptDealForm/utils';
import { ReceiptDealRowData } from '@/pages/Deal/Receipt/ReceiptDealPanel/components/ReceiptDealTable/types';
import {
  getLiqSpeedStrForDealTable,
  transform2PVBP,
  transform2PriceContent,
  transform2RepaymentMethod,
  transform2WeekendDay
} from '@/pages/ProductPanel/utils';

const api = APIs.receiptDeal.search_v2;

export const getReceiptDealDisabledStyleStatus = (receipt_deal_status: ReceiptDealStatus) => {
  return new Set([ReceiptDealStatus.ReceiptDealDeleted, ReceiptDealStatus.ReceiptDealDestroyed]).has(
    receipt_deal_status
  );
};

export const getSeqNum = (seq_number?: string, create_time?: string, showToday = true) => {
  if (seq_number && create_time) {
    const createTime = moment(normalizeTimestamp(create_time)).startOf('day');
    if (showToday || createTime.valueOf() !== moment().startOf('day').valueOf()) {
      return createTime.format('MMDD') + '0'.repeat(4 - seq_number.length) + seq_number;
    }
    return seq_number;
  }
  return '-';
};

export const isUserInReceiptDealBrokers = (userId: string, receiptDeal: ReceiptDeal) => {
  const brokerSet = new Set([
    receiptDeal.bid_trade_info.broker?.user_id,
    receiptDeal.bid_trade_info.broker_b?.user_id,
    receiptDeal.bid_trade_info.broker_c?.user_id,
    receiptDeal.bid_trade_info.broker_d?.user_id,
    receiptDeal.ofr_trade_info.broker?.user_id,
    receiptDeal.ofr_trade_info.broker_b?.user_id,
    receiptDeal.ofr_trade_info.broker_c?.user_id,
    receiptDeal.ofr_trade_info.broker_d?.user_id
  ]);
  return brokerSet.has(userId);
};

type TransformReceiptDealChildRowDataParams = {
  original: ReceiptDeal;
  grantUserIdList?: string[];
  isOnOrBeforeFirstWorkdayOfMonth: boolean;
};

const transform2ReceiptDealChildRowData = ({
  original,
  grantUserIdList,
  isOnOrBeforeFirstWorkdayOfMonth
}: TransformReceiptDealChildRowDataParams): ReceiptDealRowData => {
  const {
    receipt_deal_id,
    seq_number,
    bond_basic_info,
    volume,
    traded_date,
    delivery_date,
    deal_time,
    create_time,
    operator,
    update_time,
    bid_trade_info,
    ofr_trade_info,
    receipt_deal_status,
    liquidation_speed_list,
    flag_urge
  } = original;
  const {
    rest_day_to_workday,
    mkt_type,
    maturity_date,
    fr_type,
    option_type,
    listed_date,
    repayment_method,
    val_basis_point_value
  } = bond_basic_info ?? {};

  const seqNum = getSeqNum(seq_number, create_time, false);
  const restDayNum = getRestDayNum(rest_day_to_workday);
  const listed = isNotIntentional(mkt_type);
  const weekendDay = transform2WeekendDay(maturity_date);
  const frType = fr_type != undefined ? FRTypeShortMap[fr_type] : '';
  const volumeContent = transform2PriceContent(volume);
  const tradedDate = transform2DateContent(traded_date) || '-';
  const deliveryDate = transform2DateContent(delivery_date) || '-';
  const dealTime = deal_time ? transform2DealTime(deal_time) : '';
  const liquidationSpeedContent = getLiqSpeedStrForDealTable([
    liquidation_speed_list?.at(0) ?? getSettlement(traded_date, delivery_date)
  ]);
  const optionType = option_type != undefined ? OptionTypeStringMap[option_type] ?? '' : '';
  const listedDate = transform2DateContent(listed_date);
  const repaymentMethod = transform2RepaymentMethod(repayment_method);
  const pvbp = transform2PVBP(val_basis_point_value);
  const operatorName = operator?.name_cn ?? '';
  const updateTime = transform2DealTime(update_time);
  const [bidBrokerContent, isBidMine] = transform2BrokerContent(bid_trade_info, grantUserIdList);
  const [ofrBrokerContent, isOfrMine] = transform2BrokerContent(ofr_trade_info, grantUserIdList);
  const maturityDate = transform2DateContent(maturity_date);
  const cpBidContent = transform2CPContent(bid_trade_info, true);
  const cpOfrContent = transform2CPContent(ofr_trade_info, true);
  const disabledStyle = getReceiptDealDisabledStyleStatus(receipt_deal_status);
  const editable = checkCanEdit(original, isOnOrBeforeFirstWorkdayOfMonth);
  const isMyUrge = Boolean(flag_urge) && isUserInReceiptDealBrokers(miscStorage.userInfo?.user_id ?? '', original);

  return {
    id: receipt_deal_id,
    type: 'child',
    original,
    seqNum,
    restDayNum,
    listed,
    weekendDay,
    frType,
    volume: volumeContent,
    tradedDate,
    deliveryDate,
    dealTime,
    liquidationSpeedContent,
    optionType,
    listedDate,
    repaymentMethod,
    pvbp,
    operatorName,
    bidBrokerContent,
    isBidMine,
    ofrBrokerContent,
    isOfrMine,
    cpBidContent,
    cpOfrContent,
    maturityDate,
    updateTime,
    disabledStyle,
    editable,
    isMyUrge
  };
};

type TransformReceiptDealParentRowDataParams = {
  parent_child_deal_list: ReceiptDealSearchV2.ParentChildDeal;
  grantUserIdList?: string[];
  isOnOrBeforeFirstWorkdayOfMonth: boolean;
};

const transform2ReceiptDealParentRowData = ({
  parent_child_deal_list,
  grantUserIdList,
  isOnOrBeforeFirstWorkdayOfMonth
}: TransformReceiptDealParentRowDataParams): ReceiptDealRowData => {
  const { parent_deal_id, bridge_code, receipt_deal_info_list } = parent_child_deal_list;
  const siblingList =
    [...(receipt_deal_info_list ?? [])]?.sort((a, b) => (a?.bridge_index ?? 0) - (b?.bridge_index ?? 0)) ?? [];
  const cpBidContent = transform2CPContent(siblingList?.at(0)?.bid_trade_info, true);
  const cpOfrContent = transform2CPContent(siblingList?.at(-1)?.ofr_trade_info, true);

  return {
    id: parent_deal_id,
    bridgeCode: bridge_code,
    type: 'parent',
    original: omit(parent_child_deal_list, 'receipt_deal_info_list'),
    cpBidContent,
    cpOfrContent,
    children: receipt_deal_info_list?.map(d =>
      transform2ReceiptDealChildRowData({ original: d, grantUserIdList, isOnOrBeforeFirstWorkdayOfMonth })
    ),
    isGroupHeader: true
  };
};

type TransformReceiptDealParams = {
  parent_child_deal_list: ReceiptDealSearchV2.ParentChildDeal;
  isOnOrBeforeFirstWorkdayOfMonth: boolean;
  userList?: string[];
};

export const transform2ReceiptDealRowData = ({
  parent_child_deal_list,
  userList,
  isOnOrBeforeFirstWorkdayOfMonth
}: TransformReceiptDealParams): ReceiptDealRowData | undefined => {
  // 非过桥单
  if (parent_child_deal_list.receipt_deal_info_list?.length === 1) {
    const deal = parent_child_deal_list.receipt_deal_info_list?.at(0);
    if (deal) {
      return transform2ReceiptDealChildRowData({
        original: deal,
        grantUserIdList: userList,
        isOnOrBeforeFirstWorkdayOfMonth
      });
    }
    // 格式错误
    return void 0;
  }
  return transform2ReceiptDealParentRowData({
    parent_child_deal_list,
    grantUserIdList: userList,
    isOnOrBeforeFirstWorkdayOfMonth
  });
};

type FetchReceiptDealParams = {
  /** 筛选项 */
  params: ReceiptDealSearchV2.Request;
  /** 筛选项是否发生了变化 */
  paramsChanged?: boolean;
  /** requestConfig request 配置项 */
  requestConfig?: RequestConfig;
  /** 指定授权人id */
  grantUserIdList?: string[];
  /** 本月第一个工作日 */
  isOnOrBeforeFirstWorkdayOfMonth: boolean;
};

/**
 * @description 成交单查询 轮询接口
 * @url /api/v1/bdm/bds/bds_api/receipt_deal/search_2
 */
export const fetchReceiptDeal = async ({
  params,
  paramsChanged,
  requestConfig,
  grantUserIdList,
  isOnOrBeforeFirstWorkdayOfMonth
}: FetchReceiptDealParams) => {
  const config: RequestConfig = {
    ...requestConfig,
    responseType: 'json',
    transformResponse: undefined
  };

  let traceId = '';
  try {
    const { base_response, parent_child_deal_list, total, bridge_merge_total } =
      await request.post<ReceiptDealSearchV2.Response>(api, params, config);
    traceId = base_response?.trace_id ?? '';

    const { uniqueList: uniqDeals, conflictChildIds } = uniqParentChildList<ReceiptDealSearchV2.ParentChildDeal>(
      parent_child_deal_list ?? [],
      'receipt_deal_info_list',
      'receipt_deal_id'
    );
    if (conflictChildIds.length) {
      logError({ api, logName: 'duplicate_receipt_deal_id', traceId, conflictChildIds });
    }

    /** Bond Info 不为空对象总数 */
    const flatDeals = uniqDeals?.flatMap(d => d.receipt_deal_info_list).filter(Boolean);
    const bondInfoTotal = flatDeals?.filter(
      ({ bond_basic_info }) => !!bond_basic_info && Object.keys(bond_basic_info).length > 0
    ).length;
    // 如果 Bond Info 的总数与返回的列表数量不相等，说明有返回了空的 BondInfo
    if (bondInfoTotal !== flatDeals?.length) {
      logDataError({ api, logName: 'bond-info-null', traceId });
    }

    return {
      list:
        parent_child_deal_list
          ?.map(d =>
            transform2ReceiptDealRowData({
              parent_child_deal_list: d,
              userList: grantUserIdList,
              isOnOrBeforeFirstWorkdayOfMonth
            })
          )
          .filter(Boolean) ?? [],
      flatList: flatDeals,
      originalParentList: parent_child_deal_list?.filter(d => d.bridge_code),
      total,
      bridge_merge_total
    };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      logDataError({ api, logName: 'request-fail', traceId, error });
    } else {
      logDataError({ api, logName: 'transform-fail', traceId, error });
    }

    // 如果筛选项发生了变化，无论发生什么错误，清空 UI 列表
    if (paramsChanged) {
      return { list: [], flatList: [], originalParentList: [], total: 0, bridge_merge_total: 0 };
    }

    throw new Error('fetchReceiptDeal has error but params not change.');
  }
};
