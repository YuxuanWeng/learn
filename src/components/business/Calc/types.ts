import { LiquidationSpeed } from '@fepkg/services/types/common';

export type CalcType = {
  /** 备注 */
  comment?: string;
  /** 结算方式 */
  liquidation_speed_list?: LiquidationSpeed[];
  /** 是否行权 */
  is_exercise?: boolean;
  /** 交易日 */
  traded_date?: string;
  /** 结算日 */
  settlement_date?: string;
  /** 交割日 */
  delivery_date?: string;
  /** 交易所 */
  flag_stock_exchange?: boolean;
  /** 点双边 */
  flag_bilateral?: boolean;
  /** 请求报价 */
  flag_request?: boolean;
  /** 整量 */
  flag_indivisible?: boolean;
  /** 是否手动操作行权 */
  exercise_manual?: boolean;
};
