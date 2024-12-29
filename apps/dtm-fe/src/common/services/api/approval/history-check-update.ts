import { RequestConfig } from '@fepkg/request/types';
import { APIs } from '@fepkg/services/apis';
import { ReceiptDealApprovalHistoryCheckUpdate } from '@fepkg/services/types/receipt-deal/approval-history-check-update';
import { captureMessage } from '@sentry/react';
import axios from 'axios';
import moment from 'moment';
import request from '@/common/request';

type FetchReceiptDealApprovalHistoryCheckUpdateParams = {
  /** 筛选项 */
  params: ReceiptDealApprovalHistoryCheckUpdate.Request;
  /** 筛选项是否发生了变化 */
  paramsChanged?: boolean;
  /** requestConfig request 配置项 */
  requestConfig?: RequestConfig;
};

/**
 * @description 获取成交审批历史是否需要更新
 * @url /api/v1/bdm/bds/bds_api/receipt_deal/approval/history/check_update
 */
export const fetchApprovalHistoryCheckUpdate = async ({
  params,
  paramsChanged,
  requestConfig
}: FetchReceiptDealApprovalHistoryCheckUpdateParams): Promise<{ need_update: boolean; filter_total: number }> => {
  const api = APIs.receiptDealApproval.history.checkUpdate;

  try {
    // 没有选择时，日期筛选控件禁用，默认展示最近7日的成交数据
    if (!params.traded_date_range) {
      params.traded_date_range = {
        start_time: moment().subtract(6, 'month').startOf('day').valueOf().toString()
      };
    }

    const { need_update, filter_total } = await request.post<ReceiptDealApprovalHistoryCheckUpdate.Response>(
      api,
      params,
      requestConfig
    );

    return { need_update, filter_total };
  } catch (err) {
    if (axios.isAxiosError(err)) {
      // captureMessage('fetchApprovalHistoryCheckUpdate request fail.', { extra: { err } });
    } else {
      captureMessage('fetchApprovalHistoryCheckUpdate transform fail.', { extra: { err } });
    }

    // 如果筛选项发生了变化，无论发生什么错误，清空 UI 列表
    if (paramsChanged) {
      return { need_update: false, filter_total: 0 };
    }

    throw new Error('fetchApprovalHistoryCheckUpdate has error but params not change.');
  }
};
