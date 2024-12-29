import type { BaseResponse, BondBenchmarkRate } from '../common';

/**
 * @description 债券基准利率查询
 * @method POST
 * @url /api/v1/bdm/bds/bds_api/base_data/bond_benchmark_rate/get
 */
export declare namespace BaseDataBondBenchmarkRateGet {
  type Request = {
    key_market: string; // 债券唯一标识
    end_date?: string; // YYYY-MM-DD格式的截止时间，计算时取截止日期前n天
  };

  type Response = {
    status_code: number;
    status_msg: string;
    base_response?: BaseResponse;
    benchmark_rate?: BondBenchmarkRate; // 债券基准利率
  };
}
