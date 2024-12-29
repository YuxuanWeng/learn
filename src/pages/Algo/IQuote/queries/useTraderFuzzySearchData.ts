import { useMemo, useState } from 'react';
import { SearchOption } from '@fepkg/components/Search';
import { APIs } from '@fepkg/services/apis';
import { Trader } from '@fepkg/services/types/common';
import type { InstTraderSearch } from '@fepkg/services/types/inst-trader/search';
import { useFuzzySearchQuery } from '@/common/services/hooks/useFuzzySearchQuery';
import { TraderRender } from '@/components/Quote/types';
import { useProductParams } from '@/layouts/Home/hooks';

export const trader2option = (item: Trader) => {
  const instName = item.inst_info?.short_name_zh;
  let name = item.name_zh;
  if (instName) name += `(${instName})`;
  return {
    label: name,
    value: name,
    original: item
  };
};

export const traders2options = (options?: Trader[]) => {
  if (!options || options.length === 0) return [];
  const result: Omit<TraderRender, 'disabled'>[] = [];
  options.forEach(item => {
    result.push(trader2option({ ...item, tags: [] }));
  });
  return result;
};

/** 交易模糊搜素列表 */
export const useTraderFuzzySearchData = (keyword: string) => {
  const [traderList, setTraderList] = useState<Trader[]>([]);
  const { productType } = useProductParams();

  useFuzzySearchQuery<InstTraderSearch.Response, InstTraderSearch.Request>({
    api: APIs.instTrader.search,
    keyword,
    searchParams: { product_type: productType, need_invalid: true },
    queryOptions: { enabled: !!keyword, notifyOnChangeProps: ['data'] },
    staleTime: 5000,
    onSuccess: data => {
      setTraderList(data.trader_list || []);
    }
  });

  const traderOptions: SearchOption<Trader>[] = useMemo(
    () => traders2options((keyword ? traderList : []).filter(Boolean)),
    [keyword, traderList]
  );

  return { traderList, traderOptions };
};
