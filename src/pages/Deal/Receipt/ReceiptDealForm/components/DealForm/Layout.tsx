import { useLayoutEffect } from 'react';
import { Checkbox } from '@fepkg/components/Checkbox';
import { Dialog } from '@fepkg/components/Dialog';
import { Input } from '@fepkg/components/Input';
import { message } from '@fepkg/components/Message';
import { ModalUtils } from '@fepkg/components/Modal';
import { AlwaysOpenToolView } from '@/components/AlwaysOpenToolView';
import { checkSettlementAmountValid } from '@/components/business/Quote/utils';
import { DialogLayout } from '@/layouts/Dialog';
import { useDialogLayout } from '@/layouts/Dialog/hooks';
import { useReceiptDealFormParams } from '../../hooks/useParams';
import { useSubmit } from '../../hooks/useSubmit';
import { useReceiptDealForm } from '../../providers/FormProvider';
import { ReceiptDealFormMode } from '../../types';
import { DealForm } from './Form';

export const DealFormLayout = () => {
  const { cancel } = useDialogLayout();
  const { mode } = useReceiptDealFormParams();
  const { formDisabled, formState, changeFormState, formLoading } = useReceiptDealForm();
  const { handleSubmit } = useSubmit();

  const sendMarketDisabled = formDisabled || mode === ReceiptDealFormMode.Edit;

  /** 初始化时关闭倒挂提示窗口 */
  useLayoutEffect(() => {
    ModalUtils.destroyAll();
    message.destroy();
  }, []);

  return (
    <>
      <AlwaysOpenToolView alignRight />

      <DialogLayout.Header>
        <Dialog.Header>成交单录入</Dialog.Header>
      </DialogLayout.Header>

      <Dialog.Body className="flex flex-col !py-2">
        <DealForm />
      </Dialog.Body>

      <Dialog.Footer
        confirmBtnProps={{
          disabled: formDisabled,
          loading: formLoading
        }}
        onConfirm={handleSubmit}
        onCancel={() => cancel()}
      >
        <div className="flex items-center gap-3">
          <Dialog.FooterItem>
            <Checkbox
              disabled={formDisabled}
              checked={formState.internal}
              onChange={val => changeFormState('internal', !!val)}
            >
              内部成交
            </Checkbox>
            <Checkbox
              disabled={sendMarketDisabled}
              checked={formState.sendMarket}
              onChange={val => changeFormState('sendMarket', !!val)}
            >
              发市场
            </Checkbox>
          </Dialog.FooterItem>

          <Input
            label="结算模式"
            className="w-[198px] h-7"
            disabled
            value="DVP"
          />

          <Input
            label="结算金额"
            className="w-[264px] h-7"
            disabled={formDisabled}
            value={formState.settlementAmount}
            onChange={val => {
              const [valid, newPrice] = checkSettlementAmountValid(val);
              if (valid) changeFormState('settlementAmount', newPrice);
            }}
          />
        </div>
      </Dialog.Footer>
    </>
  );
};
