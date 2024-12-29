import { KeyboardKeys } from '@fepkg/common/utils/keyboard';
import { Dialog } from '@fepkg/components/Dialog';
import { message } from '@fepkg/components/Message';
import { Switch } from '@fepkg/components/Switch';
import { useReset } from '@/common/providers/ResetProvider';
import { DialogLayout } from '@/layouts/Dialog';
import { useDialogLayout } from '@/layouts/Dialog/hooks';
import { List } from '../components/List';
import { ParsingArea } from '../components/ParsingArea';
import { useAlwaysOpen } from '../hooks/useAlwaysOpen';
import { useSubmit } from '../hooks/useSubmit';
import { useNCDPBatchForm } from '../providers/FormProvider';

export const FormLayout = () => {
  const { confirm, cancel } = useDialogLayout();

  const { formLoading } = useNCDPBatchForm();
  const [alwaysOpen, setAlwaysOpen] = useAlwaysOpen();
  const { reset } = useReset();

  const afterSubmit = () => {
    if (alwaysOpen) {
      message.destroy();
      message.success('报价提交完成！');
      reset();
    } else {
      confirm();
    }
  };

  const { handleSubmit } = useSubmit(afterSubmit);

  return (
    <>
      <DialogLayout.Header>
        <Dialog.Header>录入</Dialog.Header>
      </DialogLayout.Header>

      <Dialog.Body className="flex flex-col">
        <ParsingArea />
        <List />
      </Dialog.Body>

      <Dialog.Footer
        confirmBtnProps={{
          loading: formLoading
        }}
        onConfirm={handleSubmit}
        onCancel={() => cancel()}
      >
        <Dialog.FooterItem label="常开">
          <Switch
            tabIndex={-1}
            checked={alwaysOpen}
            onChange={val => setAlwaysOpen(val)}
            onKeyDown={(_, evt) => {
              if (evt.key === KeyboardKeys.Enter) evt.preventDefault();
            }}
          />
        </Dialog.FooterItem>
      </Dialog.Footer>
    </>
  );
};
