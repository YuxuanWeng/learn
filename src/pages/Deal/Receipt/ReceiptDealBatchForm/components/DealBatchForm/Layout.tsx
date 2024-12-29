import { Checkbox } from '@fepkg/components/Checkbox';
import { Dialog } from '@fepkg/components/Dialog';
import { DialogLayout } from '@/layouts/Dialog';
import { useSubmit } from '../../hooks/useSubmit';
import { useReceiptDealBatchForm } from '../../providers/FormProvider';
import { DealBatchForm } from './Form';

export const DealFormLayout = () => {
  const { handleSubmit } = useSubmit();

  const { sendMarket, setSendMarket, formDisabled, submitLoading } = useReceiptDealBatchForm();

  return (
    <>
      <DialogLayout.Header>
        <Dialog.Header>批量录入</Dialog.Header>
      </DialogLayout.Header>

      <Dialog.Body className="flex flex-col !py-3">
        <DealBatchForm />
      </Dialog.Body>

      <Dialog.Footer
        centered
        confirmBtnProps={{
          disabled: formDisabled,
          loading: submitLoading,
          label: '录入'
        }}
        cancelBtnProps={{
          style: { display: 'none' }
        }}
        onConfirm={() => handleSubmit()}
      >
        <Dialog.FooterItem className="absolute left-4">
          <Checkbox
            checked={sendMarket}
            onChange={val => setSendMarket(!!val)}
          >
            发市场
          </Checkbox>
        </Dialog.FooterItem>
      </Dialog.Footer>
    </>
  );
};
