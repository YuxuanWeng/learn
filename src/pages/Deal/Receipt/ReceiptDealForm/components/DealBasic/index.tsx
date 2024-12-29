import { getSeqNum } from '@/common/services/api/receipt-deal/search';
import { ReadOnly } from '@/components/ReadOnly';
import { ReceiptDealFormMode } from '@/pages/Deal/Receipt/ReceiptDealForm/types';
import { useReceiptDealFormParams } from '../../hooks/useParams';

export const DealBasic = () => {
  const params = useReceiptDealFormParams();
  const { defaultReceiptDeal } = useReceiptDealFormParams();

  const options = [
    { label: '单号', value: params.mode !== ReceiptDealFormMode.Join ? defaultReceiptDeal?.order_no : '-' },
    {
      label: '序列号',
      value:
        params.mode !== ReceiptDealFormMode.Join
          ? getSeqNum(defaultReceiptDeal?.seq_number, defaultReceiptDeal?.create_time)
          : '-'
    },
    { label: '过桥码', value: params.mode !== ReceiptDealFormMode.Join ? defaultReceiptDeal?.bridge_code : '-' },
    { label: '内码', value: params.mode !== ReceiptDealFormMode.Join ? defaultReceiptDeal?.internal_code : '-' }
  ];

  return (
    <ReadOnly
      containerClassName="gap-x-6 my-2 !bg-transparent border border-solid border-gray-600"
      optionsClassName="pl-3 !py-[3px]"
      labelWidth={72}
      rowCount={4}
      options={options}
      enableCopy
    />
  );
};
