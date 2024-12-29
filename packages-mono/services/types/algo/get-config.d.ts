import type { BaseResponse, BondRecommendConfig } from '../common';

/**
 * @description 获取模板配置规则
 * @method POST
 * @url /api/v1/algo/bond_recommend_api/get_config
 */
export declare namespace GetConfig {
  type Request = {
    broker_id?: string;
  };

  type Response = {
    status_code: number;
    status_msg: string;
    list?: TraderBondConfig[];
    base_response: BaseResponse;
  };

  export type TraderBondConfig = {
    trader_id: string;
    trader_name: string;
    inst_name: string;
    list?: BondRecommendConfig[];
    h_enabled: boolean;
    f_enabled: boolean;
    crm_im_enabled: boolean;
    im_enabled: boolean;
    crm_qm_enabled: boolean;
    qm_enabled: boolean;
    trader_pinyin_full: string;
    trader_pinyin: string;
    inst_pinyin_full: string;
    inst_pinyin: string;
    issuer_enabled: boolean;
  };
}
