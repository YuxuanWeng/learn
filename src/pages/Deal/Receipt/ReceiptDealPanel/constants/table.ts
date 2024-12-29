import { ProductType, ReceiptDealStatus } from '@fepkg/services/types/enum';
import { cloneDeep } from 'lodash-es';
import {
  ReceiptDealTableColumnKey,
  ReceiptDealTableColumnSettingItem
} from '@/pages/Deal/Receipt/ReceiptDealPanel/types';

export const BNC_DEFAULT_RECEIPT_DEAL_TABLE_COLUMNS: ReceiptDealTableColumnSettingItem[] = [
  { key: ReceiptDealTableColumnKey.FlagNeedBridge, label: '加桥', width: 40, visible: true },
  { key: ReceiptDealTableColumnKey.InternalCode, label: '内码', width: 64, visible: true },
  { key: ReceiptDealTableColumnKey.SeqNumber, label: '序列号', width: 108, visible: true },
  { key: ReceiptDealTableColumnKey.OrderNo, label: '订单号', width: 120, visible: true },
  { key: ReceiptDealTableColumnKey.BridgeCode, label: '过桥码', width: 88, visible: true },
  { key: ReceiptDealTableColumnKey.TimeToMaturity, label: '剩余期限', width: 120, visible: true },
  { key: ReceiptDealTableColumnKey.DisplayCode, label: '代码', width: 140, visible: true },
  { key: ReceiptDealTableColumnKey.ShortName, label: '简称', width: 160, visible: true },
  { key: ReceiptDealTableColumnKey.ReceiptDealStatus, label: '状态', width: 88, visible: true },
  { key: ReceiptDealTableColumnKey.SendStatus, label: '推送状态', width: 88, visible: true },
  { key: ReceiptDealTableColumnKey.Px, label: 'Px', width: 180, visible: true },
  { key: ReceiptDealTableColumnKey.Volume, label: 'Vol', width: 80, visible: true },
  { key: ReceiptDealTableColumnKey.BrokerB, label: 'Broker(B)', width: 160, visible: true },
  { key: ReceiptDealTableColumnKey.BrokerO, label: 'Broker(O)', width: 160, visible: true },
  { key: ReceiptDealTableColumnKey.CpBid, label: 'CP.Bid', width: 160, visible: true },
  { key: ReceiptDealTableColumnKey.CpOfr, label: 'CP.Ofr', width: 160, visible: true },
  { key: ReceiptDealTableColumnKey.TradedDate, label: '交易日', width: 120, visible: true },
  { key: ReceiptDealTableColumnKey.DeliveryDate, label: '交割日', width: 120, visible: true },
  { key: ReceiptDealTableColumnKey.DealTime, label: '成交日', width: 140, visible: true },
  { key: ReceiptDealTableColumnKey.ValCleanPrice, label: '中债净价', width: 120, visible: true },
  { key: ReceiptDealTableColumnKey.ValYield, label: '中债YTM(%)', width: 120, visible: true },
  { key: ReceiptDealTableColumnKey.CsiCleanPrice, label: '中证净价', width: 120, visible: true },
  { key: ReceiptDealTableColumnKey.UpdateTime, label: '更新时间', width: 140, visible: true },

  { key: ReceiptDealTableColumnKey.IssuerRatingVal, label: '主体评级', width: 96, visible: false },
  { key: ReceiptDealTableColumnKey.BondRatingVal, label: '债券评级', width: 96, visible: false },
  { key: ReceiptDealTableColumnKey.CsiFullPrice, label: '中证全价', width: 120, visible: false },
  { key: ReceiptDealTableColumnKey.CsiYield, label: '中证YTM(%)', width: 120, visible: false },
  { key: ReceiptDealTableColumnKey.LiquidationSpeed, label: '清算速度', width: 120, visible: false },
  { key: ReceiptDealTableColumnKey.OptionType, label: '含权类型', width: 120, visible: false },
  { key: ReceiptDealTableColumnKey.ListedDate, label: '上市日', width: 120, visible: false },
  { key: ReceiptDealTableColumnKey.RepaymentMethod, label: '提前还本', width: 120, visible: false },
  { key: ReceiptDealTableColumnKey.PVBP, label: 'PVBP', width: 96, visible: false },
  { key: ReceiptDealTableColumnKey.Operator, label: '操作人', width: 120, visible: false },
  { key: ReceiptDealTableColumnKey.MaturityDate, label: '到期日', width: 120, visible: false },
  { key: ReceiptDealTableColumnKey.ImpliedRating, label: '隐含评级', width: 96, visible: false }
];

export const getDefaultReceiptDealTableColumnSettings = (productType: ProductType) => {
  switch (productType) {
    case ProductType.BCO:
      return cloneDeep(BNC_DEFAULT_RECEIPT_DEAL_TABLE_COLUMNS);
    case ProductType.BNC:
      return cloneDeep(BNC_DEFAULT_RECEIPT_DEAL_TABLE_COLUMNS);
    case ProductType.NCD:
      return cloneDeep(BNC_DEFAULT_RECEIPT_DEAL_TABLE_COLUMNS);
    default:
      return [];
  }
};

/** 待移交、待确认、待提交 */
export const ToBeCommit = new Set([
  ReceiptDealStatus.ReceiptDealToBeHandOver,
  ReceiptDealStatus.ReceiptDealToBeConfirmed,
  ReceiptDealStatus.ReceiptDealToBeSubmitted
]);
