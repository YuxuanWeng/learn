import type { BaseResponse } from '../common';

/**
 * @description 根据quote获取推荐债券(测试接口，不用于在线环境!!!)
 * @method POST
 * @url /api/v1/algo/bond_recommend_api/get_quote_operation_log
 */
export declare namespace GetQuoteOperationLog {
  type Request = {
    start_time: number;
    end_time: number;
    operation_type?: string;
    trader_id?: string;
    side?: number;
    count?: number;
    offset?: number;
  };

  type Response = {
    status_code: number;
    status_msg: string;
    log_list?: BondQuoteOperationLog[]; // 日志列表
    base_response: BaseResponse;
  };

  export type BondQuoteOperationLog = {
    log_id: string; // 日志ID
    quote_id: string; // 报价ID
    operator: string; // 操作者
    operation_type: string; // 操作类型
    trader_id: string; // 交易员id
    create_time: string; // 操作时间
    bond_code: string; // 债券代码
    side: number; // bid/ofr方向
  };
}
