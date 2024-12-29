import cx from 'classnames';
import { ProductType } from '@fepkg/services/types/bdm-enum';
import { CommentInput, CommentInputFlagOption } from '@/components/business/CommentInput';
import { useProductParams } from '@/layouts/Home/hooks';
import { useMarketDealForm } from '../../providers/FormProvider';

const flagOptions: CommentInputFlagOption[] = [
  { label: '过桥', value: 'comment_flag_bridge' },
  { label: '代付', value: 'comment_flag_pay_for' }
];

/** 市场成交录入表单中的备注样式 */
export const DealComment = () => {
  const { formState, updateFormState } = useMarketDealForm();
  const { productType } = useProductParams();

  return (
    <CommentInput
      inputCls="h-7"
      className={cx(productType === ProductType.NCD ? '!flex-row gap-x-2' : 'gap-1 items-end')}
      checkboxCls={cx(productType === ProductType.NCD ? '!h-7' : '!h-6', 'w-[140px] justify-between !rounded-lg')}
      flagOptions={flagOptions}
      composition
      value={{
        comment: formState.comment ?? '',
        flagValue: { comment_flag_bridge: formState.bridge, comment_flag_pay_for: formState.payFor }
      }}
      onChange={val => {
        updateFormState(draft => {
          draft.comment = val.comment;
          draft.bridge = !!val?.flagValue?.comment_flag_bridge;
          draft.payFor = !!val?.flagValue?.comment_flag_pay_for;
        });
      }}
      onEnterPress={(_, evt, composing) => {
        // 如果按下 shift 键，仅换行，不进行其他操作
        if (evt.shiftKey) return;
        // 如果正在输入中文，阻止提交
        if (composing) {
          evt.stopPropagation();
        }
      }}
    />
  );
};
