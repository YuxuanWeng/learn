import { APIs } from '@fepkg/services/apis';
import { useQuery } from '@tanstack/react-query';
import { fetchTraderConfigList } from '@/common/services/api/algo/quick-chat-api/get-trader-config-list';
import { useProductParams } from '@/layouts/Home/hooks';
import { BdsProductTypeMap } from '../constants';

export const useTraderConfigListData = (visible: boolean, traderID?: string) => {
  const { productType } = useProductParams();

  const query = useQuery({
    queryKey: [APIs.algo.getTraderConfigList, traderID, visible, productType] as const,
    queryFn: async ({ signal }) => {
      const response_trader_config = await fetchTraderConfigList(
        { trader_id: traderID, product_type: BdsProductTypeMap[productType] },
        { signal }
      );
      return response_trader_config.trader_config_list;
    },
    enabled: visible,
    refetchOnWindowFocus: false
  });

  return query;
};
