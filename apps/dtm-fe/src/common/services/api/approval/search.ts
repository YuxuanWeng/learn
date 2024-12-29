import { AdvancedApprovalTypeOptions } from '@fepkg/business/constants/options';
import { transform2BrokerContent, transform2CPContent, uniqParentChildList } from '@fepkg/business/utils/receipt-deal';
import { transform2DateContent } from '@fepkg/common/utils/date';
import { RequestConfig } from '@fepkg/request/types';
import { APIs } from '@fepkg/services/apis';
import { ReceiptDeal, ReceiptDealApproval } from '@fepkg/services/types/common';
import { AdvancedApprovalType, ReceiptDealStatus } from '@fepkg/services/types/enum';
import { ReceiptDealApprovalSearch } from '@fepkg/services/types/receipt-deal/approval-search';
import { ReceiptDealApprovalSearchHistory } from '@fepkg/services/types/receipt-deal/approval-search-history';
import { captureMessage } from '@sentry/react';
import axios from 'axios';
import { omit } from 'lodash-es';
import moment from 'moment';
import { logError } from '@/common/logger';
import request from '@/common/request';
import { ApprovalTableRowData } from '@/pages/ApprovalList/types';

/** MarketDealSearch 接口返回并转换后的数据 */
export type ReceiptDealApprovalFetchData = {
  list?: ApprovalTableRowData[];
  flatDeals?: ReceiptDeal[];
  total?: number;
  bridge_merge_total?: number;
  cur_role_list?: string[];
  current_version?: string;
  flag_search_child: boolean;
};

const TODAY = moment().startOf('day').valueOf();

export const getAdvancedTagsOptions = (receiptDeal: ReceiptDeal) => {
  return receiptDeal.advanced_approval_type
    ?.map((type, index) => {
      const label = AdvancedApprovalTypeOptions.find(option => option.value === type)?.label ?? '';
      const content: string[] = [];
      switch (type) {
        case AdvancedApprovalType.AdvancedApprovalTypeSpecialBrokerage:
          content.push(receiptDeal.bid_trade_info.brokerage || '双倍', receiptDeal.ofr_trade_info.brokerage || '双倍');
          break;
        case AdvancedApprovalType.AdvancedApprovalTypeNC:
          content.push(receiptDeal.bid_trade_info.nc || '--', receiptDeal.ofr_trade_info.nc || '--');
          break;
        case AdvancedApprovalType.AdvancedApprovalTypeMD:
          content.push(`本次提交日与交易日(${receiptDeal?.sub_rule_name_list?.at(index) ?? ''})`);
          break;
        case AdvancedApprovalType.AdvancedApprovalTypeSD:
          content.push(`首次提交日与交易日(${receiptDeal?.sub_rule_name_list?.at(index) ?? ''})`);
          break;
        case AdvancedApprovalType.AdvancedApprovalTypeDestroy:
          content.push(receiptDeal.destroy_reason || '--');
          break;
        default:
          break;
      }
      return { label, content };
    })
    .filter(option => option.content.length > 0);
};

const transform2Comment = (receipt_deal: ReceiptDeal) => {
  const bidComment = receipt_deal.bid_trade_info.brokerage;
  const ofrComment = receipt_deal.ofr_trade_info.brokerage;
  return [`${bidComment ?? ''}`, `${ofrComment ?? ''}`];
};

const getApprovalContent = (receipt_deal: ReceiptDeal, cur_role_list: string[], userId: string) => {
  if (!cur_role_list.length) return void 0;
  const { all_approval_role_list, all_approver_id_list, cur_approval_role, receipt_deal_status } = receipt_deal;
  let approval: 'myself' | 'others' | 'approval' | undefined;

  if (!all_approval_role_list?.some(r => cur_role_list.includes(r))) {
    // 若本人没有审核权限，则不展示任何信息
    approval = void 0;
  } else if (
    [ReceiptDealStatus.ReceiptDealNoPass, ReceiptDealStatus.ReceiptDealDestroyed].includes(receipt_deal_status)
  ) {
    // 审核不通过的角色为本人所属，则展示信息
    if (
      cur_role_list.includes(
        all_approval_role_list?.at(
          Math.min((all_approver_id_list?.length ?? 1) - 1, all_approval_role_list.length - 1)
        ) ?? ''
      )
    ) {
      if (all_approver_id_list?.at(-1) === userId) {
        approval = 'myself';
      } else {
        approval = 'others';
      }
    } else {
      approval = void 0;
    }
  } else if (cur_role_list.includes(cur_approval_role ?? '')) {
    // 当前审核角色是否与本人相同
    approval = 'approval';
  } else {
    // 属于本人角色的阶段数量
    const myApproveRoleList = all_approval_role_list?.filter(role => cur_role_list.includes(role));
    const firstApproveRole = myApproveRoleList.at(0);
    const firstApproval = all_approver_id_list?.at(all_approval_role_list?.indexOf(firstApproveRole ?? ''));
    // 属于本人所属角色仅有一个阶段
    if (myApproveRoleList.length === 1) {
      // 属于本人已审核
      if (all_approver_id_list?.includes(userId)) {
        approval = 'myself';
        // 属于他人已审核
      } else if (firstApproval) {
        approval = 'others';
      } else {
        approval = void 0;
      }
    } else {
      // 属于本人所属角色有两个阶段
      const secondApproveRole = myApproveRoleList.at(1);
      const secondApprovorId = all_approver_id_list?.at(all_approval_role_list?.lastIndexOf(secondApproveRole ?? ''));
      // 还未进行到第二阶段
      if (!secondApprovorId) {
        if (firstApproval === userId) {
          approval = 'myself';
        } else {
          approval = 'others';
        }
      } else if (secondApprovorId === userId) {
        approval = 'myself';
      } else {
        approval = 'others';
      }
    }
  }
  return approval;
};

const transform2ApprovalChildRowData = (
  receipt_deal: ReceiptDeal,
  cur_role_list?: string[],
  userId?: string
): ApprovalTableRowData => {
  const { receipt_deal_id, bid_trade_info, ofr_trade_info, traded_date, volume } = receipt_deal;
  const comment = transform2Comment(receipt_deal);
  // dtm涉及到的交易员标签都不展示，这里引用的方法
  const cpBidContent = transform2CPContent(bid_trade_info, false);
  const cpOfrContent = transform2CPContent(ofr_trade_info, false);
  const advancedApprovalTags = getAdvancedTagsOptions(receipt_deal);
  const tradedDate = transform2DateContent(traded_date);
  const [bidBrokerContent] = transform2BrokerContent(bid_trade_info);
  const [ofrBrokerContent] = transform2BrokerContent(ofr_trade_info);
  const approval = cur_role_list ? getApprovalContent(receipt_deal, cur_role_list, userId ?? '') : void 0;
  const amount = ((volume ?? 0) / 100).toString();
  const isTradeDayToday = +traded_date >= TODAY;

  return {
    id: receipt_deal_id,
    type: 'child',
    original: receipt_deal,
    cpBidContent,
    cpOfrContent,
    comment,
    advancedApprovalTags,
    tradedDate,
    bidBrokerContent,
    ofrBrokerContent,
    approval,
    amount,
    isTradeDayToday
  };
};

const transform2ApprovalParentRowData = (
  receipt_deal_approval: ReceiptDealApproval,
  cur_role_list?: string[],
  userId?: string
): ApprovalTableRowData => {
  const { parent_deal_id, bid_inst, bid_trader, ofr_inst, ofr_trader, deal_list } = receipt_deal_approval;
  const cpBidContent = transform2CPContent({ inst: bid_inst, trader: bid_trader }, true);
  const cpOfrContent = transform2CPContent({ inst: ofr_inst, trader: ofr_trader }, true);
  return {
    id: parent_deal_id,
    type: 'parent',
    original: omit(receipt_deal_approval, 'deal_list'),
    cpBidContent,
    cpOfrContent,
    children: deal_list?.map(d => transform2ApprovalChildRowData(d, cur_role_list, userId))
  };
};

export const transform2ReceiptDealApprovalRowData = (
  receipt_deal_approval: ReceiptDealApproval,
  cur_role_list?: string[],
  userId?: string,
  flag_search_child?: boolean
): ApprovalTableRowData | undefined => {
  // 非过桥单
  if (!receipt_deal_approval.bridge_code || flag_search_child) {
    const deal = receipt_deal_approval.deal_list?.at(0);
    if (deal) {
      return transform2ApprovalChildRowData(deal, cur_role_list, userId);
    }
    // 格式错误
    return void 0;
  }
  return transform2ApprovalParentRowData(receipt_deal_approval, cur_role_list, userId);
};

type FetchReceiptDealApprovalParams = {
  /** 筛选项 */
  params: ReceiptDealApprovalSearch.Request;
  /** 筛选项是否发生了变化 */
  paramsChanged?: boolean;
  /** requestConfig request 配置项 */
  requestConfig?: RequestConfig;
  userId?: string;
};

/**
 * @description 获取审批列表
 * @url /api/v1/bdm/bds/bds_api/receipt_deal/approval/search
 */
export const fetchReceiptDealApproval = async ({
  params,
  paramsChanged,
  requestConfig,
  userId
}: FetchReceiptDealApprovalParams): Promise<ReceiptDealApprovalFetchData> => {
  const api = APIs.receiptDealApproval.search;

  const config: RequestConfig = {
    ...requestConfig,
    responseType: 'json',
    transformResponse: undefined
  };

  let traceId = '';
  try {
    const { receipt_deal_list, total, bridge_merge_total, cur_role_list, base_response } =
      await request.post<ReceiptDealApprovalSearch.Response>(api, params, config);
    traceId = base_response?.trace_id ?? '';

    const { uniqueList: uniqDeals, conflictChildIds } = uniqParentChildList<ReceiptDealApproval>(
      receipt_deal_list ?? [],
      'deal_list',
      'receipt_deal_id'
    );
    if (conflictChildIds.length) {
      logError({ api, logName: 'duplicate_receipt_deal_id', traceId, conflictChildIds });
    }

    return {
      list: uniqDeals
        .map(d => transform2ReceiptDealApprovalRowData(d, cur_role_list, userId, params.flag_search_child))
        .filter(Boolean),
      total,
      bridge_merge_total,
      cur_role_list,
      flag_search_child: !!params.flag_search_child
    };
  } catch (err) {
    if (axios.isAxiosError(err)) {
      // captureMessage('fetchReceiptDealApproval request fail.', { extra: { err } });
    } else {
      captureMessage('fetchReceiptDealApproval transform fail.', { extra: { err } });
    }

    // 如果筛选项发生了变化，无论发生什么错误，清空 UI 列表
    if (paramsChanged) {
      return {
        list: [],
        total: 0,
        bridge_merge_total: 0,
        cur_role_list: [],
        flag_search_child: !!params.flag_search_child
      };
    }

    throw new Error('fetchReceiptDealApproval has error but params not change.');
  }
};

type FetchReceiptDealApprovalHistoryParams = {
  /** 筛选项 */
  params: ReceiptDealApprovalSearchHistory.Request;
  /** 筛选项是否发生了变化 */
  paramsChanged?: boolean;
  /** requestConfig request 配置项 */
  requestConfig?: RequestConfig;
};

/**
 * @description 获取审批列表
 * @url /api/v1/bdm/bds/bds_api/receipt_deal/approval/search_history
 */
export const fetchReceiptDealApprovalHistory = async ({
  params,
  paramsChanged,
  requestConfig
}: FetchReceiptDealApprovalHistoryParams): Promise<ReceiptDealApprovalFetchData> => {
  const api = APIs.receiptDealApproval.searchHistory;

  const config: RequestConfig = {
    ...requestConfig,
    responseType: 'json',
    transformResponse: undefined
  };

  let traceId = '';
  try {
    const { receipt_deal_list, total, bridge_merge_total, base_response } =
      await request.post<ReceiptDealApprovalSearchHistory.Response>(api, params, config);
    traceId = base_response?.trace_id ?? '';

    const { uniqueList: uniqDeals, conflictChildIds } = uniqParentChildList<ReceiptDealApproval>(
      receipt_deal_list ?? [],
      'deal_list',
      'receipt_deal_id'
    );
    if (conflictChildIds.length) {
      logError({ api, logName: 'duplicate_receipt_deal_id', traceId, conflictChildIds });
    }
    const flatDeals = uniqDeals?.flatMap(d => d.deal_list).filter(Boolean);

    return {
      list: uniqDeals
        .map(d => transform2ReceiptDealApprovalRowData(d, void 0, void 0, params.flag_search_child))
        .filter(Boolean),
      flatDeals,
      total,
      bridge_merge_total,
      flag_search_child: !!params.flag_search_child
    };
  } catch (err) {
    if (axios.isAxiosError(err)) {
      // captureMessage('fetchReceiptDealApprovalHistory request fail.', { extra: { err } });
    } else {
      captureMessage('fetchReceiptDealApprovalHistory transform fail.', { extra: { err } });
    }

    // 如果筛选项发生了变化，无论发生什么错误，清空 UI 列表
    if (paramsChanged) {
      return {
        list: [],
        flatDeals: [],
        total: 0,
        bridge_merge_total: 0,
        flag_search_child: !!params.flag_search_child
      };
    }

    throw new Error('fetchReceiptDealApprovalHistory has error but params not change.');
  }
};
