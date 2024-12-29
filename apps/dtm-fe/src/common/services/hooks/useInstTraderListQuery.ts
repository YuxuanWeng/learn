import { createQuery } from 'react-query-kit';
import { fetchInstTraderList } from '@fepkg/services/api/inst/trader-list';
import { APIs } from '@fepkg/services/apis';
import type { InstTraderList } from '@fepkg/services/types/inst/trader-list';

const defaultSearchParams = {
  offset: 0,
  count: 20
};

export const useInstTraderListQuery = createQuery<InstTraderList.Response, InstTraderList.Request>({
  primaryKey: APIs.inst.traderList,
  queryFn: async ({ signal, queryKey: [, vars] }) => {
    const searchParams = { ...defaultSearchParams, ...vars };
    return fetchInstTraderList(searchParams, { signal });
  },
  enabled: (_, vars) => !!vars?.inst_id,
  staleTime: 30 * 1000
});
