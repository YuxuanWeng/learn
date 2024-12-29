import { useState } from 'react';
import { SearchOption } from '@fepkg/components/Search';
import { Trader } from '@fepkg/services/types/common';
import { createContainer } from 'unstated-next';
import { useTraderFuzzySearchData } from '../queries/useTraderFuzzySearchData';

/** 交易员模糊搜索上下文 */
const TraderFuzzySearchContainer = createContainer(() => {
  const [keyword, setKeyword] = useState<string>('');
  const [selectedTrader, setSelectedTrader] = useState<SearchOption<Trader> | null>();
  const config = useTraderFuzzySearchData(keyword);

  return {
    ...config,
    keyword,
    selectedTrader,
    setSelectedTrader,
    setKeyword
  };
});

export const TraderFuzzySearchProvider = TraderFuzzySearchContainer.Provider;
export const useTraderFuzzySearch = TraderFuzzySearchContainer.useContainer;
