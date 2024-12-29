import { APIs } from '@fepkg/services/apis';
import { ProductType } from '@fepkg/services/types/bdm-enum';
import { BridgeInstInfo } from '@fepkg/services/types/common';
import { useQuery } from '@tanstack/react-query';
import { fuzzySearchBridgeInst } from '@/common/services/api/bridge/inst-search';
import { refetchInterval, staleTime } from '@/pages/Quote/BondDetail/utils';
import { useProductParams } from '@/layouts/Home/hooks';

/**
 * 过桥机构列表
 * 使用旧的“获取过桥机构下的成交单”接口，但只使用其获取机构的能力
 */
export const useBridgeInstList = (enabled = true, needCount = true) => {
  const { productType } = useProductParams();
  const queryKey = [APIs.bridge.instSearch, needCount] as [string, boolean];
  const query = useQuery<BridgeInstInfo[], unknown>({
    queryKey,
    queryFn: async ({ signal }) => {
      const res = await fuzzySearchBridgeInst(
        {
          product_type: productType,
          need_receipt_deal_count: needCount,
          offset: 0,
          count: 200
        },
        { signal }
      );
      return res.bridge_inst_list ?? [];
    },
    enabled,
    staleTime,
    refetchInterval,
    refetchOnWindowFocus: false,
    refetchOnReconnect: 'always',
    keepPreviousData: true
  });

  /** 所有桥数据 */
  const bridgeList = query?.data ?? [];

  return { bridgeList, ...query };
};
