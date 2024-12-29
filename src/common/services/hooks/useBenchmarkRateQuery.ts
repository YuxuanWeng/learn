import { APIs } from '@fepkg/services/apis';
import { BaseDataBondBenchmarkRateGet } from '@fepkg/services/types/base-data/bond-benchmark-rate-get';
import { BondBenchmarkRate } from '@fepkg/services/types/common';
import { QueryFunction, UseQueryOptions, useQuery } from '@tanstack/react-query';
import { isFR } from '@/common/utils/bond';
import { fetchBondBenchMarkRate } from '../api/base-data/bond-benchmark-rate-get';

type BenchmarkRateQueryVars = BaseDataBondBenchmarkRateGet.Request & {
  is_fixed_rate?: boolean;
};

type BenchmarkRateQueryResult = Partial<BondBenchmarkRate> & {
  benchmark_rate?: string;
};

/** 获取债券基准利率 Query */
export const useBenchmarkRateQuery = (
  { is_fixed_rate, key_market, end_date }: BenchmarkRateQueryVars,
  options?: UseQueryOptions<BenchmarkRateQueryResult | undefined>
) => {
  const params = { key_market, end_date };

  const queryFn: QueryFunction<BenchmarkRateQueryResult | undefined> = async ({ signal }) => {
    if (!key_market || !isFR({ is_fixed_rate })) return undefined;

    const res = await fetchBondBenchMarkRate(params, { signal });
    const rate = res?.benchmark_rate?.value.toFixed(4);
    return { ...res?.benchmark_rate, benchmark_rate: rate };
  };

  return useQuery({
    queryKey: [APIs.baseData.bondBenchMarkRateGet, params],
    queryFn,
    enabled: !!key_market,
    refetchOnWindowFocus: false,
    staleTime: 4 * 60 * 1000,
    cacheTime: 4 * 60 * 1000,
    notifyOnChangeProps: ['data', 'refetch'],
    ...options
  });
};
