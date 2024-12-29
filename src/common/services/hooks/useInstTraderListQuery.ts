import { createQuery } from 'react-query-kit';
import { fetchInstTraderList } from '@fepkg/services/api/inst/trader-list';
import { APIs } from '@fepkg/services/apis';
import type { LocalInstTraderList } from '@fepkg/services/types/data-localization-manual/inst/trader-list';
import type { InstTraderList } from '@fepkg/services/types/inst/trader-list';
import { isUseLocalServer } from '@/common/ab-rules';
import { localFuzzySearch } from '@/common/request/local-fuzzy-search';

const defaultSearchParams = {
  offset: 0,
  count: 20
};

export const useInstTraderListQuery = createQuery<InstTraderList.Response, InstTraderList.Request>({
  primaryKey: APIs.inst.traderList,
  queryFn: async ({ signal, queryKey: [, vars] }) => {
    const searchParams = { ...defaultSearchParams, ...vars };

    let result: LocalInstTraderList.Response;
    try {
      // 前端本地化与local server AB
      if (isUseLocalServer()) {
        result = await fetchInstTraderList(searchParams, {
          signal,
          isLocalServerRequest: true,
          hideErrorMessage: true
        });
      } else {
        result = await localFuzzySearch<LocalInstTraderList.Request, LocalInstTraderList.Response>(
          APIs.inst.traderList,
          searchParams
        );
      }

      return result;
    } catch (err) {
      const res = await fetchInstTraderList(searchParams, { signal });
      return res;
    }
  },
  enabled: (_, vars) => !!vars?.inst_id,
  staleTime: 5 * 1000
});
