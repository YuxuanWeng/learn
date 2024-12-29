import { ReceiptDealMulAdd } from '@fepkg/services/types/receipt-deal/mul-add';

/** 校验该成交单是否有有效费用 */
export const checkFee = (fee?: number) => {
  if (!fee) return false;
  return fee > 0;
};

/** 校验成交单四个按钮均不点亮代(含桥的单子会继承费用，当四个地方都是灭的时候才算清空，无桥的单子无需校验) */
export const checkNoPayfor = (deal?: ReceiptDealMulAdd.CreateReceiptDeal) => {
  return !(
    deal?.flag_bid_pay_for_inst ||
    deal?.flag_ofr_pay_for_inst ||
    deal?.bid_trade_info?.flag_pay_for_inst ||
    deal?.ofr_trade_info?.flag_pay_for_inst
  );
};
