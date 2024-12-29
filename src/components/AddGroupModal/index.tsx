import { useRef, useState } from 'react';
import { Input } from '@fepkg/components/Input';
import { Modal } from '@fepkg/components/Modal';

export type AddGroupModalProps = {
  visible?: boolean;
  defaultValue?: string;
  onOk?: (val?: string) => Promise<boolean>;
  onCancel?: () => void;
};

export const AddGroupModal = ({ defaultValue, visible, onOk, onCancel }: AddGroupModalProps) => {
  const [groupName, setGroupName] = useState<string | undefined>(defaultValue);
  const [inputErr, setInputErr] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);

  const handleConfirm = async () => {
    if (!groupName) return;
    const updateResult = await onOk?.(groupName);
    if (updateResult) {
      setGroupName(void 0);
      onCancel?.();
      setInputErr(false);
    } else {
      setInputErr(true);
      inputRef.current?.focus();
    }
  };

  const handleClose = () => {
    setInputErr(false);
    setGroupName(void 0);
    onCancel?.();
  };

  if (!visible) return null;

  return (
    <Modal
      visible={visible}
      width={336}
      confirmByEnter
      title="添加分组"
      footerProps={{ centered: true, confirmBtnProps: { disabled: !groupName } }}
      keyboard
      titleCls="border-none"
      className="[&_.ant-modal-content]:bg-gray-800 [&_.ant-modal-content]:border-none [&_.ant-modal-header]:bg-gray-800 [&_.ant-modal-body]:bg-gray-800"
      onConfirm={handleConfirm}
      onCancel={handleClose}
    >
      <div className="m-3">
        <Input
          ref={inputRef}
          className="bg-gray-700 text-gray-000"
          error={inputErr}
          defaultValue={defaultValue}
          label="分组名称"
          maxLength={10}
          autoFocus
          value={groupName}
          onChange={setGroupName}
        />
      </div>
    </Modal>
  );
};
