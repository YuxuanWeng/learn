import { useState } from 'react';
import { ProductType } from '@fepkg/services/types/bdm-enum';
import {
  DEFAULT_MARKET_DEAL_FILTER_VALUE,
  DEFAULT_QUOTE_FILTER_VALUE,
  DEFAULT_REFERRED_QUOTE_FILTER_VALUE
} from '@/common/constants/filter';
import { getDefaultQuoteTableColumnSettings, getInitTableColumnsSettings } from '@/common/constants/table';
import { useProductParams } from '@/layouts/Home/hooks';
import { globalSearchValueAtom } from '../atoms/global-search';
import {
  basicTableQuoteFilterValueAtom,
  basicTableSorterAtom,
  bondTableQuoteFilterValueAtom,
  bondTableSorterAtom,
  dealTableQuoteFilterValueAtom,
  dealTableSorterAtom,
  getTableSettingsAtom,
  optimalTableQuoteFilterValueAtom,
  optimalTableSorterAtom,
  referredTableQuoteFilterValueAtom,
  referredTableSorterAtom
} from '../atoms/table';
import { useProductPanelLoader } from '../providers/MainGroupProvider/preload';
import { ProductPanelTableKey } from '../types';

export const useParamsCacheInitialValues = () => {
  const { productType } = useProductParams();
  const { activeGroupTableCache } = useProductPanelLoader();

  const [jotaiInitialValues] = useState(() => {
    const { searchParamsCache, tableParamsCache } = activeGroupTableCache ?? {};

    const basicTableParamsCache = tableParamsCache?.get(ProductPanelTableKey.Basic);
    const optimalTableParamsCache = tableParamsCache?.get(ProductPanelTableKey.Optimal);
    const bondTableParamsCache = tableParamsCache?.get(ProductPanelTableKey.Bond);
    const dealTableParamsCache = tableParamsCache?.get(ProductPanelTableKey.Deal);
    const referredTableParamsCache = tableParamsCache?.get(ProductPanelTableKey.Referred);

    // 使用代码中默认设置map提取缓存中的设置，避免代码硬新增、减少列时，直接使用缓存导致的错误
    // NCDP 无缓存
    const basicTableColumnSettings = getInitTableColumnsSettings(
      getDefaultQuoteTableColumnSettings(productType, ProductPanelTableKey.Basic),
      productType !== ProductType.NCDP ? basicTableParamsCache?.columnSettings : void 0
    );

    const optimalTableColumnSettings = getInitTableColumnsSettings(
      getDefaultQuoteTableColumnSettings(productType, ProductPanelTableKey.Optimal),
      optimalTableParamsCache?.columnSettings
    );

    const bondTableColumnSettings = getInitTableColumnsSettings(
      getDefaultQuoteTableColumnSettings(productType, ProductPanelTableKey.Bond),
      bondTableParamsCache?.columnSettings
    );

    const dealTableColumnSettings = getInitTableColumnsSettings(
      getDefaultQuoteTableColumnSettings(productType, ProductPanelTableKey.Deal),
      dealTableParamsCache?.columnSettings
    );

    // NCDP 无缓存
    const referredTableColumnSettings = getInitTableColumnsSettings(
      getDefaultQuoteTableColumnSettings(productType, ProductPanelTableKey.Referred),
      productType !== ProductType.NCDP ? referredTableParamsCache?.columnSettings : void 0
    );

    return [
      [globalSearchValueAtom, searchParamsCache?.inputFilter],

      [getTableSettingsAtom(productType, ProductPanelTableKey.Basic), basicTableColumnSettings],
      [getTableSettingsAtom(productType, ProductPanelTableKey.Optimal), optimalTableColumnSettings],
      [getTableSettingsAtom(productType, ProductPanelTableKey.Bond), bondTableColumnSettings],
      [getTableSettingsAtom(productType, ProductPanelTableKey.Deal), dealTableColumnSettings],
      [getTableSettingsAtom(productType, ProductPanelTableKey.Referred), referredTableColumnSettings],

      [basicTableQuoteFilterValueAtom, basicTableParamsCache?.quoteFilterValue ?? DEFAULT_QUOTE_FILTER_VALUE],
      [optimalTableQuoteFilterValueAtom, optimalTableParamsCache?.quoteFilterValue ?? DEFAULT_QUOTE_FILTER_VALUE],
      [bondTableQuoteFilterValueAtom, bondTableParamsCache?.quoteFilterValue ?? DEFAULT_QUOTE_FILTER_VALUE],
      [dealTableQuoteFilterValueAtom, dealTableParamsCache?.quoteFilterValue ?? DEFAULT_MARKET_DEAL_FILTER_VALUE],
      [
        referredTableQuoteFilterValueAtom,
        referredTableParamsCache?.quoteFilterValue ?? DEFAULT_REFERRED_QUOTE_FILTER_VALUE
      ],

      [basicTableSorterAtom, basicTableParamsCache?.tableSorter],
      [optimalTableSorterAtom, optimalTableParamsCache?.tableSorter],
      [bondTableSorterAtom, bondTableParamsCache?.tableSorter],
      [dealTableSorterAtom, dealTableParamsCache?.tableSorter],
      [referredTableSorterAtom, referredTableParamsCache?.tableSorter]
    ] as const;
  });

  return [jotaiInitialValues];
};
