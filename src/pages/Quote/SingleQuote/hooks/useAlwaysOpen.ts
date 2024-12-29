import { useLocalStorage } from '@fepkg/business/hooks/useLocalStorage';
import { LSKeys, getLSKey } from '@/common/constants/ls-keys';
import { useProductParams } from '@/layouts/Home/hooks';

export const useAlwaysOpen = () => {
  const { productType } = useProductParams();
  return useLocalStorage(getLSKey(LSKeys.SingleQuoteAlwaysOpen, productType), false);
};
