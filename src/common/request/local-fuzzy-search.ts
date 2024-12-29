import { APIs } from '@fepkg/services/apis';
import type { LocalBondSearch } from '@fepkg/services/types/data-localization-manual/bond/search';
import type { LocalFuzzySearch } from '@fepkg/services/types/data-localization-manual/fuzzy-search';
import type { LocalInstSearch } from '@fepkg/services/types/data-localization-manual/inst/search';
import type { LocalInstTraderList } from '@fepkg/services/types/data-localization-manual/inst/trader-list';
import type { LocalTraderSearch } from '@fepkg/services/types/data-localization-manual/trader/search';
import type { LocalUserSearch } from '@fepkg/services/types/data-localization-manual/user/search';
import { fetchLocalBond } from '../services/api/data-localization-manual/bond/search';
import { fetchLocalFuzzySearch } from '../services/api/data-localization-manual/fuzzy-search';
import { fetchLocalInst } from '../services/api/data-localization-manual/inst/search';
import { fetchLocalInstTraderList } from '../services/api/data-localization-manual/inst/trader-list';
import { fetchLocalTrader } from '../services/api/data-localization-manual/trader/search';
import { fetchLocalUser } from '../services/api/data-localization-manual/user/search';

export const LocalizedAPIs = [
  APIs.trader.search,
  APIs.inst.fuzzySearch,
  APIs.user.list,
  APIs.baseData.bondSearch,
  APIs.inst.traderList,
  APIs.baseData.search
];

// 服务端提供识别能力的接口列表
export const hasSearchAbilityAPIs = [APIs.baseData.bondSearch];

/** 前端本地化模糊查询 */
export const localFuzzySearch = async <Request, Response>(api: string, value: Request) => {
  switch (api) {
    case APIs.trader.search:
      return (await fetchLocalTrader(value as LocalTraderSearch.Request)) as Response;
    case APIs.inst.fuzzySearch:
      return (await fetchLocalInst(value as LocalInstSearch.Request)) as Response;
    case APIs.user.list:
      return (await fetchLocalUser(value as LocalUserSearch.Request)) as Response;
    case APIs.baseData.bondSearch:
      return (await fetchLocalBond(value as LocalBondSearch.Request)) as Response;
    case APIs.inst.traderList:
      return (await fetchLocalInstTraderList(value as LocalInstTraderList.Request)) as Response;
    case APIs.baseData.search:
      return (await fetchLocalFuzzySearch(value as LocalFuzzySearch.Request)) as Response;
    default:
      throw new Error(`${api} can't use localRequest`);
  }
};
