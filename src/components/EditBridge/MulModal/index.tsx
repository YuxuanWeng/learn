import { memo } from 'react';
import { Input } from '@fepkg/components/Input';
import { Modal } from '@fepkg/components/Modal';
import { useMemoizedFn } from 'ahooks';
import { EditModalProps, MulModalInitialState } from '../types';
import { BridgeInfo } from './components/BridgeInfo';
import { Footer } from './components/Footer';
import { Header } from './components/Header';
import { MulBridgeProvider, useMulBridge } from './provider';

const Inner = ({ visible, onClose }: EditModalProps) => {
  const { currentFormState, handleSubmit, updateFormState, bridgeIndex } = useMulBridge();

  const submit = useMemoizedFn(async () => {
    const res = await handleSubmit();
    if (res) onClose?.();
  });

  return (
    <Modal
      keyboard
      visible={visible}
      width={744}
      title="编辑"
      onCancel={onClose}
      footer={
        <Footer
          onCancel={onClose}
          onConfirm={submit}
        />
      }
      onConfirm={submit}
    >
      <Header />

      <div className="min-h-[416px] px-3 py-2 flex flex-col gap-2">
        <div className="flex flex-row gap-2 flex-auto">
          <BridgeInfo
            index={bridgeIndex}
            isLeft
          />
          <BridgeInfo
            index={bridgeIndex + 1}
            isRight
          />
        </div>
        <Input
          label="桥备注"
          maxLength={100}
          className="h-7 bg-gray-800 border border-solid border-gray-600 w-full"
          onChange={val => {
            updateFormState('bridgeComment', val, currentFormState.leftStateValue.receiptDealId);
          }}
          value={currentFormState.leftStateValue.bridgeComment}
        />
      </div>
    </Modal>
  );
};

export const MulModal = (props: EditModalProps & MulModalInitialState) => {
  return (
    <MulBridgeProvider initialState={{ ...props }}>
      <Inner {...props} />
    </MulBridgeProvider>
  );
};

export const MemoMulModal = memo(MulModal, () => true);
