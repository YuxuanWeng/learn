import { getRequest } from '@fepkg/request';
import { RequestConfig } from '@fepkg/request/types';
import { APIs } from '@fepkg/services/apis';
import type { ParsingQuoteInfo } from '@fepkg/services/types/parsing/quote-info';

/**
 * @description 单条报价信息识别: 将用户输入识别为报价信息
 * @url /api/v1/bdm/bds/bds_api/parsing/quote_info
 */
export const fetchParsingQuoteInfo = (params: ParsingQuoteInfo.Request, config?: RequestConfig) => {
  return getRequest().post<ParsingQuoteInfo.Response>(APIs.parsing.quoteInfo, params, config);
};
