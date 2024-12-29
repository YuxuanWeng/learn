import { useState } from 'react';
import { Button } from '@fepkg/components/Button';
import { message } from '@fepkg/components/Message';
import { ModalUtils } from '@fepkg/components/Modal';
import { getSeqNum } from '@/common/services/api/receipt-deal/search';
import { preventEnterDefault } from '@/pages/ProductPanel/utils';
import { useReceiptDealPanel } from '../../../providers/ReceiptDealPanelProvider';
import { DestroyOperator, btnCommonProps } from '../constants';
import { DestroyModal } from './DestroyModal';

interface IDestroyButton {
  disabled: boolean;
}

export const DestroyButton = ({ disabled }: IDestroyButton) => {
  const [visible, setVisible] = useState(false);
  const { selectedList, getReceiptDealByParent } = useReceiptDealPanel();
  const [receiptDealIdList, setReceiptDealIdList] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const openDestroyModal = (idList?: string[]) => {
    if (!idList?.length) {
      message.error('未找到对应单号！');
      return;
    }
    setReceiptDealIdList(idList);
    setVisible(true);
  };

  const closeDestroyModal = () => {
    setReceiptDealIdList([]);
    setVisible(false);
  };

  return (
    <>
      <Button
        {...btnCommonProps}
        key={DestroyOperator.key}
        icon={DestroyOperator.icon}
        disabled={disabled || loading}
        onKeyDown={preventEnterDefault}
        onClick={async () => {
          const hasParentDealIdList = selectedList.map(i => i.original.parent_deal_id).filter(Boolean);
          const allReceiptDeal = getReceiptDealByParent(hasParentDealIdList);

          if (allReceiptDeal?.length === hasParentDealIdList.length) {
            openDestroyModal(selectedList.map(i => i.original.receipt_deal_id));
            return;
          }
          const showDeleteList = allReceiptDeal?.filter(
            i => !selectedList.some(inner => inner.original.receipt_deal_id === i.receipt_deal_id)
          );
          ModalUtils.warning({
            title: <div className="select-none font-bold">确认毁单？</div>,
            content: (
              <div className="font-medium text-sm overflow-overlay max-h-[154px]">
                <div className="pr-6">该成交单为过桥成交单，将同时连带以下过桥成交单一并毁单：</div>
                <div className="text-primary-100 select-text">
                  {showDeleteList?.map(item => getSeqNum(item.seq_number, item.create_time)).join('、')}
                </div>
              </div>
            ),
            onOk: () => {
              openDestroyModal(allReceiptDeal?.map(i => i.receipt_deal_id));
            },
            onCancel: closeDestroyModal
          });
        }}
      >
        {DestroyOperator.text}
      </Button>
      <DestroyModal
        visible={visible}
        setVisible={setVisible}
        setLoading={setLoading}
        receiptDealIdList={receiptDealIdList}
      />
    </>
  );
};
