import type { BaseResponse } from '../common';
import { DateType, Rating } from '../enum';

/**
 * @description ncd二级录入文本识别筛选项
 * @method POST
 * @url /api/v1/bdm/bds/bds_api/parsing/ncd_filter
 */
export declare namespace ParsingNcdFilter {
  type Request = {
    user_input: string;
  };

  type Response = {
    ncd_filter?: NcdParsingFilter;
    base_response?: BaseResponse;
  };

  export type NcdParsingFilter = {
    maturity_min: number;
    maturity_min_type: DateType;
    maturity_max: number;
    maturity_max_type: DateType;
    code_market_list?: string[];
    key_market_list?: string[];
    rating_list?: Rating[];
    inst_id_list?: string[];
    inst_name_list?: string[];
    inst_types?: string[];
    season?: number;
  };
}
