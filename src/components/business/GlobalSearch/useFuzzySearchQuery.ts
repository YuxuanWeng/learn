import { SearchOption } from '@fepkg/components/Search';
import { APIs } from '@fepkg/services/apis';
import type { BaseDataSearch } from '@fepkg/services/types/base-data/search';
import { FuzzySearchType, ProductType } from '@fepkg/services/types/enum';
import { QueryFunction, useQuery } from '@tanstack/react-query';
import { uniqBy } from 'lodash-es';
import { isUseLocalServer } from '@/common/ab-rules';
import { fuzzyFetch } from '@/common/services/api/fuzzy-search';
import { fetchLocalServerFuzzySearch } from '@/common/services/api/local-server/fuzzy-search';
import { logDataError } from '@/common/utils/logger/data';
import { GlobalSearchOption, GlobalSearchOptionType } from '@/components/business/GlobalSearch/types';
import { flagRegex, getOptions, spiltRegex } from '@/components/business/GlobalSearch/utils';
import { useSearchProps } from './SearchPropsProvider';

type QueryFnResult = {
  [key in
    | 'options'
    | 'bondOptions'
    | 'instOptions'
    | 'traderOptions'
    | 'userOptions']: SearchOption<GlobalSearchOption>[];
};

const queryFn: QueryFunction<
  QueryFnResult,
  readonly [string, ProductType, FuzzySearchType, string, boolean, boolean | undefined, boolean | undefined]
> = async ({ signal, queryKey }) => {
  const [, productType, searchType, keyword, needInvalid, bondUnlimited, onlyRemote] = queryKey;

  const searchParams = {
    keyword,
    product_type: productType,
    search_type: searchType,
    need_invalid: needInvalid,
    bond_unlimited: bondUnlimited
  };

  let res: BaseDataSearch.Response;
  // 本地化未适配已下市债券，因此只能在localserver与远端切换
  if (onlyRemote || !isUseLocalServer()) {
    res = await fuzzyFetch(searchParams, { signal });
  } else {
    try {
      res = await fetchLocalServerFuzzySearch(searchParams);
    } catch (err) {
      res = await fuzzyFetch(searchParams, { signal });
    }
  }

  const { bond_info_list = [], inst_list = [], trader_list = [], user_list = [], base_response } = res;
  const traceId = base_response?.trace_id ?? '';

  const options: SearchOption<GlobalSearchOption>[] = [];

  const bondInfos = uniqBy(bond_info_list, 'code_market');
  const instList = uniqBy(inst_list, 'inst_id');
  const traders = uniqBy(trader_list, 'trader_id');
  const users = uniqBy(user_list, 'account');

  const bondOptions = getOptions(
    GlobalSearchOptionType.BOND,
    bondInfos,
    'bond_code',
    'code_market',
    inst_list.length + trader_list.length + user_list.length
  );
  const instOptions = getOptions(
    GlobalSearchOptionType.INST,
    instList,
    'short_name_zh',
    'inst_id',
    trader_list.length + user_list.length
  );
  const traderOptions = getOptions(GlobalSearchOptionType.TRADER, traders, 'name_zh', 'trader_id', user_list.length);
  const userOptions = getOptions(GlobalSearchOptionType.BROKER, users, 'name_cn', 'account');

  if (
    bondInfos.length !== bond_info_list.length ||
    instList.length !== inst_list.length ||
    traders.length !== trader_list.length ||
    users.length !== user_list.length
  ) {
    logDataError({ api: APIs.baseData.search, logName: 'data-duplication', traceId });
  }

  return {
    options: options.concat(bondOptions, instOptions, traderOptions, userOptions),
    bondOptions,
    instOptions,
    traderOptions,
    userOptions
  };
};

export const useFuzzySearchQuery = (inputValue: string) => {
  const { productType, searchType, needInvalid = false, bondUnlimited, onlyRemote } = useSearchProps();

  const enabled =
    !flagRegex.test(inputValue) && (!spiltRegex.test(inputValue) || inputValue.length < 25) && Boolean(inputValue);

  return useQuery({
    queryKey: [
      APIs.baseData.search,
      productType,
      searchType,
      inputValue,
      needInvalid,
      bondUnlimited,
      onlyRemote
    ] as const,
    queryFn,
    enabled,
    staleTime: 5 * 1000,
    notifyOnChangeProps: ['data', 'isLoading']
  });
};
