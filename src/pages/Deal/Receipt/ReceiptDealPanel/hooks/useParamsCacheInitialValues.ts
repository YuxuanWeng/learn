import { useState } from 'react';
import moment from 'moment';
import { getInitTableColumnsSettings } from '@/common/constants/table';
import { usePrevWorkingDate } from '@/common/services/hooks/usePrevWorkingDate';
import { useProductParams } from '@/layouts/Home/hooks';
import {
  getTableSettingsAtom,
  receiptDealTableDealInputFilterValueAtom,
  receiptDealTableDealRelatedFilterValueAtom,
  receiptDealTableSorterAtom
} from '@/pages/Deal/Receipt/ReceiptDealPanel/atoms/table';
import {
  DEFAULT_RECEIPT_DEAL_INPUT_FILTER_VALUE,
  DEFAULT_RECEIPT_DEAL_RELATED_FILTER_VALUE
} from '@/pages/Deal/Receipt/ReceiptDealPanel/constants/filter';
import { getDefaultReceiptDealTableColumnSettings } from '@/pages/Deal/Receipt/ReceiptDealPanel/constants/table';
import { useReceiptDealPanelLoader } from '@/pages/Deal/Receipt/ReceiptDealPanel/providers/ReceiptDealPanelProvider/preload';
import { globalSearchValueAtom } from '@/pages/ProductPanel/atoms/global-search';

export const useParamsCacheInitialValues = () => {
  const { productType } = useProductParams();
  const { panelCache, internalCode } = useReceiptDealPanelLoader();
  const [prev5WorkingDate] = usePrevWorkingDate(5);

  const [jotaiInitialValues] = useState(() => {
    const { columnSettings: cacheColumnSettings } = panelCache ?? {};

    // 使用代码中默认设置map提取缓存中的设置，避免代码硬新增、减少列时，直接使用缓存导致的错误
    const columnSettings = getInitTableColumnsSettings(
      getDefaultReceiptDealTableColumnSettings(productType),
      cacheColumnSettings
    );

    return [
      [globalSearchValueAtom, void 0],
      [getTableSettingsAtom(productType), columnSettings],
      // 初始化内码搜索
      [
        receiptDealTableDealRelatedFilterValueAtom,
        internalCode
          ? DEFAULT_RECEIPT_DEAL_RELATED_FILTER_VALUE
          : {
              ...DEFAULT_RECEIPT_DEAL_RELATED_FILTER_VALUE,
              date_range: {
                start_time: prev5WorkingDate.valueOf().toString(),
                end_time: moment().endOf('day').valueOf().toString()
              }
            }
      ],
      // 初始化内码搜索
      [
        receiptDealTableDealInputFilterValueAtom,
        internalCode
          ? { ...DEFAULT_RECEIPT_DEAL_INPUT_FILTER_VALUE, internal_code: internalCode }
          : DEFAULT_RECEIPT_DEAL_INPUT_FILTER_VALUE
      ],
      [receiptDealTableSorterAtom, void 0]
    ] as const;
  });

  return [jotaiInitialValues];
};
