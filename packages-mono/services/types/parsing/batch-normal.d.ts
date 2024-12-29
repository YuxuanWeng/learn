import type { BaseResponse, BondLite, FiccBondBasic } from '../common';
import { ProductType } from '../enum';

/**
 * @description 批量普通识别: 将用户输入识别为债券信息
 * @method POST
 * @url /api/v1/bdm/bds/bds_api/parsing/batch_normal
 */
export declare namespace ParsingBatchNormal {
  type Request = {
    user_input: string;
    product_type?: ProductType;
  };

  type Response = {
    base_response?: BaseResponse;
    /** @deprecated */
    bond_list?: BondLite[]; // using bond_basic_list instead
    bond_basic_list?: FiccBondBasic[];
  };
}
