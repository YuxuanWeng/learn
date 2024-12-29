import { ResetProvider, useReset } from '@/common/providers/ResetProvider';
import { useDialogLayout } from '@/layouts/Dialog/hooks';
import { FormLayout } from './layouts';
import { NCDPBatchFormProvider } from './providers/FormProvider';
import { NCDPBatchFormMode } from './types';

const Inner = () => {
  const { key } = useReset();

  return (
    <NCDPBatchFormProvider
      key={key}
      initialState={{ mode: NCDPBatchFormMode.Add }}
    >
      <FormLayout />
    </NCDPBatchFormProvider>
  );
};

const NCDPBatchForm = () => {
  const dialogLayout = useDialogLayout();

  if (!dialogLayout) return null;

  return (
    <ResetProvider>
      <Inner />
    </ResetProvider>
  );
};

export default NCDPBatchForm;
