import { Modal } from '@fepkg/components/Modal';
import { NCDPInfo } from '@fepkg/services/types/common';
import { atom, useAtom } from 'jotai';
import { List } from '@/pages/NCDP/NCDPBatchForm/components/List';
import { useSubmit } from '@/pages/NCDP/NCDPBatchForm/hooks/useSubmit';
import { NCDPBatchFormProvider } from '@/pages/NCDP/NCDPBatchForm/providers/FormProvider';
import { NCDPBatchFormMode } from '@/pages/NCDP/NCDPBatchForm/types';

export const editMdlOpenAtom = atom(false);

type EditModalProps = {
  selectedNCDPList: NCDPInfo[];
  onSuccess?: () => void;
};

const Inner = ({ selectedNCDPList, onSuccess }: EditModalProps) => {
  const [open, setOpen] = useAtom(editMdlOpenAtom);

  const isBatch = selectedNCDPList.length > 1;

  const handleCancel = () => {
    setOpen(false);
  };

  const handleConfirm = async () => {
    onSuccess?.();
    handleCancel();
  };

  const { handleSubmit } = useSubmit(handleConfirm);

  return (
    <Modal
      width={(isBatch ? 1016 : 972) + 2}
      title={isBatch ? '批量编辑' : '编辑'}
      className="[&_.ant-modal-body]:mb-3 [&_.ant-modal-body]:px-3"
      keyboard
      draggable={false}
      visible={open}
      onConfirm={handleSubmit}
      onCancel={handleCancel}
    >
      <List />
    </Modal>
  );
};

export const EditModal = (props: EditModalProps) => {
  const { selectedNCDPList } = props;

  const [open] = useAtom(editMdlOpenAtom);

  if (!open) return null;

  return (
    <NCDPBatchFormProvider initialState={{ mode: NCDPBatchFormMode.Edit, defaultValues: selectedNCDPList }}>
      <Inner {...props} />
    </NCDPBatchFormProvider>
  );
};
