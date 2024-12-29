import cx from 'classnames';
import { Button } from '@fepkg/components/Button';
import { IconApprover, IconTime } from '@fepkg/icon-park-react';
import { ReceiptDealStatus } from '@fepkg/services/types/bds-enum';
import { ReviewProcessPopover } from '@/components/ReviewProcessPopover';
import { RouteUrl } from '@/router/constants';
import { isBridgeParentData } from '@/pages/ApprovalList/components/ApprovalTable/utils';
import { useApprovalTable } from '@/pages/ApprovalList/providers/TableProvider';
import { ApprovalListType, ApprovalTableRowData } from '@/pages/ApprovalList/types';

type ActionCellProps = {
  rowData: ApprovalTableRowData;
};
export const ActionCell = ({ rowData }: ActionCellProps) => {
  const { accessCache, type, updateDrawerState, updateModalState } = useApprovalTable();

  if (isBridgeParentData(rowData)) {
    const { children } = rowData;
    return (
      <Button
        className="w-13 h-6 px-0 font-medium"
        type="gray"
        plain
        onClick={() => {
          window.open(`${RouteUrl.Preview}?id=${children?.map(child => child.id).join(',')}`, '_blank');
        }}
      >
        查看
      </Button>
    );
  }

  const renderLogButton = () => (
    <Button
      className={cx(
        type === ApprovalListType.Approval && 'w-18',
        type === ApprovalListType.History && 'w-10',
        type === ApprovalListType.Deal && 'w-10',
        'h-6'
      )}
      type="primary"
      text
      icon={<IconTime />}
      onClick={() => {
        updateModalState(draft => {
          draft.open = true;
          draft.selectedId = rowData.original.receipt_deal_id;
        });
      }}
    />
  );

  const receiptDeal = rowData.original;

  if (type === ApprovalListType.History)
    return (
      <>
        {receiptDeal.order_no &&
        accessCache.historyAudit &&
        ![ReceiptDealStatus.ReceiptDealToBeConfirmed, ReceiptDealStatus.ReceiptDealToBeSubmitted].includes(
          receiptDeal.receipt_deal_status
        ) ? (
          <>
            <ReviewProcessPopover receiptDeal={receiptDeal}>
              <Button
                className="w-10 h-6"
                type="primary"
                text
                icon={<IconApprover />}
              />
            </ReviewProcessPopover>
            {accessCache?.historyLog && <span className="valuation-cell shrink-0 w-px mx-2 h-2.5 bg-gray-300" />}
          </>
        ) : null}
        {accessCache?.historyLog && (
          <>
            {accessCache.historyAudit && <span className="w-[90px]" />}
            {renderLogButton()}
          </>
        )}
      </>
    );

  if (type === ApprovalListType.Deal) {
    return (
      <>
        {accessCache.historyAudit && <span className="w-[90px]" />}
        {renderLogButton()}
      </>
    );
  }

  return (
    <>
      {rowData.approval === 'approval' ? (
        <Button
          type="primary"
          text
          className="w-18 h-6 font-medium"
          onClick={() => {
            updateDrawerState(draft => {
              draft.open = true;
              draft.selectedId = receiptDeal.receipt_deal_id;
              draft.initialData = [receiptDeal];
            });
          }}
        >
          审核
        </Button>
      ) : null}
      {rowData.approval === 'others' ? (
        <span className="text-gray-300 w-18 leading-6 text-center font-medium">他人处理</span>
      ) : null}
      {rowData.approval === 'myself' ? (
        <span className="text-gray-300 w-18 leading-6 text-center font-medium">本人处理</span>
      ) : null}
      {rowData.approval && accessCache?.approvalLog && (
        <span className="valuation-cell shrink-0 w-px mx-2 h-2.5 bg-gray-300" />
      )}
      {!rowData.approval && accessCache?.approvalLog && <span className="w-[90px]" />}
      {accessCache?.approvalLog && renderLogButton()}
    </>
  );
};
