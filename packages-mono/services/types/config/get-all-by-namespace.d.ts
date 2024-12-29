import type { BaseResponse } from '../common';

/**
 * @description 获取namespace下所有配置
 * @method POST
 * @url /api/v1/bdm/bds/bds_api/config/get_all_by_namespace
 */
export declare namespace ConfigGetAllByNamespace {
  type Request = {
    namespace: string;
  };

  type Response = {
    status_code: number;
    status_msg: string;
    base_response?: BaseResponse;
    pair_list?: KeyValue[];
  };

  export type KeyValue = {
    key: string;
    val: string;
  };
}
