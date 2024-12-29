import { useLocalStorage } from '@fepkg/business/hooks/useLocalStorage';
import { LSKeys, getLSKeyWithoutProductType } from '@/common/constants/ls-keys';

export const useAlwaysOpen = () => {
  return useLocalStorage(getLSKeyWithoutProductType(LSKeys.NCDPBatchFormAlwaysOpen), false);
};
