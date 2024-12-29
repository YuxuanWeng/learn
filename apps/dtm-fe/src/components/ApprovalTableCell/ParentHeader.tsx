import { useMemo } from 'react';
import { Checkbox } from '@fepkg/components/Checkbox';
import { useAtom } from 'jotai';
import { approvalListTableSelectIdsAtom } from '@/pages/ApprovalList/atoms';
import { useApprovalTable } from '@/pages/ApprovalList/providers/TableProvider';
import { ApprovalListType } from '@/pages/ApprovalList/types';

export const ParentHeader = () => {
  const { accessCache, receiptDealCache, type } = useApprovalTable();
  const [approvalListTableSelectIds, setApprovalListTableSelectIds] = useAtom(approvalListTableSelectIdsAtom);

  const checkStatus = useMemo(() => {
    if (!accessCache?.historyPrint) return { checked: false, indeterminate: false };

    const checked =
      receiptDealCache.ids.length > 0 && receiptDealCache.ids.every(id => approvalListTableSelectIds.includes(id));
    return {
      checked,
      indeterminate: !checked && receiptDealCache.ids.some(id => approvalListTableSelectIds.includes(id))
    };
  }, [accessCache?.historyPrint, approvalListTableSelectIds, receiptDealCache.ids]);

  // 如果没有导出权限，不展示 checkbox
  if (
    (type === ApprovalListType.History && !accessCache?.historyPrint) ||
    (type === ApprovalListType.Deal && !accessCache?.dealPrint)
  )
    return null;

  return (
    <Checkbox
      checked={checkStatus.checked}
      indeterminate={checkStatus.indeterminate}
      onChange={val => {
        if (val) {
          setApprovalListTableSelectIds(receiptDealCache.ids);
        } else {
          setApprovalListTableSelectIds([]);
        }
      }}
    />
  );
};
