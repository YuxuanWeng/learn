import { useState } from 'react';
import { TextArea } from '@fepkg/components/Input/TextArea';
import { message } from '@fepkg/components/Message';
import { Modal } from '@fepkg/components/Modal';
import { OperationSource } from '@fepkg/services/types/enum';
import { destroyReceiptDeal } from '@/common/services/api/receipt-deal/destroy';
import { useReceiptDealPanel } from '@/pages/Deal/Receipt/ReceiptDealPanel/providers/ReceiptDealPanelProvider';
import { checkIllegalList } from '@/pages/Spot/utils/bridge';

interface IDestroyModal {
  visible: boolean;
  setVisible: React.Dispatch<React.SetStateAction<boolean>>;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  receiptDealIdList: string[];
}

const ASSOCIATE_INFO = '关联毁单：';

export const DestroyModal = ({ visible, setVisible, setLoading, receiptDealIdList }: IDestroyModal) => {
  const { selectedList, handleRefetch } = useReceiptDealPanel();
  const first = selectedList.at(0)?.original;
  const [reason, setReason] = useState('');

  const close = () => {
    setVisible(false);
    setReason('');
  };

  if (!visible) return null;

  return (
    <Modal
      visible={visible}
      width={360}
      title="毁单"
      onCancel={close}
      titleCls="font-bold text-gray-000"
      footerProps={{ centered: true, confirmBtnProps: { disabled: !reason.trim(), label: '确认' } }}
      onConfirm={async () => {
        if (!first) {
          message.error('未选择成交单！');
          return;
        }

        setLoading(true);
        destroyReceiptDeal({
          destroyed_receipt_deal_list: receiptDealIdList.map(item => {
            const reasonTrim = reason.trim();
            const associateReason = item === first.receipt_deal_id ? reasonTrim : ASSOCIATE_INFO + reasonTrim;

            return {
              receipt_deal_id: item,
              reason: associateReason
            };
          }),
          operation_source: OperationSource.OperationSourceReceiptDeal
        })
          .then(async result => {
            close();
            handleRefetch();
            return checkIllegalList(result?.receipt_deal_operate_illegal_list ?? []);
          })
          .finally(() => {
            setLoading(false);
          });
      }}
    >
      <div className="flex justify-center items-center my-3 mx-3 text-sm">
        <TextArea
          autoFocus
          maxLength={30}
          label="毁单原因"
          labelWidth={96}
          placeholder="请输入"
          className="bg-gray-800"
          autoSize={{ minRows: 3, maxRows: 3 }}
          onChange={setReason}
        />
      </div>
    </Modal>
  );
};
