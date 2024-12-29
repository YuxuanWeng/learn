import { Button, ButtonProps } from '@fepkg/components/Button';
import { Modal, ModalProps } from '@fepkg/components/Modal';
import { IconRightArrow } from '@fepkg/icon-park-react';
import { DiffDealType } from '@/components/IDCDealDetails/type';
import { DiffContent } from './diffContent';

type DiffModalProps = ModalProps & {
  /** 带有新旧对比的数据 */
  data?: DiffDealType;
  confirmButProps?: ButtonProps;
};

export const DiffModal = ({ onCancel, data, onConfirm, width = 692, title = '成交变更', ...rest }: DiffModalProps) => {
  return (
    <Modal
      {...rest}
      mask={false}
      width={width}
      keyboard
      title={title}
      onCancel={onCancel}
      footerProps={{ centered: true, showBtn: false }}
      footerChildren={
        <Button
          type="primary"
          {...rest.confirmButProps}
          className="w-[108px] h-8 mr-3"
          onClick={onConfirm}
        >
          我知道了
        </Button>
      }
    >
      <div className="flex gap-1 p-3 h-full justify-between">
        <DiffContent
          type="old"
          data={data?.prev}
        />
        <IconRightArrow className="self-center text-gray-200" />
        <DiffContent
          type="new"
          data={data?.next}
        />
      </div>
    </Modal>
  );
};
