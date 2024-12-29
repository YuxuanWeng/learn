import type { BaseResponse, OperationInfo } from '../common';

/**
 * @description 市场成交- 右边栏批量更新到同一值
 * @method POST
 * @url /api/v1/bdm/bds/bds_api/market_deal/mul_update_by_ids
 */
export declare namespace MarketDealMulUpdateByIds {
  type Request = {
    market_deal_id_list?: string[]; // 市场成交ID
    flag_internal?: boolean; // 是否为内部市场成交
    operation_info: OperationInfo; // 操作类型
  };

  type Response = {
    base_response?: BaseResponse;
  };
}
