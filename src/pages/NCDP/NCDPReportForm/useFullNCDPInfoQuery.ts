import { APIs } from '@fepkg/services/apis';
import { useQuery } from '@tanstack/react-query';
import { useAtomValue } from 'jotai';
import { fetchNCDPInfo } from '@/common/services/api/bond-quote/ncdp-search';
import { openTimeAtom } from './atom';
import { DEFAULT_PARAMS } from './constants';

export const useFullNCDPInfoQuery = () => {
  const openTime = useAtomValue(openTimeAtom);
  const queryKey = [APIs.bondQuote.ncdp.search, openTime];

  const query = useQuery({
    queryKey,
    queryFn: async ({ signal }) => {
      const res = await fetchNCDPInfo({
        params: DEFAULT_PARAMS,
        paramsChanged: false,
        requestConfig: { signal }
      });
      return res;
    }
  });

  return { ...query };
};
