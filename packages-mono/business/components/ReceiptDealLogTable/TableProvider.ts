import { useState } from 'react';
import { useReceiptDealLogQuery } from '@fepkg/business/components/ReceiptDealLogTable/useReceiptDealLogQuery';
import { OperationSource } from '@fepkg/services/types/enum';
import { createContainer } from 'unstated-next';
import { RECEIPT_DEAL_LOG_TABLE_MAX_SIZE } from './constants';

type InitialState = {
  /** 成交单 Id */
  dealId: string;
  /** 操作日志来源 */
  source: OperationSource;
};

/** @ts-ignore */
export const ReceiptDealLogTableContainer = createContainer((initialState: InitialState) => {
  const { dealId, source } = initialState;

  const [page, setPage] = useState(1);
  const { data, prefetch } = useReceiptDealLogQuery(dealId, source, page);

  // 仅展示 10 页记录
  let total = data?.total ?? 0;
  if (total > RECEIPT_DEAL_LOG_TABLE_MAX_SIZE) total = RECEIPT_DEAL_LOG_TABLE_MAX_SIZE;

  return { list: data?.list ?? [], total, page, setPage, prefetch };
});

export const ReceiptDealLogTableProvider = ReceiptDealLogTableContainer.Provider;
export const useReceiptDealLogTable = ReceiptDealLogTableContainer.useContainer;
