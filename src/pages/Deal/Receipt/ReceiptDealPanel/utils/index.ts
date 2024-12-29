import { ReceiptDeal, ReceiptDealTrade } from '@fepkg/services/types/bds-common';
import { ProductType, ReceiptDealStatus } from '@fepkg/services/types/enum';
import { CommonRoute, WindowName } from 'app/types/window-v2';
import { DEFAULT_WINDOW_HEIGHT, DEFAULT_WINDOW_WIGHT } from 'app/windows/constants';
import moment from 'moment';
import { ReceiptDealChildRowData } from '../components/ReceiptDealTable/types';

export const getReceiptDealPanelConfig = (productType: ProductType, internalCode?: string) => ({
  name: WindowName.ReceiptDealPanel,
  custom: {
    route: CommonRoute.ReceiptDealPanel,
    routePathParams: internalCode ? [productType.toString(), internalCode] : [productType.toString()]
  },
  options: {
    width: DEFAULT_WINDOW_WIGHT,
    height: DEFAULT_WINDOW_HEIGHT,
    minWidth: DEFAULT_WINDOW_WIGHT,
    minHeight: DEFAULT_WINDOW_HEIGHT,
    resizable: true
  }
});

/**
 * @description 确保不出现同一机构在bid/ofr放出现两次, 重复则返回true
 */
export const checkDuplicateTradeInfo = (selectedList: ReceiptDeal[]) => {
  // ReceiptDealTrade
  const bidTradeMap = new Map<ReceiptDealTrade, boolean>();
  const ofrTradeMap = new Map<ReceiptDealTrade, boolean>();
  for (const item of selectedList) {
    const bid = item.bid_trade_info;
    const ofr = item.ofr_trade_info;
    if (bid && bidTradeMap.has(bid)) {
      return true;
    }
    if (ofr && ofrTradeMap.has(ofr)) {
      return true;
    }
    bidTradeMap.set(bid, true);
    ofrTradeMap.set(ofr, true);
  }
  return false;
};

export const validateDeleteTradingElements = (list: ReceiptDealChildRowData[], first?: ReceiptDeal) => {
  return list.every(
    obj =>
      obj.original.bond_basic_info?.key_market === first?.bond_basic_info?.key_market &&
      obj.original.price === first?.price &&
      obj.original.volume === first?.volume &&
      obj.original.traded_date === first?.traded_date &&
      obj.original.delivery_date === first?.delivery_date
  );
};

/**
 * @title 检测该成交单是否可以提交
 * @description 提交条件: 待提交状态 且 交易日为当日或当日之前 且 加桥提醒按钮为点灭状态
 */
export const checkReceiptDealCanSubmit = (receiptDeal: ReceiptDeal) => {
  return (
    receiptDeal.receipt_deal_status === ReceiptDealStatus.ReceiptDealToBeSubmitted &&
    moment(Number(receiptDeal.traded_date)).isSameOrBefore(moment(), 'day') &&
    receiptDeal.flag_need_bridge !== true
  );
};
