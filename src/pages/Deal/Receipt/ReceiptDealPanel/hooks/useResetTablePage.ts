import { useMemoizedFn } from 'ahooks';
import { useResetAtom } from 'jotai/utils';
import { receiptDealTablePageAtom } from '@/pages/Deal/Receipt/ReceiptDealPanel/atoms/table';

export const useResetTablePage = () => {
  const resetPage = useResetAtom(receiptDealTablePageAtom);

  const reset = useMemoizedFn(() => {
    resetPage();
  });

  return reset;
};
