import { ReceiptDeal, ReceiptDealTrade } from '@fepkg/services/types/bds-common';
import { validateBroker } from './validateBroker';

const validationReceiptDealTrade = (trade_info: ReceiptDealTrade) => {
  if (!trade_info.brokerage) return false;
  if (!trade_info.trade_mode) return false;
  if (!trade_info.inst?.inst_id) return false;
  if (!trade_info.trader?.trader_id) return false;
  // 按顺序有broker，至少要有broker_id
  if (!validateBroker(trade_info)) return false;
  return true;
};

export const validationReceiptDeal = (receipt_deal: ReceiptDeal) => {
  if (!receipt_deal.direction) return false;
  if (!receipt_deal.bond_basic_info.key_market) return false;
  if (!receipt_deal.price_type) return false;
  if (!receipt_deal.price || (receipt_deal.flag_rebate && !receipt_deal.return_point)) return false;
  if (receipt_deal.volume === undefined) return false;
  if (!receipt_deal.traded_date) return false;
  if (!receipt_deal.delivery_date) return false;
  if (!validationReceiptDealTrade(receipt_deal.bid_trade_info)) return false;
  if (!validationReceiptDealTrade(receipt_deal.ofr_trade_info)) return false;
  return true;
};
