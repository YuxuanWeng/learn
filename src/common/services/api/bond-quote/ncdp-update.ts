import { RequestConfig } from '@fepkg/request/types';
import { APIs } from '@fepkg/services/apis';
import type { BondQuoteNcdpUpdate } from '@fepkg/services/types/bond-quote/ncdp-update';
import { NCDPInfoLiteUpdate } from '@fepkg/services/types/common';
import { NCDPOperationType, OperationSource, ProductType } from '@fepkg/services/types/enum';
import request from '@/common/request';
import { miscStorage } from '@/localdb/miscStorage';

/**
 * @description 更新NCD一级
 * @url /api/v1/bdm/bds/bds_api/bond_quote/ncdp/update
 */
export const mulUpdateNCDP = (
  ncdp_info_list: NCDPInfoLiteUpdate[] | undefined,
  operation_type: NCDPOperationType,
  config?: RequestConfig
) => {
  return request.post<BondQuoteNcdpUpdate.Response, BondQuoteNcdpUpdate.Request>(
    APIs.bondQuote.ncdp.update,
    {
      ncdp_info_list,
      operation_info: {
        operator: miscStorage?.userInfo?.user_id ?? '',
        operation_type,
        operation_source: OperationSource.OperationSourceBdsIdb
      }
    },
    { fromProductType: ProductType.NCDP, ...config }
  );
};
