import { message } from '@fepkg/components/Message';
import { Side } from '@fepkg/services/types/bds-enum';
import { IUpsertReceiptDeal, ReceiptDealFormErrorStateType } from '../../types';

/** 校验机构不为空的成交单清空机构后不可进行提交 */
export const validationCPInfo = (
  errorState: ReceiptDealFormErrorStateType,
  cur: IUpsertReceiptDeal,
  prev?: IUpsertReceiptDeal
) => {
  if (
    (prev?.bid_trade_info?.inst_id && !cur.bid_trade_info?.inst_id) ||
    (prev?.bid_trade_info?.trader_id && !cur.bid_trade_info?.trader_id)
  ) {
    message.error('缺少（B）机构交易员信息，不可提交！');
    errorState.traderErrorState = {
      [Side.SideBid]: { inst: !cur.bid_trade_info?.inst_id, trader: !cur.bid_trade_info?.trader_id }
    };
    return false;
  }
  if (
    (prev?.ofr_trade_info?.inst_id && !cur.ofr_trade_info?.inst_id) ||
    (prev?.ofr_trade_info?.trader_id && !cur.ofr_trade_info?.trader_id)
  ) {
    message.error('缺少（O）机构交易员信息，不可提交！');
    errorState.traderErrorState = {
      [Side.SideOfr]: { inst: !cur.ofr_trade_info?.inst_id, trader: !cur.ofr_trade_info?.trader_id }
    };
    return false;
  }

  return true;
};
