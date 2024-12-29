import type { BaseResponse } from '../common';
import { Acceptor, MarketNotifyMsgType, ProductType } from '../enum';

export type MarketNotifyMsg = {
  acceptor_id: Acceptor; // 接收方
  market_notify_msg_type: MarketNotifyMsgType; // 外发数据消息类型
  data_map: Record<number, string>; // 消息内容
  create_time: string; // 创建时间
};

/**
 * @description 查询外发数据
 * @method POST
 * @url /api/v1/bdm/bds/bds_api/market_notify/msg/search
 */
export declare namespace MarketNotifyMsgSearch {
  type Request = {
    acceptor_id: Acceptor; // 接收方
    market_notify_msg_type?: MarketNotifyMsgType; // 外发数据消息类型
    start_time?: string; // 起始时间
    end_time?: string; // 结束时间
    offset?: number;
    count?: number;
    product_type?: ProductType[]; // 台子
  };

  type Response = {
    base_response?: BaseResponse;
    msg_list?: MarketNotifyMsg[];
    total?: number;
  };
}
