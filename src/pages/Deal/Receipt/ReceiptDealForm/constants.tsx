import { ButtonIconProps } from '@fepkg/components/Button';
import { ModalUtilProps } from '@fepkg/components/Modal';
import { IconBridgeText, IconPayfor } from '@fepkg/icon-park-react';
import { BrokerageType, ProductType, ReceiptDealStatus } from '@fepkg/services/types/enum';
import { ReceiptDealTradeFlag } from './types';

export const DEFAULT_PAY_FOR = {
  flag_pay_for: false,
  pay_for_inst_id: '',
  pay_for_city: '',
  pay_for_trader_id: '',
  pay_for_trader_tag: '',
  flag_pay_for_nc: false,
  pay_for_nc: ''
};

export const FlagStyleMap: Record<ReceiptDealTradeFlag, ButtonIconProps> = {
  [ReceiptDealTradeFlag.Real]: { type: 'orange', checked: false, icon: <IconBridgeText size={20} /> },
  [ReceiptDealTradeFlag.Bridge]: { type: 'orange', checked: true, icon: <IconBridgeText size={20} /> },
  [ReceiptDealTradeFlag.Payfor]: { type: 'danger', checked: true, icon: <IconPayfor size={20} /> }
};

export const BrokerageTypeMap = {
  [BrokerageType.BrokerageTypeN]: 'N(0)',
  [BrokerageType.BrokerageTypeB]: 'Bridge',
  [BrokerageType.BrokerageTypeC]: 'CNY',
  [BrokerageType.BrokerageTypeR]: '双倍'
};

/** 表单不可编辑的成交状态 */
export const FORM_DISABLED_STATUES = new Set([
  ReceiptDealStatus.ReceiptDealToBeHandOver,
  ReceiptDealStatus.ReceiptDealDestroyed,
  ReceiptDealStatus.ReceiptDealDeleted
]);

export enum LogReceiptDealFlowPhase {
  Enter = 'Receipt-Deal-Flow-Phase-Enter',
  Submit = 'Receipt-Deal-Flow-Phase-Submit',
  Success = 'Receipt-Deal-Flow-Phase-Success'
}

export enum ReceiptDealStatusCode {
  EditStatusInvalid = 24018,
  BrokerInvalid = 24019,
  AssociateBridgeInvalid = 24020,
  TraderInvalid = 24021,
  InstInvalid = 24022,
  BIDInstInvalid = 24023,
  BIDTraderInvalid = 24024,
  BIDBrokerInvalid = 24025,
  BIDPayForInstInvalid = 24026,
  BIDPayForTraderInvalid = 24027,
  BridgeInstInvalid = 24028,
  BridgeTraderInvalid = 24029,
  BridgeBrokerInvalid = 24030,
  OFRInstInvalid = 24031,
  OFRTraderInvalid = 24032,
  OFRBrokerInvalid = 24033,
  OFRPayForInstInvalid = 24034,
  OFRPayForTraderInvalid = 24035,

  DifferentTradeElementOfDeleteBridgeError = 24047,
  DifferentTradeElementOfAssociateBridgeError = 24048,
  SpotPricingDealOfCreateBridgeError = 24049,
  BridgeInfoOfDeleteBridgeError = 24050,
  BridgeInfoOfAssociateBridgeError = 24051,
  DealsNotOneLinkError = 24052,
  SingleDealOfDelBridgeError = 24053,
  LoseInstInfoOfAssociateBridgeError = 24054,
  SameInstInfoOfAssociateBridgeError = 24055,
  SameInstInfoOfSubmitError = 24056,
  SameBridgeInstError = 24057,
  SameTraderInfoOfSubmitError = 24058,

  LackInstOfDeleteBridgeError = 24061,
  LackInstOfAssociateBridgeError = 24062,

  BIDInstTraderNotMatch = 24067,
  BIDPayforInstTraderNotMatch = 24068,
  OFRInstTraderNotMatch = 24069,
  OFRPayforInstTraderNotMatch = 24070,
  BridgeInstTraderNotMatch = 24071
}

export const ReceiptDealErrorMsgMap = {
  [ReceiptDealStatusCode.EditStatusInvalid]: '当前成交单状态不可编辑！',
  [ReceiptDealStatusCode.BrokerInvalid]: '经纪人（B/O）无效！请重新输入！',
  [ReceiptDealStatusCode.AssociateBridgeInvalid]: '加桥已达上限，不可提交！',
  [ReceiptDealStatusCode.TraderInvalid]: '交易员（B/O）无效！请重新输入！',
  [ReceiptDealStatusCode.InstInvalid]: '机构（B/O）无效！请重新输入！',

  [ReceiptDealStatusCode.BIDInstInvalid]: '机构（B）无效！请重新输入！',
  [ReceiptDealStatusCode.BIDTraderInvalid]: '交易员（B）无效！请重新输入！',
  [ReceiptDealStatusCode.BIDBrokerInvalid]: '经纪人（B）无效！请重新输入！',
  [ReceiptDealStatusCode.BIDPayForInstInvalid]: '代付机构（B）无效！请重新输入！',
  [ReceiptDealStatusCode.BIDPayForTraderInvalid]: '代付机构（B）交易员无效！请重新输入！',
  [ReceiptDealStatusCode.BridgeInstInvalid]: '桥机构无效！请重新输入！',
  [ReceiptDealStatusCode.BridgeTraderInvalid]: '桥交易员无效！请重新输入！',
  [ReceiptDealStatusCode.BridgeBrokerInvalid]: '桥经纪人无效！请重新输入！',
  [ReceiptDealStatusCode.OFRInstInvalid]: '机构（O）无效！请重新输入！',
  [ReceiptDealStatusCode.OFRTraderInvalid]: '交易员（O）无效！请重新输入！',
  [ReceiptDealStatusCode.OFRBrokerInvalid]: '经纪人（O）无效！请重新输入！',
  [ReceiptDealStatusCode.OFRPayForInstInvalid]: '代付机构（O）无效！请重新输入！',
  [ReceiptDealStatusCode.OFRPayForTraderInvalid]: '代付机构（O）交易员无效！请重新输入！',

  [ReceiptDealStatusCode.DifferentTradeElementOfDeleteBridgeError]: '结算方式不一致，删桥失败！',
  [ReceiptDealStatusCode.DifferentTradeElementOfAssociateBridgeError]: '交易要素不一致，关联失败！',
  [ReceiptDealStatusCode.SpotPricingDealOfCreateBridgeError]: '点价生成的成交单，不可关联！',
  [ReceiptDealStatusCode.BridgeInfoOfDeleteBridgeError]: '机构交易员不满足删桥条件，删桥失败！',
  [ReceiptDealStatusCode.BridgeInfoOfAssociateBridgeError]: '过桥信息不一致，关联失败！',
  [ReceiptDealStatusCode.DealsNotOneLinkError]: '机构交易员不满足删桥条件，删桥失败！',
  [ReceiptDealStatusCode.SingleDealOfDelBridgeError]: '机构交易员不满足删桥条件，删桥失败！',

  [ReceiptDealStatusCode.LoseInstInfoOfAssociateBridgeError]: '缺少机构信息，关联失败！',
  [ReceiptDealStatusCode.SameInstInfoOfAssociateBridgeError]: '存在相同机构，关联失败！',
  [ReceiptDealStatusCode.SameInstInfoOfSubmitError]: '当前成交中有桥机构重复，不可提交！',
  [ReceiptDealStatusCode.SameTraderInfoOfSubmitError]: '存在相同交易员，不可提交！',

  [ReceiptDealStatusCode.LackInstOfDeleteBridgeError]: '缺少机构信息，删桥失败！',
  [ReceiptDealStatusCode.LackInstOfAssociateBridgeError]: '缺少机构信息，关联失败',

  [ReceiptDealStatusCode.BIDInstTraderNotMatch]: '交易员(B)与机构不匹配！请重新输入！',
  [ReceiptDealStatusCode.BIDPayforInstTraderNotMatch]: '代付机构交易员(B)与机构不匹配！请重新输入！',
  [ReceiptDealStatusCode.OFRInstTraderNotMatch]: '交易员(O)与机构不匹配！请重新输入！',
  [ReceiptDealStatusCode.OFRPayforInstTraderNotMatch]: '代付机构交易员(O)与机构不匹配！请重新输入！',
  [ReceiptDealStatusCode.BridgeInstTraderNotMatch]: '桥交易员与机构不匹配！请重新输入！'
};

export enum ModalOptionsType {
  NoNeedModal = 'NoNeedModal',
  ClearPayFor = 'ClearPayFor',
  ResetStatus = 'ResetStatus',
  Unlink = 'Unlink',
  SyncEdit = 'SyncEdit',
  ClearPayForSyncEdit = 'ClearPayForSyncEdit',
  ResetStatusClearPayFor = 'ResetStatusClearPayFor',
  ResetStatusUnlink = 'ResetStatusUnlink',
  ResetStatusClearPayForSyncEdit = 'ResetStatusClearPayForSyncEdit',
  ResetStatusSyncEdit = 'ResetStatusSyncEdit'
}

export const WARNING_MODAL_OPTIONS_MAP = new Map<ModalOptionsType, ModalUtilProps>([
  [
    ModalOptionsType.ClearPayFor,
    {
      title: '清空代付费用',
      content: '将联动清空成交单代付费用，确定变更吗？'
    }
  ],
  [
    ModalOptionsType.ResetStatus,
    {
      title: '重置状态',
      content: '将重置成交单状态，确定变更吗？'
    }
  ],
  [
    ModalOptionsType.SyncEdit,
    {
      title: '编辑同步',
      content: '含桥单提交将同步编辑信息，确定变更吗？'
    }
  ],
  [
    ModalOptionsType.Unlink,
    {
      title: '取消成交单关联',
      content: '将联动取消以下成交单关联，确定变更吗？'
    }
  ],
  [
    ModalOptionsType.ResetStatusClearPayFor,
    {
      title: '要素变更',
      content: '将重置成交单状态，并联动清空成交单代付费用，确定变更吗？'
    }
  ],
  [
    ModalOptionsType.ClearPayForSyncEdit,
    {
      title: '要素变更',
      content: '将联动清空成交单代付费用，并同步编辑信息，确定变更吗？'
    }
  ],
  [
    ModalOptionsType.ResetStatusSyncEdit,
    {
      title: '要素变更',
      content: '将重置成交单状态，并同步编辑信息，确定变更吗？'
    }
  ],
  [
    ModalOptionsType.ResetStatusUnlink,
    {
      title: '要素变更',
      content: '将重置成交单状态，并联动取消以下成交单关联，确定变更吗？'
    }
  ],
  [
    ModalOptionsType.ResetStatusClearPayForSyncEdit,
    {
      title: '要素变更',
      content: '将重置成交单状态，联动清空成交单代付费用，并同步编辑信息，确定变更吗？'
    }
  ]
]);

export const noExerciseSettlementProductTypeSet = new Set([ProductType.NCD]);
