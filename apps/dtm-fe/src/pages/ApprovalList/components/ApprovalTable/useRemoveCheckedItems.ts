import { useEffect } from 'react';
import { useAtom } from 'jotai';
import { approvalListTableSelectIdsAtom } from '../../atoms';
import { useApprovalTable } from '../../providers/TableProvider';
import { isBridgeParentData } from './utils';

// 翻页、筛选参数变化后取消勾选
export const useRemoveCheckedItems = () => {
  const { data } = useApprovalTable();
  const [approvalListTableSelectIds, setApprovalListTableSelectIds] = useAtom(approvalListTableSelectIdsAtom);

  // 去除非本页的选中下载行
  useEffect(() => {
    if (!data?.list?.length || !approvalListTableSelectIds.length) {
      return;
    }
    const set = new Set(approvalListTableSelectIds);
    for (const row of data.list) {
      set.delete(row.id);
      if (isBridgeParentData(row)) {
        if (row.children) {
          for (const child of row.children) {
            set.delete(child.id);
          }
        }
      }
    }
    if (set.size !== 0) {
      setApprovalListTableSelectIds(list => list.filter(id => !set.has(id)));
    }
  }, [approvalListTableSelectIds, data?.list, setApprovalListTableSelectIds]);
};
