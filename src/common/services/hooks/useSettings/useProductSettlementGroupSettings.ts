import { useLocalStorage } from '@fepkg/business/hooks/useLocalStorage';
import { ProductType } from '@fepkg/services/types/enum';
import { LSKeys, getLSKey } from '@/common/constants/ls-keys';
import { DEFAULT_SETTLEMENT_GROUP_VALUE } from '@/components/SettlementModal';

export const useProductSettlementGroupSettings = (productType: ProductType) => {
  const key = getLSKey(LSKeys.SettlementFilter, productType);
  const [value, _setValue] = useLocalStorage(key, DEFAULT_SETTLEMENT_GROUP_VALUE);
  return { settlementGroupSettings: value, updateSettlementGroupSettings: _setValue };
};
