import { MARKET_LOG_TABLE_COLUMN } from '@/common/constants/table';
import { useProductParams } from '@/layouts/Home/hooks/useProductParams';
import { useLocalStorage } from '@fepkg/business/hooks/useLocalStorage';
import { LSKeys, getLSKey } from '@/common/constants/ls-keys';

export const useDealLogColumnSettings = () => {
  const { productType } = useProductParams();
  const [columnSettings, setColumnSettings] = useLocalStorage(
    getLSKey(LSKeys.MarketLogColumnSettings, productType),
    MARKET_LOG_TABLE_COLUMN
  );
  return { columnSettings, setColumnSettings };
};
