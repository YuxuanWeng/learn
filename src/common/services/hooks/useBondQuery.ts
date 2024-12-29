import { APIs } from '@fepkg/services/apis';
import { BaseDataBondGetByKeyMarket } from '@fepkg/services/types/base-data/bond-get-by-key-market';
import { FiccBondInfoLevelV2 } from '@fepkg/services/types/enum';
import { useQuery } from '@tanstack/react-query';
import { fetchBondByKeyMarket } from '../api/base-data/key-market-get';

export const useBondQuery = ({
  key_market_list = [],
  info_level = FiccBondInfoLevelV2.InfoLevelDetail,
  with_related_info = true
}: Partial<BaseDataBondGetByKeyMarket.Request>) => {
  const params = { key_market_list, info_level, with_related_info };

  return useQuery({
    queryKey: [APIs.baseData.keyMarketGet, params],
    queryFn: ({ signal }) => fetchBondByKeyMarket(params, { signal }),
    enabled: !!key_market_list.length,
    refetchOnWindowFocus: false,
    notifyOnChangeProps: ['data'],
    staleTime: 24 * 60 * 1000,
    cacheTime: 24 * 60 * 1000
  });
};
