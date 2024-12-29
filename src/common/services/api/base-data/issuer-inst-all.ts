import { RequestConfig } from '@fepkg/request/types';
import { APIs } from '@fepkg/services/apis';
import { BaseDataIssuerInstGetAll } from '@fepkg/services/types/base-data/issuer-inst-get-all';
import request from '@/common/request';

/**
 * @description 拉取发行人信息
 * @method POST
 * @url /api/v1/bdm/bds/bds_api/base_data/issuer_inst/get_all
 */

export const getAllIssuerInst = (params: BaseDataIssuerInstGetAll.Request, config?: RequestConfig) => {
  return request.post<BaseDataIssuerInstGetAll.Response>(APIs.baseData.getAllIssuerInst, params, config);
};
