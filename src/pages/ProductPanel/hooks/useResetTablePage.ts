import { useMemoizedFn } from 'ahooks';
import { useResetAtom } from 'jotai/utils';
import {
  basicTablePageAtom,
  bondTablePageAtom,
  dealTablePageAtom,
  optimalTablePageAtom,
  referredTablePageAtom
} from '@/pages/ProductPanel/atoms/table';

export const useResetTablePage = () => {
  const resetBasicTablePage = useResetAtom(basicTablePageAtom);
  const resetOptimalTablePage = useResetAtom(optimalTablePageAtom);
  const resetDealTablePage = useResetAtom(dealTablePageAtom);
  const resetBondTablePage = useResetAtom(bondTablePageAtom);
  const resetReferredTablePage = useResetAtom(referredTablePageAtom);

  const reset = useMemoizedFn(() => {
    resetBasicTablePage();
    resetOptimalTablePage();
    resetDealTablePage();
    resetBondTablePage();
    resetReferredTablePage();
  });

  return reset;
};
