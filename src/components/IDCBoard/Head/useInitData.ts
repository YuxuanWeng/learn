import { transform2BondOpt } from '@fepkg/business/components/Search/BondSearch';
import { SearchOption } from '@fepkg/components/Search';
import { APIs } from '@fepkg/services/apis';
import { FiccBondBasic } from '@fepkg/services/types/common';
import { FiccBondInfoLevel, FiccBondInfoLevelV2, ProductType } from '@fepkg/services/types/enum';
import { useQuery } from '@tanstack/react-query';
import { fetchBondByKeyMarket } from '@/common/services/api/base-data/key-market-get';
import { isBondExpire } from '../utils';

interface IProps {
  initKeyMarket?: string;
  onSuccess?: (options?: SearchOption<FiccBondBasic>[]) => void;
}

export default function useInitData({ initKeyMarket, onSuccess }: IProps) {
  const { refetch: refetchInit } = useQuery({
    queryKey: [APIs.baseData.keyMarketGet, initKeyMarket, FiccBondInfoLevel.BasicInfo] as const,
    queryFn: async ({ signal }) => {
      // 为了处理冲突逻辑，当keyMarket被清空时，触发onSuccess，在回调中清理掉被顶掉的债券，因此这样设计
      if (!initKeyMarket) {
        onSuccess?.(undefined);
        return undefined;
      }
      const data = await fetchBondByKeyMarket(
        {
          key_market_list: [initKeyMarket],
          info_level: FiccBondInfoLevelV2.InfoLevelBasic,
          with_related_info: false
        },
        { signal }
      );
      return data;
    },
    onSuccess: data => {
      const res = data?.bond_basic_list ?? [];
      const returnData = res
        .filter(item => item.product_type === ProductType.BNC)
        .filter(item => !isBondExpire(item))
        .map(transform2BondOpt)
        .filter(Boolean);
      onSuccess?.(returnData);
    }
  });

  return { refetchInit };
}
