import { useDialogLayout } from '@/layouts/Dialog/hooks';
import { useProductParams } from '@/layouts/Home/hooks';
import { DealFormLayout } from './components/DealBatchForm/index';
import { ReceiptDealBatchFormProvider } from './providers/FormProvider';
import { TextAreaHighlightProvider } from './providers/TextAreaHighlightProvider';

/** 成交单录入 */
const ReceiptDealBatchForm = () => {
  const dialogLayout = useDialogLayout();
  const { productType } = useProductParams();

  if (!productType) return null;
  if (!dialogLayout) return null;

  return (
    <TextAreaHighlightProvider>
      <ReceiptDealBatchFormProvider>
        <DealFormLayout />
      </ReceiptDealBatchFormProvider>
    </TextAreaHighlightProvider>
  );
};

export default ReceiptDealBatchForm;
