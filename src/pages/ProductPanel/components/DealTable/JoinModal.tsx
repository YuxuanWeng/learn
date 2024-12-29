import { useRef, useState } from 'react';
import { Input } from '@fepkg/components/Input';
import { message } from '@fepkg/components/Message';
import { Modal } from '@fepkg/components/Modal';
import { IconAttention } from '@fepkg/icon-park-react';
import { MarketDeal } from '@fepkg/services/types/common';
import { atom, useAtom } from 'jotai';
import { useDialogWindow } from '@/common/hooks/useDialog';
import useOnlineOpenDialog from '@/common/hooks/useOnlineOpenDialog';
import { useProductParams } from '@/layouts/Home/hooks';
import { getMarketDealDialogConfig } from '@/pages/Deal/Market/MarketDealForm/utils';

export const joinMdlOpenAtom = atom(false);

export type JoinModalProps = {
  defaultValue?: MarketDeal;
  onSuccess?: () => void;
};

/** 由 Join 打开的成交录入面板的默认值 */
const defaultJoinMarketDeal = {
  deal_id: undefined,
  deal_time: undefined,
  comment: '',
  comment_flag_pay_for: false,
  comment_flag_bridge: false
};

export const JoinModal = ({ defaultValue, onSuccess }: JoinModalProps) => {
  const { productType } = useProductParams();
  const { beforeOpenDialogWindow } = useOnlineOpenDialog();
  const { openDialog } = useDialogWindow();
  const [inputError, setInputError] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const [open, setOpen] = useAtom(joinMdlOpenAtom);
  const [count, setCount] = useState('1');

  const handleInputChange = (val: string) => {
    if (inputError) {
      setInputError(false);
    }
    const regex = /^$|^(?!0)\d{1,3}$/;
    if (regex.test(val)) {
      if (val !== '' && Number(val) > 100) {
        val = '100';
      }
      setCount(val);
    }
  };

  const handleCancel = () => {
    setCount('1');
    setOpen(false);
  };

  const handleSubmit = () => {
    if (!beforeOpenDialogWindow()) return;
    if (!defaultValue || !count) {
      message.error('请输入数量');
      setInputError(true);
      inputRef.current?.focus();
      return;
    }

    handleCancel();
    const config = getMarketDealDialogConfig(productType, {
      defaultValue: { ...defaultValue, ...defaultJoinMarketDeal },
      copyCount: Number(count),
      defaultFocused: 'price',
      onSuccess
    });

    openDialog(config, { showOfflineMsg: false });
  };

  if (!open) return null;

  return (
    <Modal
      width={288}
      className="[&_.ant-modal-body]:p-0"
      title="拷贝"
      keyboard
      visible={open}
      footerProps={{ centered: true }}
      onConfirm={handleSubmit}
      onCancel={handleCancel}
    >
      <div className="flex flex-col gap-3 px-3 py-4">
        <Input
          ref={inputRef}
          label="拷贝数量"
          className="bg-gray-800"
          autoFocus
          value={count}
          placeholder="请输入数量"
          maxLength={3}
          error={inputError}
          onChange={handleInputChange}
          onEnterPress={handleSubmit}
        />

        <div className="gap-2 flex-center">
          <IconAttention
            size={16}
            className="text-orange-100"
          />
          <span className="text-xs text-orange-100">数量范围：1~100</span>
        </div>
      </div>
    </Modal>
  );
};
