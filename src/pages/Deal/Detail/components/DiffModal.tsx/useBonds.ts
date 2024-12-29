import { useQuery } from '@tanstack/react-query';
import { fetchBondListFromLocalDB } from '@/pages/Algo/MarketTrack/util';

export const useBonds = (keyMarketList: string[]) => {
  const query = useQuery({
    queryKey: [keyMarketList] as const,
    queryFn: async () => {
      const result = await fetchBondListFromLocalDB(keyMarketList);
      return result;
    },
    staleTime: 0,
    cacheTime: 0
  });
  return query;
};
