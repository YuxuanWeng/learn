import { message } from '@fepkg/components/Message';
import { IUpsertReceiptDeal } from '../../types';

/**
 * @description 成交单要素校验
 */
export const validationDealSettlement = (receipt_deal_info: IUpsertReceiptDeal) => {
  if (!receipt_deal_info.settlement_mode) {
    message.error('结算信息有误！请重新输入！');
    return false;
  }
  // 结算金额不能为0或空
  if (!receipt_deal_info.settlement_amount) {
    message.error('结算金额有误！请重新输入！');
    return false;
  }
  return true;
};
