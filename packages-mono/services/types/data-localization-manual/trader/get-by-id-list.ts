import { BaseResponse, TraderSync } from '../../common';

/**
 * @description 读取本地数据库中的交易员信息
 */
export declare namespace LocalTraderGetByIdList {
  type Request = {
    trader_id_list: string[];
  };

  type Response = {
    trader_sync_list?: TraderSync[];
    base_response?: BaseResponse;
  };
}
