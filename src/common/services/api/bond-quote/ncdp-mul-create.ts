import { RequestConfig } from '@fepkg/request/types';
import { APIs } from '@fepkg/services/apis';
import { BondQuoteNcdpMulCreate } from '@fepkg/services/types/bond-quote/ncdp-mul-create';
import { NCDPInfoLite } from '@fepkg/services/types/common';
import { NCDPOperationType, OperationSource, ProductType } from '@fepkg/services/types/enum';
import request from '@/common/request';
import { miscStorage } from '@/localdb/miscStorage';

/**
 * @description 批量新增NCD一级
 * @url /api/v1/bdm/bds/bds_api/bond_quote/ncdp/mul_create
 */
export const mulCreateNCDP = (ncdp_info_list?: NCDPInfoLite[], config?: RequestConfig) => {
  return request.post<BondQuoteNcdpMulCreate.Response, BondQuoteNcdpMulCreate.Request>(
    APIs.bondQuote.ncdp.mulCreate,
    {
      ncdp_info_list,
      operation_info: {
        operator: miscStorage?.userInfo?.user_id ?? '',
        operation_type: NCDPOperationType.NcdPAdd,
        operation_source: OperationSource.OperationSourceBdsIdb
      }
    },
    { fromProductType: ProductType.NCDP, ...config }
  );
};
