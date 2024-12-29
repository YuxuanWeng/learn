import { Button } from '@fepkg/components/Button';
import { isExpandParentNode } from '@fepkg/components/Table/utils';
import { IconOrgMark, IconRightArrow, IconRightSmall } from '@fepkg/icon-park-react';
import { Row } from '@tanstack/react-table';
import { ReceiptDealRowData } from '@/pages/Deal/Receipt/ReceiptDealPanel/components/ReceiptDealTable/types';

type ParentCellProp = {
  row: Row<ReceiptDealRowData>;
};
export const ParentCell = ({ row }: ParentCellProp) => {
  // parent行
  if (isExpandParentNode(row)) {
    const { cpBidContent, cpOfrContent } = row.original;
    return (
      <div
        className="ml-3 h-8 flex-1 flex gap-3 flex-nowrap items-center whitespace-nowrap"
        onClick={row.getToggleExpandedHandler()}
      >
        <Button.Icon
          className="!bg-transparent !border-transparent"
          icon={<IconRightSmall className={row.getIsExpanded() ? 'rotate-90' : ''} />}
        />

        <IconOrgMark className="ml-3 mr-1 text-orange-100" />
        <span className="text-gray-000">{cpOfrContent}</span>
        <IconRightArrow className="text-gray-300" />
        <span className="text-gray-000"> {cpBidContent}</span>
      </div>
    );
  }

  return null;
};
