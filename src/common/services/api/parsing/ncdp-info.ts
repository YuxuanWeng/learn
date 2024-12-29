import { RequestConfig } from '@fepkg/request/types';
import { APIs } from '@fepkg/services/apis';
import { ProductType } from '@fepkg/services/types/bdm-enum';
import { ParsingNcdpInfo } from '@fepkg/services/types/parsing/ncdp-info';
import request from '@/common/request';

/**
 * @description ncd一级录入文本识别
 * @url /api/v1/bdm/bds/bds_api/parsing/ncdp_info
 */
export const parsingNCDPInfo = (params: ParsingNcdpInfo.Request, config?: RequestConfig) => {
  return request.post<ParsingNcdpInfo.Response>(APIs.parsing.ncdpInfo, params, {
    fromProductType: ProductType.NCDP,
    ...config
  });
};
