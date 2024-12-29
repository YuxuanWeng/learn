import { Checkbox } from '@fepkg/components/Checkbox';
import { Dialog } from '@fepkg/components/Dialog';
import { ProductType } from '@fepkg/services/types/bdm-enum';
import { OperationType } from '@fepkg/services/types/enum';
import { useEnterDown } from '@/common/hooks/useEnterDown';
import { useProductParams } from '@/layouts/Home/hooks';
import { useMarketDealFormParams } from '../../hooks/useParams';
import { useSubmit } from '../../hooks/useSubmit';
import { useMarketDealForm } from '../../providers/FormProvider';

export const FormFooter = () => {
  const { productType } = useProductParams();
  const { defaultValue, copyCount } = useMarketDealFormParams();
  const { operationType, formState, updateFormState } = useMarketDealForm();
  const { handleSubmit, handleCancel } = useSubmit();

  const count = copyCount || defaultValue?.join_count;

  const toggleInternal = (val: boolean) => {
    updateFormState(draft => {
      draft.internal = val;
    });
  };

  const toggleIsSyncReceiptDeal = (val: boolean) => {
    updateFormState(draft => {
      draft.isSyncReceiptDeal = val;
    });
  };

  useEnterDown(handleSubmit);

  return (
    <Dialog.Footer
      confirmBtnProps={{ loading: formState.submitting, disabled: formState.submitting }}
      onConfirm={handleSubmit}
      onCancel={handleCancel}
    >
      <div className="flex items-center gap-3">
        <Dialog.FooterItem>
          <Checkbox
            checked={formState.internal}
            onChange={toggleInternal}
          >
            内部成交
          </Checkbox>
          {productType === ProductType.NCD && (
            <Checkbox
              checked={formState.isSyncReceiptDeal}
              disabled={operationType !== OperationType.BondDealTrdDeal}
              onChange={toggleIsSyncReceiptDeal}
            >
              发成交单
            </Checkbox>
          )}
        </Dialog.FooterItem>

        {!!count && (
          <Dialog.FooterItem>
            拷贝数量：<span className="text-orange-100">{count}</span>
          </Dialog.FooterItem>
        )}
      </div>
    </Dialog.Footer>
  );
};
