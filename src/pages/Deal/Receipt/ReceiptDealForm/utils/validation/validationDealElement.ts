import { message } from '@fepkg/components/Message';
import { BondQuoteType } from '@fepkg/services/types/bds-enum';
import { IUpsertReceiptDeal, ReceiptDealFormErrorStateType } from '../../types';

/**
 * @description 成交单要素校验
 */
export const validationDealElement = (
  receipt_deal_info: IUpsertReceiptDeal,
  errorState: ReceiptDealFormErrorStateType
) => {
  if (!receipt_deal_info.bond_key_market) {
    message.error('产品录入有误！');
    return false;
  }
  if (receipt_deal_info.price_type === BondQuoteType.TypeNone) {
    message.error('价格无效！请重新输入！');
    return false;
  }
  if (!receipt_deal_info.deal_market_type) {
    message.error('是否二级录入有误！');
    return false;
  }
  // 价格数值不可为空或0，若点亮返点，返点值不可为空或0
  if (!receipt_deal_info.price) {
    message.error('价格无效！请重新输入！');
    errorState.formErrorState = { quote_price: true };
    return false;
  }
  if (receipt_deal_info.flag_rebate && !receipt_deal_info.return_point) {
    message.error('价格无效！请重新输入！');
    errorState.formErrorState = { return_point: true };
    return false;
  }
  // 报价量不可为空或0
  if (!receipt_deal_info.volume) {
    message.error('券面总额无效！请重新输入！');
    errorState.formErrorState = { volume: true };
    return false;
  }

  if (!receipt_deal_info.bid_trade_info?.traded_date || !receipt_deal_info.ofr_trade_info?.traded_date) {
    message.error('交易日无效！请重新输入！');
    return false;
  }
  if (!receipt_deal_info.bid_trade_info?.delivery_date || !receipt_deal_info.ofr_trade_info?.delivery_date) {
    message.error('交割日无效！请重新输入！');
    return false;
  }
  return true;
};
