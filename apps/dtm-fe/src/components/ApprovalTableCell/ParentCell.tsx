import { Checkbox } from '@fepkg/components/Checkbox';
import { isExpandParentNode } from '@fepkg/components/Table/utils';
import { IconOrgMark, IconRightArrow } from '@fepkg/icon-park-react';
import { Row } from '@tanstack/react-table';
import { useAtom } from 'jotai';
import { approvalListTableSelectIdsAtom } from '@/pages/ApprovalList/atoms';
import { isBridgeParentData } from '@/pages/ApprovalList/components/ApprovalTable/utils';
import { useApprovalTable } from '@/pages/ApprovalList/providers/TableProvider';
import { ApprovalListType, ApprovalTableRowData } from '@/pages/ApprovalList/types';

type ParentCellProp = {
  row: Row<ApprovalTableRowData>;
};
export const ParentCell = ({ row }: ParentCellProp) => {
  const { accessCache, type } = useApprovalTable();
  const [approvalListTableSelectIds, setApprovalListTableSelectIds] = useAtom(approvalListTableSelectIdsAtom);

  // parent行
  if (isExpandParentNode(row)) {
    const { cpBidContent, cpOfrContent } = row.original;
    return (
      <div
        className="ml-2 flex-1 flex gap-3 flex-nowrap items-center"
        onClick={row.getToggleExpandedHandler()}
      >
        <IconOrgMark className="text-orange-100" />
        <span className="text-gray-000">{cpOfrContent}</span>
        <IconRightArrow className="text-gray-300" />
        <span className="text-gray-000"> {cpBidContent}</span>
      </div>
    );
  }
  // child选择框列
  if (type !== ApprovalListType.Approval && !isBridgeParentData(row.original)) {
    // 如果没有导出权限，不展示 checkbox
    if (
      (type === ApprovalListType.History && !accessCache?.historyPrint) ||
      (type === ApprovalListType.Deal && !accessCache?.dealPrint)
    )
      return null;

    const dealId = row.original.original.receipt_deal_id;

    return (
      <Checkbox
        checked={approvalListTableSelectIds.includes(dealId)}
        onChange={val => {
          if (val) {
            setApprovalListTableSelectIds(list => [...list, dealId]);
            return;
          }
          setApprovalListTableSelectIds(list => list.filter(id => id !== dealId));
        }}
      />
    );
  }

  return null;
};
