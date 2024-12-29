import { RequestConfig } from '@fepkg/request/types';
import { APIs } from '@fepkg/services/apis';
import { ProductType } from '@fepkg/services/types/bdm-enum';
import { BondQuoteNcdpGetOperationLog } from '@fepkg/services/types/bond-quote/ncdp-get-operation-log';
import request from '@/common/request';

/**
 * @description 根据存单ID获取存单日志
 * @url /api/v1/bdm/bds/bds_api/bond_quote/ncdp/get_operation_log
 */

export const getNCDOperationLog = (params: BondQuoteNcdpGetOperationLog.Request, config?: RequestConfig) => {
  return request.post<BondQuoteNcdpGetOperationLog.Response>(APIs.bondQuote.ncdp.getOperationLog, params, {
    fromProductType: ProductType.NCDP,
    ...config
  });
};
