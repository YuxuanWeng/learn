import { ReceiptDealLogTable } from '@fepkg/business/components/ReceiptDealLogTable';
import { ReceiptDealLogTableProvider } from '@fepkg/business/components/ReceiptDealLogTable/TableProvider';
import { Modal } from '@fepkg/components/Modal';
import { OperationSource } from '@fepkg/services/types/enum';
import { useApprovalTable } from '@/pages/ApprovalList/providers/TableProvider';

const Inner = () => {
  const { modalState, updateModalState } = useApprovalTable();
  return (
    <Modal
      title="操作日志"
      visible={modalState.open}
      width={1400 + 2}
      closable
      maskClosable
      keyboard
      draggable={false}
      footer={null}
      onCancel={() => {
        updateModalState(draft => {
          draft.open = false;
          draft.selectedId = '';
        });
      }}
    >
      <div className="flex flex-col h-[600px] p-4">
        <ReceiptDealLogTable size="md" />
      </div>
    </Modal>
  );
};

export const ApprovalLogModal = () => {
  const { modalState } = useApprovalTable();

  return (
    <ReceiptDealLogTableProvider
      key={modalState.selectedId}
      initialState={{ dealId: modalState.selectedId, source: OperationSource.OperationSourceApproveReceiptDeal }}
    >
      <Inner />
    </ReceiptDealLogTableProvider>
  );
};
