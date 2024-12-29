import cx from 'classnames';
import { receiptDealStatusOptions } from '@fepkg/business/components/ReceiptDealTableCell';
import { Input } from '@fepkg/components/Input';
import { Select } from '@fepkg/components/Select';
import { ReceiptDealStatus, Side } from '@fepkg/services/types/enum';
import { ReceiptDealFormMode } from '@/pages/Deal/Receipt/ReceiptDealForm/types';
import { useReceiptDealFormParams } from '../../hooks/useParams';
import { useReceiptDealBridge } from '../../providers/BridgeProvider';
import { useReceiptDealForm } from '../../providers/FormProvider';
import { useReceiptDealTrades } from '../../providers/TradesProvider';
import { getInstCommentOpts } from '../../utils';

const selectProps = {
  labelWidth: 72,
  className: 'h-7 bg-gray-800',
  clearIcon: null,
  size: 'sm'
} as const;

const inputProps = {
  className: 'h-7 bg-gray-800',
  placeholder: '请输入'
};

export const DealComment = () => {
  const { defaultReceiptDeal, mode } = useReceiptDealFormParams();
  const { formDisabled, formState, updateFormState, changeFormState } = useReceiptDealForm();
  const { trades } = useReceiptDealTrades();
  const { than1Bridge } = useReceiptDealBridge();

  const bidBrokerageType = trades[Side.SideBid].brokerage_type;
  const ofrBrokerageType = trades[Side.SideOfr].brokerage_type;

  const bidInstCommentOpts = getInstCommentOpts(bidBrokerageType, formDisabled);
  const ofrInstCommentOpts = getInstCommentOpts(ofrBrokerageType, formDisabled);

  const statusStyle =
    mode === ReceiptDealFormMode.Edit
      ? receiptDealStatusOptions.find(o => o.value === defaultReceiptDeal?.receipt_deal_status)
      : {
          label: '-',
          value: ReceiptDealStatus.ReceiptDealStatusNone,
          className: 'text-gray-100'
        };

  return (
    <div className="flex p-3 pr-3 border border-solid border-gray-600 rounded-lg">
      <div className="shrink-0 w-24 text-sm text-gray-200">
        <div className="h-7 mb-2 leading-7">备注：</div>
        <div className="h-7 leading-7">特别细节：</div>
      </div>

      <div
        className="flex-1 grid grid-cols-3 gap-x-6 gap-y-2"
        style={{ paddingRight: than1Bridge ? 252 : 52 }}
      >
        <Select
          label="机构(B)"
          {...selectProps}
          options={bidInstCommentOpts}
          disabled={formDisabled || formState.bidCommentState.brokerageCommentDisabled}
          value={formState.bidCommentState.brokerageComment}
          onChange={val =>
            updateFormState(draft => {
              draft.bidCommentState.brokerageComment = val;
            })
          }
        />
        <Input
          label="后台信息"
          {...inputProps}
          maxLength={15}
          disabled={formDisabled}
          value={formState.backendMessage}
          onChange={val => changeFormState('backendMessage', val)}
        />
        <Select
          label="机构(O)"
          {...selectProps}
          options={ofrInstCommentOpts}
          disabled={formDisabled || formState.ofrCommentState.brokerageCommentDisabled}
          value={formState.ofrCommentState.brokerageComment}
          onChange={val =>
            updateFormState(draft => {
              draft.ofrCommentState.brokerageComment = val;
            })
          }
        />
        <Input
          label="机构(B)"
          {...inputProps}
          maxLength={15}
          disabled={formDisabled}
          value={formState.bidCommentState.instSpecial}
          onChange={val =>
            updateFormState(draft => {
              draft.bidCommentState.instSpecial = val;
            })
          }
        />
        <Input
          label="其他细节"
          {...inputProps}
          maxLength={15}
          disabled={formDisabled}
          value={formState.otherDetail}
          onChange={val => changeFormState('otherDetail', val)}
        />
        <Input
          label="机构(O)"
          {...inputProps}
          maxLength={15}
          disabled={formDisabled}
          value={formState.ofrCommentState.instSpecial}
          onChange={val =>
            updateFormState(draft => {
              draft.ofrCommentState.instSpecial = val;
            })
          }
        />
        <Input
          label="状态"
          disabled
          {...inputProps}
          placeholder=""
          className={cx(inputProps.className, statusStyle?.className)}
          value={statusStyle?.label || '-'}
        />
        <Input
          label="后台反馈"
          disabled
          {...inputProps}
          placeholder=""
          className={cx(inputProps.className, 'col-span-2')}
          value={mode !== ReceiptDealFormMode.Join ? defaultReceiptDeal?.disapproval_reason || '-' : '-'}
        />
      </div>
    </div>
  );
};
