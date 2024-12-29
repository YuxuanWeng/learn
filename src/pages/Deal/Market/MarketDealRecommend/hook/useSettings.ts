import { useLocalStorage } from '@fepkg/business/hooks/useLocalStorage';
import { ProductType } from '@fepkg/services/types/enum';
import { LSKeys, getLSKey } from '@/common/constants/ls-keys';
import { DefaultIsMyValue, DefaultIsTop, DefaultPageSizeValue } from '../constants';

export const useSettings = (productType: ProductType) => {
  const [pageSize, setPageSize] = useLocalStorage(
    getLSKey(LSKeys.MarketDealRecommendPageSize, productType),
    DefaultPageSizeValue
  );

  const [isMy, setIsMy] = useLocalStorage(getLSKey(LSKeys.MarketDealRecommendIsMy, productType), DefaultIsMyValue);

  const [isTop, setIsTop] = useLocalStorage(getLSKey(LSKeys.MarketDealRecommendIsTop, productType), DefaultIsTop);

  return {
    pageSize,
    setPageSize,
    isMy,
    setIsMy,
    isTop,
    setIsTop
  };
};
