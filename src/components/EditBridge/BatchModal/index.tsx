import { TraderSearchProvider } from '@fepkg/business/components/Search/TraderSearch';
import { Modal } from '@fepkg/components/Modal';
import { Side } from '@fepkg/services/types/bds-enum';
import { TraderPreferenceProvider } from '@/components/business/Search/TraderSearch';
import { useProductParams } from '@/layouts/Home/hooks';
import { BatchModalInitialState, EditModalProps, SideType } from '../types';
import { ChangeBridge } from './components/ChangeBridge';
import { SendInfo } from './components/SendInfo';
import { EditBridgeProvider, useEditBridge } from './provider';

const Container = ({ side }: { side: SideType }) => {
  return (
    <div className="w-[50%] bg-gray-800 rounded-lg p-3 flex flex-col gap-2">
      <ChangeBridge side={side} />
      <SendInfo side={side} />
    </div>
  );
};

const Inner = ({ visible, onClose }: EditModalProps) => {
  const { submit } = useEditBridge();

  return (
    <Modal
      keyboard
      visible={visible}
      width={748}
      title="批量编辑"
      onCancel={onClose}
      onConfirm={async () => {
        const res = await submit();
        if (res) onClose?.();
      }}
    >
      <div className="p-3 select-none">
        <div className="flex gap-3">
          <Container side={Side.SideOfr} />
          <Container side={Side.SideBid} />
        </div>
      </div>
    </Modal>
  );
};

export const BatchModal = (props: EditModalProps & BatchModalInitialState) => {
  const { productType } = useProductParams();
  return (
    <EditBridgeProvider initialState={{ ...props }}>
      <TraderSearchProvider initialState={{ productType }}>
        <TraderPreferenceProvider>
          <Inner {...props} />
        </TraderPreferenceProvider>
      </TraderSearchProvider>
    </EditBridgeProvider>
  );
};
