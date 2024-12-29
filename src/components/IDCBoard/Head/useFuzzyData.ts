import { useMemo } from 'react';
import { transform2BondOpt } from '@fepkg/business/components/Search/BondSearch';
import { APIs } from '@fepkg/services/apis';
import type { BaseDataBondSearch } from '@fepkg/services/types/base-data/bond-search';
import { FiccBondBasic } from '@fepkg/services/types/common';
import { BondSearchType } from '@fepkg/services/types/enum';
import { useFuzzySearchQuery } from '@/common/services/hooks/useFuzzySearchQuery';
import { useProductParams } from '@/layouts/Home/hooks';
import { isBondExpire } from '../utils';

interface IProps {
  kwd: string;
  disabled?: boolean;
}

export default function useFuzzyData({ kwd, disabled }: IProps) {
  const { productType } = useProductParams();

  const {
    data: fuzzyData,
    refetch: refetchFuzzy,
    isFetching: isFuzzyFetching
  } = useFuzzySearchQuery<BaseDataBondSearch.Response, BaseDataBondSearch.Request>({
    api: APIs.baseData.bondSearch,
    keyword: kwd,
    searchParams: {
      product_type: productType,
      search_type: BondSearchType.SearchDealProcess,
      offset: '0',
      count: '20'
    },
    queryOptions: { enabled: !disabled && !!kwd, notifyOnChangeProps: ['data'] }
  });

  const options = useMemo(() => {
    let res: FiccBondBasic[] = [];
    if (kwd) res = fuzzyData?.bond_basic_list ?? [];
    else res = [];
    return res
      .filter(item => item.product_type === productType)
      .filter(item => !isBondExpire(item))
      .map(transform2BondOpt)
      .filter(Boolean);
  }, [kwd, fuzzyData, productType]);

  return {
    options,
    fuzzyData,
    isFuzzyFetching,
    refetchFuzzy
  };
}
