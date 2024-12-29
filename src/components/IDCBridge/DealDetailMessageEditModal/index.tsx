import { TextArea } from '@fepkg/components/Input';
import { Modal } from '@fepkg/components/Modal';
import { useRef, useState } from 'react';
import { DealContainerData } from '@/components/IDCDealDetails/type';
import { Side } from '@fepkg/services/types/bds-enum';

type Props = {
  deal?: DealContainerData;
  onSubmit: (data?: DealContainerData, val?: string) => void;
  onCancel: () => void;
};

export const DealDetailMessageEditModal = ({ deal, onSubmit, onCancel }: Props) => {
  const [inputValue, setInputValue] = useState<string>(
    (deal?.dealSide === Side.SideBid
      ? deal?.parent_deal?.bid_send_order_info
      : deal?.parent_deal?.ofr_send_order_info) || ''
  );
  const isFocusingFinished = useRef(false);
  return (
    <Modal
      visible
      width={368}
      title="发单编辑"
      footerProps={{ centered: true }}
      confirmByEnter
      onConfirm={() => {
        onSubmit(deal, inputValue);
      }}
      onCancel={() => {
        onCancel();
      }}
      keyboard
    >
      <div className="!m-3">
        <TextArea
          ref={node => {
            if (!node) return;
            if (isFocusingFinished.current) return;
            isFocusingFinished.current = true;
            requestIdleCallback(() => {
              node.select();
            });
          }}
          className="bg-gray-800 text-gray-000"
          label="发单信息"
          maxLength={30}
          placeholder="请输入"
          value={inputValue}
          onChange={val => {
            setInputValue(val);
          }}
        />
      </div>
    </Modal>
  );
};
