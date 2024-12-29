import { RequestConfig } from '@fepkg/request/types';
import { APIs } from '@fepkg/services/apis';
import type { BaseDataBondBenchmarkRateGet } from '@fepkg/services/types/base-data/bond-benchmark-rate-get';
import request from '@/common/request';

/**
 * @description 债券基准利率查询
 * @url /api/v1/bdm/bds/bds_api/base_data/bond_benchmark_rate/get
 */
export const fetchBondBenchMarkRate = (params: BaseDataBondBenchmarkRateGet.Request, config?: RequestConfig) => {
  return request.post<BaseDataBondBenchmarkRateGet.Response>(APIs.baseData.bondBenchMarkRateGet, params, config);
};
