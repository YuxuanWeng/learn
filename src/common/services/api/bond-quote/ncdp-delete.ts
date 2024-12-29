import { RequestConfig } from '@fepkg/request/types';
import { APIs } from '@fepkg/services/apis';
import type { BondQuoteNcdpDelete } from '@fepkg/services/types/bond-quote/ncdp-delete';
import { NCDPOperationType, OperationSource, ProductType } from '@fepkg/services/types/enum';
import request from '@/common/request';
import { miscStorage } from '@/localdb/miscStorage';

/**
 * @description 删除NCD一级
 * @url /api/v1/bdm/bds/bds_api/bond_quote/ncdp/delete
 */
export const mulDeleteNCDP = (ncdp_id_list?: string[], config?: RequestConfig) => {
  return request.post<BondQuoteNcdpDelete.Response, BondQuoteNcdpDelete.Request>(
    APIs.bondQuote.ncdp.delete,
    {
      ncdp_id_list,
      operation_info: {
        operator: miscStorage?.userInfo?.user_id ?? '',
        operation_type: NCDPOperationType.NcdPDelete,
        operation_source: OperationSource.OperationSourceBdsIdb
      }
    },
    { fromProductType: ProductType.NCDP, ...config }
  );
};
