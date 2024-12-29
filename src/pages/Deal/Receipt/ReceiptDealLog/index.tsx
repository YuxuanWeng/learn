import { useParams } from 'react-router-dom';
import { ReceiptDealLogTable } from '@fepkg/business/components/ReceiptDealLogTable';
import { ReceiptDealLogTableProvider } from '@fepkg/business/components/ReceiptDealLogTable/TableProvider';
import { Dialog } from '@fepkg/components/Dialog';
import { OperationSource } from '@fepkg/services/types/enum';
import { DialogLayout } from '@/layouts/Dialog';

/** 成交单操作日志 */
const ReceiptDealLog = () => {
  const { dealId } = useParams() as { dealId: string };

  return (
    <ReceiptDealLogTableProvider initialState={{ dealId, source: OperationSource.OperationSourceReceiptDeal }}>
      <DialogLayout.Header controllers={['min', 'max', 'close']}>
        <Dialog.Header>成交单日志</Dialog.Header>
      </DialogLayout.Header>

      <Dialog.Body className="flex flex-col">
        <ReceiptDealLogTable renderer="electron-web" />
      </Dialog.Body>
    </ReceiptDealLogTableProvider>
  );
};

export default ReceiptDealLog;
