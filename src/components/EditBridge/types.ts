import { BridgeChannel, Side, TradeDirection } from '@fepkg/services/types/bds-enum';
import {
  InstitutionTiny,
  ReceiptDealDetailBridge,
  SendOrderInst,
  Trader,
  TraderLite
} from '@fepkg/services/types/common';
import { ReceiptDealUpdateBridge } from '@fepkg/services/types/receipt-deal/update-bridge';

/** 桥编辑模式   */
export enum EditBridgeMode {
  Single /** 单条编辑 */,
  Batch /** 批量编辑 */
}

export type SideType = Side.SideBid | Side.SideOfr;

export type EditModalProps = {
  visible: boolean;
  onClose?: () => void;
};

export type BatchDefaultBridgeValueProps = Pick<
  ReceiptDealDetailBridge,
  | 'bridge_bid_channel'
  | 'bridge_ofr_channel'
  | 'bid_bridge_direction'
  | 'ofr_bridge_direction'
  | 'bid_send_msg'
  | 'ofr_send_msg'
> & {
  bidBridgeDirectionDisabled?: boolean;
  ofrBridgeDirectionDisabled?: boolean;
  /** 桥机构 */
  inst?: InstitutionTiny;
  /** 桥交易员 */
  trader?: TraderLite;
};

export type TradeValueProps = {
  // null 表示机构/交易员在这一侧都不存在(前端显示‘机构待定’)， undefined表示机构/交易员在这一层不一致
  [Side.SideBid]?: { inst?: InstitutionTiny | null; trader?: Trader | null; trader_tag?: string };
  [Side.SideOfr]?: { inst?: InstitutionTiny | null; trader?: Trader | null; trader_tag?: string };
};

export type BatchModalInitialState = {
  /** 父id列表 */
  parentDealIds: string[];

  /** 与bid真实对手方直连的成交单id列表 */
  bidDirectConnectionDealIds: { dealId: string; flagPayForInst: boolean }[];

  /** 与ofr真实对手方直连的成交单id列表 */
  ofrDirectConnectionDealIds: { dealId: string; flagPayForInst: boolean }[];

  /** 默认桥信息 */
  defaultBridgeValue?: BatchDefaultBridgeValueProps;

  /** 真实对手方信息 */
  defaultTradeValue?: TradeValueProps;
};

export enum Source {
  /** 明细 */
  Detail,
  /** 过桥 */
  Bridge
}

export type FormState = {
  bidReceiptDealId: string;
  /** bid机构（真实交易方） */
  bidInst?: InstitutionTiny;
  /** bid机构下交易员（真实交易方） */
  bidTrader?: Trader;
  /** bid机构下交易员标签（真实交易方） */
  bidTraderTag?: string;
  /** bid桥机构 */
  bidBridgeInst?: InstitutionTiny;
  /** bid桥机构下交易员 */
  bidBridgeTrader?: Trader;
  /** bid桥机构下交易员标签 */
  bidBridgeTraderTag?: string;
  /** bid是否代付 */
  bidIsPaid?: boolean;
  /** bid桥指向 */
  bidDirection?: TradeDirection;
  /** bid结算方式 */
  bidSettlement?: string;
  /** bid桥渠道 */
  bidChannel?: BridgeChannel;
  /** bid方向发给信息 */
  bidSendMsg?: string;
  /** bid方向发单备注 */
  bidSendMsgComment?: string;
  /** bid方向是否隐藏备注 */
  bidHideComment?: boolean;
  /** bid方向发单机构 */
  bidSendOrderInstList?: SendOrderInst[];
  /** bid计费人id */
  bidBillerId?: string;
  /** bid加桥计费人名字 */
  bidBillerName?: string;
  /** bid计费人标签 */
  bidBillerTag?: string;
  /** bid联系方式 */
  bidContact?: string;
  /** bid加桥联系人标签 */
  bidContactTag?: string;
  /** bid加桥联系人名字 */
  bidContactName?: string;
  /** bid发单费用 */
  bidSendPay?: number;
  /** bid成交日期(时间戳) */
  bidDealTime?: string;

  ofrReceiptDealId: string;
  /** ofr机构（真实交易方） */
  ofrInst?: InstitutionTiny;
  /** ofr机构下交易员（真实交易方） */
  ofrTrader?: Trader;
  /** ofr机构下交易员标签（真实交易方） */
  ofrTraderTag?: string;
  /** ofr桥机构 */
  ofrBridgeInst?: InstitutionTiny;
  /** ofr桥机构下交易员 */
  ofrBridgeTrader?: Trader;
  /** ofr桥机构下交易员标签 */
  ofrBridgeTraderTag?: string;
  /** ofr是否代付 */
  ofrIsPaid?: boolean;
  /** ofr桥指向 */
  ofrDirection?: TradeDirection;
  /** ofr结算方式 */
  ofrSettlement?: string;
  /** ofr桥渠道 */
  ofrChannel?: BridgeChannel;
  /** ofr方向发给信息 */
  ofrSendMsg?: string;
  /** ofr方向发单备注 */
  ofrSendMsgComment?: string;
  /** ofr方向是否隐藏备注 */
  ofrHideComment?: boolean;
  /** ofr方向发单机构 */
  ofrSendOrderInstList?: SendOrderInst[];
  /** ofr计费人id */
  ofrBillerId?: string;
  /** ofr加桥计费人名字 */
  ofrBillerName?: string;
  /** ofr计费人标签 */
  ofrBillerTag?: string;
  /** ofr联系方式 */
  ofrContact?: string;
  /** ofr加桥联系人id */
  ofrContactId?: string;
  /** ofr加桥联系人标签 */
  ofrContactTag?: string;
  /** ofr加桥联系人名字 */
  ofrContactName?: string;
  /** ofr发单费用 */
  ofrSendPay?: number;
  /** ofr成交日期(时间戳) */
  ofrDealTime?: string;

  /** 桥备注 */
  bridgeComment?: string;
};

/** 单条桥编辑窗口初始状态单桥 */
export type SingleModalInitialStateV2 = {
  /** parentId */
  parentDealId: string;
  /** 成交单总量 */
  volume?: number;
  /** 面板来源 */
  source?: Source;
  /** 债券第一段到期日(时间戳) */
  firstMaturityDate?: string;
  /** 默认桥信息 */
  defaultValue: FormState;
  /** 发给信息 */
  defaultSendMsg?: string;
};

/** 多桥编辑窗口初始状态 */
export type MulFormState = {
  /** 成交单Id */
  receiptDealId: string;

  // bid方
  /** bid桥机构 */
  bidBridgeInst?: InstitutionTiny;
  /** bid桥机构下交易员 */
  bidBridgeTrader?: Trader;
  /** bid桥机构下交易员标签 */
  bidBridgeTraderTag?: string;
  /** bid加桥计费人名字 */
  bidBillerName?: string;
  /** bid计费人标签 */
  bidBillerTag?: string;
  /** bid联系方式 */
  bidContact?: string;
  /** bid加桥联系人标签 */
  bidContactTag?: string;
  /** bid加桥联系人名字 */
  bidContactName?: string;

  // ofr方
  /** ofr桥机构 */
  ofrBridgeInst?: InstitutionTiny;
  /** ofr桥机构下交易员 */
  ofrBridgeTrader?: Trader;
  /** ofr桥机构下交易员标签 */
  ofrBridgeTraderTag?: string;
  /** ofr加桥计费人名字 */
  ofrBillerName?: string;
  /** ofr计费人标签 */
  ofrBillerTag?: string;
  /** ofr联系方式 */
  ofrContact?: string;
  /** ofr加桥联系人标签 */
  ofrContactTag?: string;
  /** ofr加桥联系人名字 */
  ofrContactName?: string;

  /** 桥指向 */
  direction?: TradeDirection;
  /** 结算方式 */
  settlement?: string;
  /** 桥渠道 */
  channel?: BridgeChannel;
  /** 发给信息 */
  sendMsg?: string;
  /** 发单备注 */
  sendMsgComment?: string;
  /** 发单费用 */
  fee?: number;

  /** 桥备注 */
  bridgeComment?: string;
};

export type RealTradeValueType = {
  /** bid机构（真实交易方） */
  bidInst?: InstitutionTiny;
  /** bid机构下交易员（真实交易方） */
  bidTrader?: Trader;
  /** bid机构下交易员标签（真实交易方） */
  bidTraderTag?: string;
  /** bid方向是否隐藏备注 */
  bidHideComment?: boolean;
  /** bid方向发单机构 */
  bidSendOrderInstList?: SendOrderInst[];
  /** bid方向成交时间 */
  bidDealTime?: string;
  /** bid是否被代付 */
  flagBidPayForInst?: boolean;

  /** ofr机构（真实交易方） */
  ofrInst?: InstitutionTiny;
  /** ofr机构下交易员（真实交易方） */
  ofrTrader?: Trader;
  /** ofr机构下交易员标签（真实交易方） */
  ofrTraderTag?: string;
  /** ofr方向是否隐藏备注 */
  ofrHideComment?: boolean;
  /** ofr方向发单机构 */
  ofrSendOrderInstList?: SendOrderInst[];
  /** ofr方向成交时间 */
  ofrDealTime?: string;
  /** ofr是否被代付 */
  flagOfrPayForInst?: boolean;
};

/** 多桥桥编辑窗口初始状态 */
export type MulModalInitialState = {
  /** 成交单父id */
  parentDealId: string;
  /** 成交单总量 */
  volume?: number;
  /** 面板来源 */
  source?: Source;
  /** 债券第一段到期日(时间戳) */
  firstMaturityDate?: string;
  /** 发给信息 */
  defaultSendMsg?: { traderId: string; sendMsg: string }[];
  /** 默认桥信息 */
  defaultBridgeValue?: MulFormState[];
  /** 真实交易双方信息 */
  defaultRealTradeValue?: RealTradeValueType;
  /** 过桥场景当前的桥的交易员id */
  currentBridgeTraderId?: string;
  /** 交易方向 */
  dealSide?: Side;
};

/** 无桥窗口初始状态 */
export type NoneModalInitialState = {
  /** 成交单id */
  receiptDealId: string;
  /** parentId */
  parentDealId: string;
  /** 成交单总量 */
  volume?: number;
  /** 债券第一段到期日(时间戳) */
  firstMaturityDate?: string;
  /** ofr真实交易机构 */
  ofrInst?: InstitutionTiny;
  /** ofr机构下交易员 */
  ofrTrader?: Trader;
  /** ofr机构下交易员标签（真实交易方） */
  ofrTraderTag?: string;
  /** ofr是否被代付 */
  ofrIsPaid?: boolean;
  /** bid真实交易机构 */
  bidInst?: InstitutionTiny;
  /** bid机构下交易员 */
  bidTrader?: Trader;
  /** bid机构下交易员标签（真实交易方） */
  bidTraderTag?: string;
  /** bid是否被代付 */
  bidIsPaid?: boolean;
  /** 成交日期(时间戳) */
  dealTime?: string;
  /** 方向 */
  direction?: TradeDirection;
  /** 发单信息 */
  sendMsg?: string;
  /** 渠道 */
  channel?: BridgeChannel;
  /** 费用 */
  cost?: number;
  /** 交割方式 */
  settlement?: string;
  /** 发单备注 */
  sendMsgComment?: string;
  /** 是否隐藏备注 */
  hideComment?: boolean;
  /** 发单机构 */
  sendOrderInst?: SendOrderInst[];
  /** 桥消息是否变更 */
  flagBridgeInfoChanged?: boolean;

  /** 面板来源 */
  source?: Source;
};

export type SendInstType = { inst?: InstitutionTiny; volume?: string };

export type Params = Omit<
  ReceiptDealUpdateBridge.Request,
  'parent_deal_id' | 'bid_send_order_inst_info_list' | 'ofr_send_order_inst_info_list'
> & {
  bid_send_order_inst_info_list: SendInstType[];
  ofr_send_order_inst_info_list: SendInstType[];
};

export type CheckInstFeeParams = {
  firstMaturityDate?: string;
  instId?: string;
  dealTime?: string;
};

export type RealTradeParams = Pick<
  RealTradeValueType,
  'bidHideComment' | 'ofrHideComment' | 'flagBidPayForInst' | 'flagOfrPayForInst'
> & {
  bidSendOrderInstList: SendInstType[];
  ofrSendOrderInstList: SendInstType[];
};

export type BridgeFormStateParams = MulFormState;

export type SingBridgeFormState = Omit<
  FormState,
  'parent_deal_id' | 'bidSendOrderInstList' | 'ofrSendOrderInstList'
> & {
  bidSendOrderInstList: SendInstType[];
  ofrSendOrderInstList: SendInstType[];
};
