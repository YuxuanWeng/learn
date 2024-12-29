import type { BaseResponse, LiquidationSpeed } from '../common';
import { ProductType } from '../enum';

/**
 * @description 结算日期识别: 将用户输入识别为清算速度
 * @method POST
 * @url /api/v1/bdm/bds/bds_api/parsing/clear_speed
 */
export declare namespace ParsingClearSpeed {
  type Request = {
    user_input: string;
    only_date?: boolean; // 如果这个字段传true，则返回的清算速度格式全部转为日期+N，没有周一/周二+N这种
    product_type?: ProductType; // 如果传入only_date, 会用于转换时间戳（不同台子默认的意义不同）
  };

  type Response = {
    base_response?: BaseResponse;
    clear_speeds?: LiquidationSpeed[];
    today_offset?: number; // 相对于今天(T)的Offset， 为0, 1, 其它(2)，仅当only_date为true时计算
    delivery_date?: string; // 实际交割日期，仅当only_date为true时计算，用于计算器界面展示
  };
}
