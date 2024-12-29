import { KeyboardEvent, useCallback, useState } from 'react';
import { KeyboardKeys } from '@fepkg/common/utils/keyboard';
import { Dialog } from '@fepkg/components/Dialog';
import { Modal } from '@fepkg/components/Modal';
import { LiquidationSpeed } from '@fepkg/services/types/common';
import { ProductType } from '@fepkg/services/types/enum';
import { Settlement } from '@/common/services/hooks/useSettings/useProductSettlementSettings';
import { trackPoint } from '@/common/utils/logger/point';
import { QuoteDates, Source } from '@/components/Quote/Dates';
import { settleQuoteDialogDOMId } from '@/components/Quote/utils';
import { CommentInput, CommentInputFlagValue } from '@/components/business/CommentInput';
import { useKeyboard } from '@/pages/ProductPanel/hooks/useKeyboard';
import { getSettlementLabel } from '@/pages/ProductPanel/utils';

const logFlag = 'quote-settle';

type QuoteSettleDlgProps = {
  uuid: string;
  visible: boolean;
  source?: Source;
  title?: string;
  productType: ProductType;
  disableDatePicker?: boolean;
  onCancel?: () => void;
  onSuccess?: (v: Settlement) => void;
  defaultLiqSpeedList?: LiquidationSpeed[];
  defaultComment?: string;
  defaultChecked?: boolean;
  defaultFlagValue?: CommentInputFlagValue;
};

const QuoteSettleDlg = ({
  visible,
  defaultLiqSpeedList,
  defaultChecked = true,
  title = '结算备注设置',
  source,
  disableDatePicker = true,
  onSuccess,
  onCancel,
  defaultComment,
  productType,
  defaultFlagValue,
  uuid
}: QuoteSettleDlgProps) => {
  const [liqSpeedList, setLiqSpeedList] = useState<LiquidationSpeed[]>(defaultLiqSpeedList || []); // 结算方式
  const [comment, setComment] = useState(defaultComment || '');
  const [checked, setChecked] = useState(defaultChecked); // 是否有结算方式
  const [flagValue, setFlagValue] = useState(defaultFlagValue);

  const onOk = useCallback(() => {
    onSuccess?.({
      key: uuid,
      label: getSettlementLabel(liqSpeedList, comment, checked),
      liq_speed_list: !checked ? [] : liqSpeedList,
      comment,
      haveMethod: checked,
      flagValue
    });
    onCancel?.();
  }, [onSuccess, uuid, liqSpeedList, comment, checked, flagValue, onCancel]);

  const onKeyDown = (e: KeyboardEvent<HTMLElement>) => {
    if (e.key === 'Tab') {
      trackPoint('keyboard-tab', logFlag);
    }
    if (e.key === 'Escape') {
      trackPoint('keyboard-esc', logFlag);
    }
  };

  useKeyboard({ onEscDown: onCancel });

  return (
    <Modal
      width={642}
      visible={visible}
      confirmByEnter
      onKeyDown={onKeyDown}
      onConfirm={onOk}
      onCancel={onCancel}
      title={title}
    >
      <Dialog.Body
        id={settleQuoteDialogDOMId}
        className="!py-2 !px-3"
      >
        <QuoteDates
          source={source || Source.Sidebar}
          defaultChecked={defaultChecked}
          offsetCls="!ml-[92px]"
          defaultLiqSpeedList={defaultLiqSpeedList}
          onLiqSpeedListChange={setLiqSpeedList}
          productType={productType}
          disableDatePicker={disableDatePicker}
          onCheckBoxChange={setChecked}
          logFlag={logFlag}
        />
        <CommentInput
          className="mt-2 h-6 flex !flex-row !items-center gap-3"
          inputCls="w-[356px]"
          checkboxCls="!gap-1 !px-0 !rounded-lg"
          flagType="button"
          value={{ comment, flagValue }}
          onChange={val => {
            setComment(val.comment);
            setFlagValue(val?.flagValue);
          }}
          onKeyDown={e => {
            if (e.key === KeyboardKeys.Tab || e.key === KeyboardKeys.Tab) return;
            e.stopPropagation();
            if (e.key === KeyboardKeys.Escape) onCancel?.();
          }}
        />
      </Dialog.Body>
    </Modal>
  );
};

export default QuoteSettleDlg;
