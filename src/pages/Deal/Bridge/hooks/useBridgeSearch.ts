import { useMemo, useState } from 'react';
import { CP_NONE, getCP } from '@fepkg/business/utils/get-name';
import { BridgeInstInfo } from '@fepkg/services/types/common';
import { ProductType } from '@fepkg/services/types/enum';
import { useInstBridgeQuery } from '@/common/services/hooks/useInstBridgeQuery';
import { useProductParams } from '@/layouts/Home/hooks';

type Props = {
  invalidBridgeIdList?: string[]; // 要排除展示的内容
  disabledWhenEmpty?: boolean;
};

export const getBridgeKey = (bridge?: BridgeInstInfo) => {
  return `key-${bridge?.bridge_inst_id}${bridge?.contact_trader?.trader_id}`;
};

export type BridgeOption = {
  label: string;
  key: string;
  value: string;
  original: BridgeInstInfo;
  disabled: boolean;
};

const bridge2option = (productType: ProductType, bridge: BridgeInstInfo): BridgeOption => {
  const { contact_inst, contact_trader } = bridge;
  const label = getCP({ inst: contact_inst, productType, trader: contact_trader, placeholder: CP_NONE });
  return {
    label,
    key: getBridgeKey(bridge),
    value: bridge.bridge_inst_id,
    original: bridge,
    disabled: false
  };
};

export default function useBridgeSearch({ invalidBridgeIdList, disabledWhenEmpty }: Props) {
  const [kwd, setKwd] = useState('');
  const { productType } = useProductParams();

  const { data, refetch } = useInstBridgeQuery(
    {
      keyword: kwd || undefined,
      product_type: productType
    },
    disabledWhenEmpty
  );

  const options = useMemo(() => {
    let list = data?.bridge_inst_list ?? [];
    list = list.filter(item => !invalidBridgeIdList?.includes(item?.contact_inst?.inst_id || ''));
    return list.map(d => bridge2option(productType, d));
  }, [data?.bridge_inst_list, invalidBridgeIdList]);

  return { kwd, setKwd, options, data, refetch };
}
