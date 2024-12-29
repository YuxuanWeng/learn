import { message } from '@fepkg/components/Message';
import { fetchReceiptDealByParent } from '@/common/services/api/receipt-deal/get-by-parent';
import { getSeqNum } from '@/common/services/api/receipt-deal/search';

export const getSeqNumNodeByParent = async (parent_deal_id?: string) => {
  if (!parent_deal_id) {
    message.error('成交单父id缺失');
    throw new Error('parent_deal_id is missing!');
  }
  const { receipt_deal_info: receiptDealInfoList } =
    (await fetchReceiptDealByParent({
      parent_deal_ids: [parent_deal_id]
    })) ?? {};
  return (
    <div className="text-primary-100 select-text">
      序列号：{receiptDealInfoList?.map(i => getSeqNum(i.seq_number, i.create_time)).join('、')}
    </div>
  );
};
