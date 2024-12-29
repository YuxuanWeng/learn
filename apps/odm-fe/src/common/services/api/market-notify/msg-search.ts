import { RequestConfig } from '@fepkg/request/types';
import { APIs } from '@fepkg/services/apis';
import { MarketNotifyMsgSearch } from '@fepkg/services/types/market-notify/msg-search';
import request from '@/common/request';

/**
 * @description 查询外发数据
 * @method POST
 * @url /api/v1/bdm/bds/bds_api/market_notify/msg/search
 */
export const notifyMsgSearch = (params: MarketNotifyMsgSearch.Request, config?: RequestConfig) => {
  return request.post<MarketNotifyMsgSearch.Response>(APIs.marketNotify.msgSearch, params, config);
};
