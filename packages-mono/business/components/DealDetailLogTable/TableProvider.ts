import { useState } from 'react';
import { ProductType } from '@fepkg/services/types/enum';
import { createContainer } from 'unstated-next';
import { RECEIPT_DEAL_LOG_TABLE_MAX_SIZE } from '../ReceiptDealLogTable/constants';
import { useDealDetailLogQuery } from './useDealDetailLogQuery';
import { transform2DealLogTableRowData } from './utils';

type InitialState = {
  /** 成交单 Id */
  dealId: string;
  /** 产品类型 */
  productType: ProductType;
};
/** @ts-ignore */
export const DealDetailLogTableContainer = createContainer((initialState: InitialState) => {
  const { dealId, productType } = initialState;
  const [page, setPage] = useState(1);
  const { data, prefetch } = useDealDetailLogQuery(dealId, page);

  // 仅展示 10 页记录
  let total = data?.total ?? 0;
  if (total > RECEIPT_DEAL_LOG_TABLE_MAX_SIZE) total = RECEIPT_DEAL_LOG_TABLE_MAX_SIZE;

  return {
    list: data?.list?.map(d => transform2DealLogTableRowData(productType, d)) ?? [],
    total,
    page,
    setPage,
    prefetch
  };
});

export const DealDetailLogTableProvider = DealDetailLogTableContainer.Provider;
export const useDealDetailLogTable = DealDetailLogTableContainer.useContainer;
