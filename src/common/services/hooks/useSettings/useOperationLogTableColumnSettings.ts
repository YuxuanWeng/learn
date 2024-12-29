import { useLocalStorage } from '@fepkg/business/hooks/useLocalStorage';
import { LSKeys, getLSKey } from '@/common/constants/ls-keys';
import { NCDP_OPERATION_LOG_TABLE_COLUMN, OPERATION_LOG_TABLE_COLUMN } from '@/common/constants/table';
import { useProductParams } from '@/layouts/Home/hooks';
import { ProductType } from '@fepkg/services/types/bdm-enum';

export const useOperationLogColumnSettings = () => {
  const { productType } = useProductParams();
  const [columnSettings, setColumnSettings] = useLocalStorage(
    getLSKey(LSKeys.QuoteOperationLogColumnSettings, productType),
    productType === ProductType.NCDP ? NCDP_OPERATION_LOG_TABLE_COLUMN : OPERATION_LOG_TABLE_COLUMN
  );
  return { columnSettings, setColumnSettings };
};
