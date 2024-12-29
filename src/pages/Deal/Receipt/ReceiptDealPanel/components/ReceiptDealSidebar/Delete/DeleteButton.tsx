import { useState } from 'react';
import { Button } from '@fepkg/components/Button';
import { message } from '@fepkg/components/Message';
import { ModalUtils } from '@fepkg/components/Modal';
import { Popconfirm } from '@fepkg/components/Popconfirm';
import { IconDeleteFilled } from '@fepkg/icon-park-react';
import { ReceiptDeal } from '@fepkg/services/types/bds-common';
import { OperationSource } from '@fepkg/services/types/enum';
import { ReceiptDealDelete } from '@fepkg/services/types/receipt-deal/delete';
import { deleteReceiptDeal } from '@/common/services/api/receipt-deal/delete';
import { getSeqNum } from '@/common/services/api/receipt-deal/search';
import { useReceiptDealPanel } from '@/pages/Deal/Receipt/ReceiptDealPanel/providers/ReceiptDealPanelProvider';
import { checkIllegalList } from '@/pages/Spot/utils/bridge';
import { DeleteOperator, btnCommonProps } from '../constants';

interface IDestroyButton {
  disabled: boolean;
}

const operation_source = OperationSource.OperationSourceReceiptDeal;

const deleteWithModal = (
  receiptDealInfo: ReceiptDeal[] | undefined,
  showDeleteList: ReceiptDeal[] | undefined,
  onSuccess?: (result?: ReceiptDealDelete.Response) => void
) => {
  return new Promise(resolve => {
    ModalUtils.error({
      icon: <IconDeleteFilled className="text-danger-100" />,
      title: <div className="select-none font-bold">确认删除成交单？</div>,
      content: (
        <div className="font-medium text-sm overflow-y-overlay max-h-[154px]">
          <div className="pr-6">选中包含部分过桥成交单，删除此成交单将同时删除以下过桥成交单：</div>
          <div className="text-primary-100 select-text flex">
            成交单序列号：
            {showDeleteList?.map(item => getSeqNum(item.seq_number, item.create_time)).join('、')}
          </div>
        </div>
      ),
      onOk: () => {
        deleteReceiptDeal({
          receipt_deal_ids: receiptDealInfo?.map(i => i.receipt_deal_id) ?? [],
          operation_source
        })
          .then(onSuccess)
          .finally(() => {
            resolve('success');
          });
      },
      onCancel: () => {
        resolve('cancel');
      }
    });
  });
};

export const DeleteButton = ({ disabled }: IDestroyButton) => {
  const { selectedList, handleRefetch, getReceiptDealByParent } = useReceiptDealPanel();
  const [popconfirmOpen, setPopconfirmOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const afterDelete = (result?: ReceiptDealDelete.Response) => {
    handleRefetch();
    checkIllegalList(result?.receipt_deal_operate_illegal_list ?? []);
  };

  return (
    <Popconfirm
      type="danger"
      trigger="manual"
      placement="left"
      content="确定删除该成交单吗？"
      icon={
        <IconDeleteFilled
          size={16}
          className="text-danger-100 mt-1"
        />
      }
      confirmBtnProps={{ label: '删除' }}
      floatingProps={{ className: '!w-[240px]' }}
      open={popconfirmOpen}
      onOpenChange={setPopconfirmOpen}
      onConfirm={() => {
        setLoading(true);
        deleteReceiptDeal({
          receipt_deal_ids: selectedList.map(i => i.original.receipt_deal_id),
          operation_source
        })
          .then(afterDelete)
          .finally(() => {
            setLoading(false);
          });
      }}
    >
      <Button
        {...btnCommonProps}
        icon={DeleteOperator.icon}
        disabled={disabled || loading} // query暂停时，数据正在refetch，也不可点击
        onClick={async () => {
          try {
            setLoading(true);
            const hasParentDealIdList = selectedList.map(i => i.original.parent_deal_id).filter(Boolean);
            const allReceiptDeal = getReceiptDealByParent(hasParentDealIdList);

            if (allReceiptDeal?.length === hasParentDealIdList.length) {
              setPopconfirmOpen(true);
              return;
            }
            const showDeleteList = allReceiptDeal?.filter(
              i => !selectedList.some(inner => inner.original.receipt_deal_id === i.receipt_deal_id)
            );
            await deleteWithModal(allReceiptDeal, showDeleteList, afterDelete);
          } catch {
            message.error('获取该过桥码下的成交单失败!');
          } finally {
            setLoading(false);
          }
        }}
      >
        {DeleteOperator.text}
      </Button>
    </Popconfirm>
  );
};
