import { BaseResponse, Trader } from '../../common';
import { ProductType } from '../../enum';

/**
 * @description 根据用户输入模糊搜索交易员列表-本地数据
 */
export declare namespace LocalTraderSearch {
  type Request = {
    keyword: string;
    product_type?: ProductType;
    is_precise?: boolean;
    offset?: number;
    count?: number;
    trader_id_list?: string[];
    need_invalid?: boolean; // 是否需要包括无效的数据（离职，停用等）
    need_area?: boolean; // 兼容远端接口类型，是否需要机构的地区信息，本地化无论传啥都会有地区信息
  };
  type Response = {
    list?: Trader[];
    total?: number;
    base_response?: BaseResponse;
  };
}
