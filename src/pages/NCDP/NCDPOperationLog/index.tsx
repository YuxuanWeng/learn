import { useParams } from 'react-router-dom';
import { Dialog } from '@fepkg/components/Dialog';
import { DialogLayout } from '@/layouts/Dialog';
import { NCDPLogTable } from './LogTable';
import { LogTableProvider } from './LogTable/TableProvider';
import { ProductPanelTableKey } from '@/pages/ProductPanel/types';

const NCDPLog = () => {
  const { ncdpId, referred } = useParams() as { ncdpId: string; referred: string; productType: string };
  return (
    <LogTableProvider initialState={{ ncdpId, referred: referred === ProductPanelTableKey.Referred }}>
      <DialogLayout.Header controllers={['min', 'max', 'close']}>
        <Dialog.Header>报价日志</Dialog.Header>
      </DialogLayout.Header>

      <Dialog.Body className="flex flex-col !py-3">
        <NCDPLogTable />
      </Dialog.Body>
    </LogTableProvider>
  );
};
export default NCDPLog;
