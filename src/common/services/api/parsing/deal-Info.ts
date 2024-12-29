import { RequestConfig } from '@fepkg/request/types';
import { APIs } from '@fepkg/services/apis';
import type { ParsingDealInfo } from '@fepkg/services/types/parsing/deal-info';
import request from '@/common/request';

/**
 * @description 线下成交信息识别
 * @url /api/v1/bdm/bds/bds_api/parsing/deal_info
 */
export const fetchParsingDealInfo = (params: ParsingDealInfo.Request, config?: RequestConfig) => {
  return request.post<ParsingDealInfo.Response>(APIs.parsing.dealInfo, params, config);
};
