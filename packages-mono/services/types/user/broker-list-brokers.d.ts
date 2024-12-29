import type { BaseResponse, User } from '../common';
import { ProductType } from '../enum';

/**
 * @description 根据台子搜索所有经纪人列表
 * @method POST
 * @url /api/v1/bdm/bds/bds_api/user/broker/list
 */
export declare namespace BrokerListBrokers {
  type Request = {
    product_type: ProductType; // 当前台子
    offset?: number;
    count?: number;
  };

  type Response = {
    status_code: number;
    status_msg: string;
    list?: User[]; // 经纪人列表
    total?: number;
    base_response?: BaseResponse;
  };
}
