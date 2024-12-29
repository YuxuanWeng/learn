import { useParams } from 'react-router-dom';
import { DealDetailLogTable } from '@fepkg/business/components/DealDetailLogTable';
import { DealDetailLogTableProvider } from '@fepkg/business/components/DealDetailLogTable/TableProvider';
import { Dialog } from '@fepkg/components/Dialog';
import { DialogLayout } from '@/layouts/Dialog';
import { useProductParams } from '@/layouts/Home/hooks';

/** 成交单操作日志 */
const ReceiptDealLog = () => {
  const { dealId } = useParams() as { dealId: string };
  const { productType } = useProductParams();

  return (
    <DealDetailLogTableProvider initialState={{ dealId, productType }}>
      <DialogLayout.Header controllers={['min', 'max', 'close']}>
        <Dialog.Header>明细/过桥操作日志</Dialog.Header>
      </DialogLayout.Header>

      <Dialog.Body className="flex flex-col !py-3">
        <DealDetailLogTable productType={productType} />
      </Dialog.Body>
    </DealDetailLogTableProvider>
  );
};

export default ReceiptDealLog;
