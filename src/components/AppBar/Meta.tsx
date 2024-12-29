import { MessageCenter } from '@fepkg/business/components/MessageCenter';
import { message } from '@fepkg/components/Message';
import { MessageType, ReceiptDealStatus } from '@fepkg/services/types/bds-enum';
import { Message } from '@fepkg/services/types/common';
import { fetchReceiptDealByParent } from '@/common/services/api/receipt-deal/get-by-parent';
import { useProductParams } from '@/layouts/Home/hooks';
import { miscStorage } from '@/localdb/miscStorage';
import { getBroker } from '@/pages/Deal/Receipt/ReceiptDealForm/utils';
import { useOpenReceiptDealPanel } from '@/pages/Deal/Receipt/ReceiptDealPanel/hooks/useOpenReceiptDealPanel';
import { useOpenSpotPanel } from '@/pages/Spot/Panel/hooks/useOpenSpotPanel';
import { Clock } from './Clock';
import { UserDetail } from './UserDetail';

export const Meta = () => {
  const { productType } = useProductParams();
  const openReceiptDealPanel = useOpenReceiptDealPanel();
  const openSpotPanel = useOpenSpotPanel();
  const userId = miscStorage.userInfo?.user_id;

  const onMessageClick = async (msg: Message) => {
    if (
      msg.message_type === MessageType.MessageTypeUrgentDeal &&
      msg.product_type === productType &&
      msg.biz_info?.receipt_deal_id
    ) {
      const receiptDealId = msg.biz_info.receipt_deal_id;
      const response = await fetchReceiptDealByParent({ parent_deal_ids: [receiptDealId] });
      const deal = response.receipt_deal_info?.at(0);

      if (deal) {
        // 点击的催单非当前台子
        if (deal.bond_basic_info.product_type !== productType) return false;
        // 存在成交单不是已毁单、待审核、送审中，并且经纪人有自己
        if (
          !response.receipt_deal_info?.filter(
            d =>
              ![
                ReceiptDealStatus.ReceiptDealDestroyed,
                ReceiptDealStatus.ReceiptDealToBeExamined,
                ReceiptDealStatus.ReceiptDealSubmitApproval
              ].includes(d.receipt_deal_status) &&
              (getBroker(d.bid_trade_info).includes(userId) || getBroker(d.ofr_trade_info).includes(userId))
          ).length
        ) {
          message.error('消息失效');
          return false;
        }

        // 未移交情况下跳转到成交记录，否则跳转到成交单
        if (deal.receipt_deal_status === ReceiptDealStatus.ReceiptDealToBeHandOver) {
          openSpotPanel(deal.internal_code);
        } else {
          return openReceiptDealPanel(deal.internal_code);
        }
      } else {
        // 成交单流转为已删除（成交记录已删除）时，接口返回undefined
        message.error('消息失效');
      }
    }
    return false;
  };

  return (
    <div className="absolute top-0 right-4 flex items-center gap-4 h-full">
      <Clock />
      <MessageCenter
        onMessageClick={onMessageClick}
        userId={userId}
        btnClassName="rounded-full"
      />
      <UserDetail />
    </div>
  );
};
