import { message } from '@fepkg/components/Message';
import { IUpsertReceiptDeal } from '../../types';

/**
 * @description 成交单信息校验
 */
export const validationDealInfo = (receipt_deal_info: IUpsertReceiptDeal) => {
  if (!receipt_deal_info.direction) {
    message.error('交易方向录入有误！');
    return false;
  }
  return true;
};
