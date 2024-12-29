import {
  ReceiptDeal,
  ReceiptDealPayForOp,
  ReceiptDealTrade,
  ReceiptDealTradeOp
} from '@fepkg/services/types/bds-common';
import {
  DealMarketType,
  Direction,
  ExerciseType,
  ReceiptDealTradeInstBrokerageComment,
  SettlementMode,
  Side
} from '@fepkg/services/types/bds-enum';
import { User } from '@fepkg/services/types/common';
import { ReceiptDealMulAdd } from '@fepkg/services/types/receipt-deal/mul-add';
import { ReceiptDealUpdate } from '@fepkg/services/types/receipt-deal/update';
import { PriceState } from '@/components/business/PriceGroup';

export enum ReceiptDealFormWidth {
  Default = 1200 + 2 + 2,
  DoubleBridge = 1400 + 2 + 2
}

export enum ReceiptDealFormMode {
  Add = 'add',
  Edit = 'edit',
  Join = 'join'
}

export type ReceiptDealFormDialogContext = {
  /** 操作模式 */
  mode: ReceiptDealFormMode;
  /** 该单是否可编辑 */
  editable: boolean | undefined;
  /** 默认带入的成交单信息 */
  defaultReceiptDeal?: Partial<ReceiptDeal>;
  /** 窗口打开时间戳 */
  timestamp?: number;
};

export type SideType = Side.SideBid | Side.SideOfr;

export type IUpdateReceiptDealWithoutId = Omit<ReceiptDealUpdate.UpdateReceiptDeal, 'receipt_deal_id'>;

/** 真实交易对手方状态，true 表示该方向为真实交易对手方，反之则可能为 「桥」 或 「代」 */
export type ReceiptDealRealTradeStatus = { [key in SideType]: boolean };

/** 交易对手方标识 */
export enum ReceiptDealTradeFlag {
  /** 交易真实对手方，展现形式为点灭的 「桥」 标识 */
  Real = 'real',
  /** 桥机构，展现形式为点亮的 「桥」 标识 */
  Bridge = 'bridge',
  /** 代付机构，展现形式为点亮的 「代」 标识 */
  Payfor = 'payfor'
}

export type CheckBridgeFlagChangeByTradeInfoParams = {
  curTrade?: ReceiptDealTradeOp;
  oldTrade?: ReceiptDealTrade;
  prevFlag: ReceiptDealTradeFlag;
  curFlag: ReceiptDealTradeFlag;
};

export type CheckBridgeFlagChangeParams = {
  curData?: ReceiptDealMulAdd.CreateReceiptDeal;
  oldData?: Partial<ReceiptDeal>;
  prevFlag: ReceiptDealTradeFlag;
  curFlag: ReceiptDealTradeFlag;
};

export type IUpsertReceiptDeal = ReceiptDealMulAdd.CreateReceiptDeal | ReceiptDealUpdate.UpdateReceiptDeal;

export type ReceiptDealFormSideCommentState = {
  /** 佣金备注 */
  brokerageComment: ReceiptDealTradeInstBrokerageComment;
  /** 是否禁用佣金备注选择 */
  brokerageCommentDisabled: boolean;
  /** 机构特别细节 */
  instSpecial: string;
};

export type ReceiptDealFormState = {
  /** 成交方向 */
  direction: Direction;
  /** 市场 */
  dealMarketType: DealMarketType;
  /** 到期收益率 */
  yield: string;
  /** 行权收益率 */
  yieldToExecution: string;
  /** 利差 */
  spread: string;
  /** 全价 */
  fullPrice: string;
  /** 净价 */
  cleanPrice: string;
  /** 报价量（券面总额） */
  volume: string;
  /** 交易时间 */
  dealTime: moment.Moment;
  /** 后台信息 */
  backendMessage: string;
  /** 特别细节 */
  otherDetail: string;
  /** bid 佣金备注状态 */
  bidCommentState: ReceiptDealFormSideCommentState;
  /** ofr 佣金备注状态 */
  ofrCommentState: ReceiptDealFormSideCommentState;
  /** 是否为内部报价 */
  internal: boolean | undefined;
  /** 是否发市场 */
  sendMarket: boolean;
  /** 结算模式 */
  settlementMode: SettlementMode;
  /** 结算金额 */
  settlementAmount: string;
  /** 行权/到期 */
  exercise: ExerciseType;
};

type Booleanify<T> = {
  [P in keyof T]: boolean;
};

export type ReceiptDealFormError = Booleanify<Partial<ReceiptDealFormState>> &
  Booleanify<Partial<PriceState>> & {
    bond?: boolean;
  };

export type ReceiptDealBridgeErrorState = {
  bridgeIndex: number;
  instError?: boolean;
  traderError?: boolean;
  brokerError?: boolean;
};

export type ReceiptDealTradeInfoErrorState = {
  [k in SideType]?: {
    nc?: boolean;
    brokeragePercent?: boolean;
    inst?: boolean;
    trader?: boolean;

    broker?: boolean;
    broker_b?: boolean;
    broker_c?: boolean;
    broker_d?: boolean;

    payForInst?: boolean;
    payForTrader?: boolean;
    payForNc?: boolean;
  };
};

export type ReceiptDealFormErrorStateType = {
  formErrorState: ReceiptDealFormError;
  traderErrorState: ReceiptDealTradeInfoErrorState;
  bridgeErrorState?: ReceiptDealBridgeErrorState;
};

export const OmitReceiptDealTradeKeys = [
  'inst',
  'city',
  'trader',
  'broker',
  'broker_b',
  'broker_c',
  'broker_d',
  'broker_percent',
  'broker_percent_b',
  'broker_percent_c',
  'broker_percent_d',
  'flag_bridge',
  'flag_pay_for_inst',
  'flag_in_bridge_inst_list',
  'inst_brokerage_comment',
  'inst_special'
] as const;

export type ReceiptDealTradeState = Omit<ReceiptDealTradeOp, (typeof OmitReceiptDealTradeKeys)[number]> & {
  flag: ReceiptDealTradeFlag;
  pay_for_info: ReceiptDealPayForOp;
};

export type ReceiptDealBrokerState = {
  key: string;
  broker?: User;
  percent?: number;
};
