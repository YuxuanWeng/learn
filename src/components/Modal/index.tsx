import { Modal as ModalComponent, ModalProps } from '@fepkg/components/Modal';
import { useLock } from './useLock';

export const Modal = (props: ModalProps) => {
  const { visible, lock = false } = props;
  useLock(visible, lock);
  return <ModalComponent {...props} />;
};
