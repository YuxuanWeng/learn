import { ReactNode } from 'react';
import { DrawerProps } from '@fepkg/components/Drawer';
import { ReceiptDeal } from '@fepkg/services/types/common';

export type ReceiptDealDisplay = {
  /** 产品类型英文名称 */
  productType: string;
  /** 交易日 */
  tradeDate: string;
  /** 订单号 */
  orderNo: string;
  /** 过桥码 */
  bridgeCode: string;
  /** 内码 */
  internalCode: string;
  /** 买方机构名称 */
  bidInstName: string;
  /** 买方机构是否点亮 nc 表示 */
  bidInstNc: boolean;
  /** 买方机构城市 */
  bidInstCity: string;
  /** 买方交易方式 */
  bidTradeMode: string;
  /** 买方交易员 */
  bidTrader: string;
  /** 卖方机构名称 */
  ofrInstName: string;
  /** 卖方机构是否点亮 nc 表示 */
  ofrInstNc: boolean;
  /** 卖方机构城市 */
  ofrInstCity: string;
  /** 卖方交易方式 */
  ofrTradeMode: string;
  /** 卖方交易员 */
  ofrTrader: string;
  /** 买方是否代付 */
  bidFlagPayfor: boolean;
  /** 买方代付机构名称 */
  bidPayforInstName: string;
  /** 卖方代付机构是否点亮 nc 表示 */
  bidPayforInstNc: boolean;
  /** 买方代付机构城市 */
  bidPayforInstCity: string;
  /** 买方代付交易员 */
  bidPayforTrader: string;
  /** 卖方是否代付 */
  ofrFlagPayfor: boolean;
  /** 卖方代付机构名称 */
  ofrPayforInstName: string;
  /** 卖方代付机构是否点亮 nc 表示 */
  ofrPayforInstNc: boolean;
  /** 卖方代付机构城市 */
  ofrPayforInstCity: string;
  /** 卖方代付交易员 */
  ofrPayforTrader: string;
  /** 货币 */
  currency: string;
  /** 券面总额 */
  volume: string;
  /** 收益率 */
  yield: string;
  /** 全价 */
  fullPrice: string;
  /** 净价 */
  clearPrice: string;
  /** 行权类型 */
  exerciseType: string;
  /** 结算日 */
  settlementDate: string;
  /** 结算金额 */
  settlementAmount: string;
  /** 行权日 */
  optionDate: string;
  /** 到期日 */
  maturityDate: string;
  /** 债券代码 */
  bondCode: string;
  /** 债券简称 */
  bondName: string;
  /** 结算模式 */
  settlementMode: string;
  /** Bid 机构佣金备注 */
  bidBrokerageComment: string;
  /** 后台信息 */
  backendMessage: string;
  /** Ofr 机构佣金备注 */
  ofrBrokerageComment: string;
  /** Bid 机构特殊细节 */
  bidInstSpecial: string;
  /** 其他细节 */
  otherDetail: string;
  /** Ofr 机构特殊细节 */
  ofrInstSpecial: string;
  /** Bid 机构佣金类型 */
  bidBrokerage: ReactNode;
  /** Ofr 机构佣金类型 */
  ofrBrokerage: ReactNode;
} & { [key in `${'bid' | 'ofr'}Broker${'A' | 'B' | 'C' | 'D'}${'Name' | 'Percent'}`]: string };

export type ApprovalDetailDrawerProps = DrawerProps;
export type ApprovalDetailRenderProps = {
  /** 当前成交单数据 */
  target: ReceiptDeal;
  /** 用于 diff 的数据快照 */
  snapshot?: ReceiptDeal;
};

export type ApprovalController = 'pass' | 'no-pass';
