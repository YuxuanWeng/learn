import { Dialog } from '@fepkg/components/Dialog';
import { useMulBridge } from '../provider';

export const Footer = ({ onCancel, onConfirm }: { onCancel?: () => void; onConfirm?: () => void }) => {
  const { submitting, formState } = useMulBridge();

  return (
    <Dialog.Footer
      confirmBtnProps={{ loading: submitting }}
      onConfirm={onConfirm}
      onCancel={onCancel}
    >
      <div className="flex-center w-[76px] h-7 rounded-lg bg-gray-700 gap-1">
        <span className="text-primary-100">{(formState?.length ?? 1) - 1}</span>
        <span>桥编辑</span>
      </div>
    </Dialog.Footer>
  );
};
