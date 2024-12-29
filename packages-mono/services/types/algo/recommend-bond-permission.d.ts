import type { BaseResponse } from '../common';
import { BondPermission } from '../enum';

/**
 * @description 获取推荐债券权限
 * @method POST
 * @url /api/v1/algo/bond_recommend_api/
 */

// eslint-disable-next-line @typescript-eslint/no-redeclare
export declare namespace BondPermission {
  type Request = {
    broker_id: string;
    symbol?: string; // 标识
  };

  type Response = {
    status_code: number;
    status_msg: string;
    permission: BondPermission;
    pass_rule_group?: string[]; // 通过的规则组，H/I/S/L
    base_response: BaseResponse;
  };
}
