import { memo } from 'react';
import { Input } from '@fepkg/components/Input';
import { Modal } from '@fepkg/components/Modal';
import { Side } from '@fepkg/services/types/bds-enum';
import { EditModalProps, SideType, SingleModalInitialStateV2 } from '../types';
import { BaseInfo } from './components/BaseInfo';
import { ChangeBridge } from './components/ChangeBridge';
import { HideComment } from './components/HideComment';
import { SendInfo } from './components/SendInfo';
import { SendInstGroup } from './components/SendInstGroup';
import { EditBridgeProvider, useEditBridge } from './provider';

const Container = ({ side }: { side: SideType }) => {
  return (
    <div className="w-[356px] bg-gray-800 rounded-lg p-3 flex flex-col gap-2">
      <ChangeBridge side={side} />
      <div className="component-dashed-x-600" />
      <BaseInfo side={side} />
      <SendInfo side={side} />
      <HideComment side={side} />
      <SendInstGroup side={side} />
    </div>
  );
};

const Inner = ({ visible, onClose }: EditModalProps) => {
  const { submit, updateFormState, formState } = useEditBridge();

  return (
    <Modal
      keyboard
      visible={visible}
      width={748}
      title="编辑"
      onCancel={onClose}
      onConfirm={async () => {
        const res = await submit();
        if (res) onClose?.();
      }}
    >
      <div className="px-3 flex flex-col gap-3 py-3 select-none">
        <div className="flex justify-between ">
          <Container side={Side.SideOfr} />
          <Container side={Side.SideBid} />
        </div>
        <Input
          label="桥备注"
          maxLength={100}
          className="h-7 bg-gray-800 border border-solid border-gray-600"
          onChange={(val: string | undefined) => {
            updateFormState('bridgeComment', val);
          }}
          value={formState.bridgeComment}
        />
      </div>
    </Modal>
  );
};

const SingleModal = (props: EditModalProps & SingleModalInitialStateV2) => {
  return (
    <EditBridgeProvider initialState={{ ...props }}>
      <Inner {...props} />
    </EditBridgeProvider>
  );
};

export const MemoSingleModal = memo(SingleModal, () => true);
