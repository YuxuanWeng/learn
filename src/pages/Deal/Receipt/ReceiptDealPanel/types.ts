import { ColumnSettingDef } from '@fepkg/components/Table';
import { ReceiptDealSearch } from '@fepkg/services/types/receipt-deal/search';

export enum ReceiptDealFilterState {
  Unfinished = 'unfinished',
  Finished = 'finished'
}

export enum InternalFilterState {
  Internal = 'Internal',
  NonInternal = 'non-internal'
}

export enum BridgeFilterState {
  Bridge = 'bridge',
  NonBridge = 'non-bridge'
}

export enum ReceiptDealTableColumnKey {
  /** 扩展器 */
  Expander = 'expander',
  /** 扩展父元素 */
  Parent = 'parent',
  /** 加桥提醒 */
  FlagNeedBridge = 'flag_need_bridge',
  /** 内码 */
  InternalCode = 'internal_code',
  /** 序列号 */
  SeqNumber = 'seq_number',
  /** 订单号 */
  OrderNo = 'order_no',
  /** 剩余期限 */
  TimeToMaturity = 'time_to_maturity',
  /** 代码 */
  DisplayCode = 'display_code',
  /** 简称 */
  ShortName = 'short_name',
  /** 状态 */
  ReceiptDealStatus = 'receipt_deal_status',
  /** 推送状态 */
  SendStatus = 'send_status',
  /** Px */
  Px = 'px',
  /** Vol */
  Volume = 'volume',
  /** 过桥码 */
  BridgeCode = 'bridge_code',
  /** Broker(B) */
  BrokerB = 'broker_b',
  /** Broker(O) */
  BrokerO = 'broker_o',
  /** CP.Bid */
  CpBid = 'cp_bid',
  /** CP.Ofr */
  CpOfr = 'cp_ofr',
  /** 交易日 */
  TradedDate = 'traded_date',
  /** 交割日 */
  DeliveryDate = 'delivery_date',
  /** 成交日 */
  DealTime = 'deal_time',
  /** 中债净价 */
  ValCleanPrice = 'val_clean_price',
  /** 中债YTM（%） */
  ValYield = 'val_yield',
  /** 中证净价 */
  CsiCleanPrice = 'csi_clean_price',
  /** 更新时间 */
  UpdateTime = 'update_time',
  /** 主体评级 */
  IssuerRatingVal = 'issuer_rating_val',
  /** 债券评级 */
  BondRatingVal = 'bond_rating_val',
  /** 中证全价 */
  CsiFullPrice = 'csi_full_price',
  /** 中证YTM（%） */
  CsiYield = 'csi_yield',
  /** 清算速度 */
  LiquidationSpeed = 'liquidation_speed',
  /** 含权类型 */
  OptionType = 'option_type',
  /** 上市日 */
  ListedDate = 'listed_date',
  /** 提前还本 */
  RepaymentMethod = 'repayment_method',
  /** PVBP */
  PVBP = 'val_basis_point_value',
  /** 操作人 */
  Operator = 'operator',
  /** 到期日 */
  MaturityDate = 'maturity_date',
  /** 隐含评级 */
  ImpliedRating = 'implied_rating'
}

export type ReceiptDealTableColumnSettingItem = ColumnSettingDef<ReceiptDealTableColumnKey>;

export type ReceiptDealRelatedFilter = ReceiptDealSearch.ReceiptDealTableRelatedFilter & {
  finished: ReceiptDealFilterState[];
};
export type ReceiptDealInputFilter = {
  order_no?: string | null;
  bridge_code?: string | null;
  seq_number?: string | null;
  internal_code?: string | null;
};
