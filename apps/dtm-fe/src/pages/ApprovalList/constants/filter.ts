import { AdvancedApprovalTypeOptions } from '@fepkg/business/constants/options';
import { CheckboxOption } from '@fepkg/components/Checkbox';
import { AdvancedApprovalType, BrokerageType, ReceiptDealStatus } from '@fepkg/services/types/enum';
import moment from 'moment';
import {
  ApprovalListInputFilter,
  ApprovalListRelatedFilter,
  ApprovalStatus,
  ApprovalType,
  BridgeType,
  FlagNCStatus,
  FlagUrgentStatus,
  HistoryApprovalStatus,
  HistoryPassType
} from '@/pages/ApprovalList/types';

export const ApprovalStatusOptions: CheckboxOption[] = [
  { label: '待我审核', value: ApprovalStatus.ToBeExaminedByMyself },
  { label: '已处理', value: ApprovalStatus.HasExamined }
];

export const HistoryApprovalStatusOptions: CheckboxOption[] = [
  { label: '未完成', value: HistoryApprovalStatus.InCompleted },
  { label: '已完成', value: HistoryApprovalStatus.Completed }
];

export const ToBeExaminedByMyself = [
  ReceiptDealStatus.ReceiptDealSubmitApproval,
  ReceiptDealStatus.ReceiptDealToBeExamined
];

export const HasExamined = [
  ReceiptDealStatus.ReceiptDealSubmitApproval,
  ReceiptDealStatus.ReceiptDealToBeExamined,
  ReceiptDealStatus.ReceiptDealNoPass,
  ReceiptDealStatus.ReceiptDealPass,
  ReceiptDealStatus.ReceiptDealDestroyed
];

export const Completed = [ReceiptDealStatus.ReceiptDealPass, ReceiptDealStatus.ReceiptDealDestroyed];
export const InCompleted = [
  ReceiptDealStatus.ReceiptDealToBeHandOver,
  ReceiptDealStatus.ReceiptDealToBeConfirmed,
  ReceiptDealStatus.ReceiptDealToBeSubmitted,
  ReceiptDealStatus.ReceiptDealSubmitApproval,
  ReceiptDealStatus.ReceiptDealToBeExamined,
  ReceiptDealStatus.ReceiptDealNoPass
];

export const ReceiptDealStatusOptions = [
  { label: '送审中', value: ReceiptDealStatus.ReceiptDealSubmitApproval },
  { label: '待审核', value: ReceiptDealStatus.ReceiptDealToBeExamined },
  { label: '已通过', value: ReceiptDealStatus.ReceiptDealPass },
  { label: '未通过', value: ReceiptDealStatus.ReceiptDealNoPass },
  { label: '已毁单', value: ReceiptDealStatus.ReceiptDealDestroyed }
];

export const HistoryReceiptDealStatusOptions = [
  { label: '待移交', value: ReceiptDealStatus.ReceiptDealToBeHandOver },
  { label: '待确认', value: ReceiptDealStatus.ReceiptDealToBeConfirmed },
  { label: '待提交', value: ReceiptDealStatus.ReceiptDealToBeSubmitted },
  { label: '送审中', value: ReceiptDealStatus.ReceiptDealSubmitApproval },
  { label: '待审核', value: ReceiptDealStatus.ReceiptDealToBeExamined },
  { label: '未通过', value: ReceiptDealStatus.ReceiptDealNoPass },
  { label: '已通过', value: ReceiptDealStatus.ReceiptDealPass },
  { label: '已毁单', value: ReceiptDealStatus.ReceiptDealDestroyed }
];

export const UrgentOptions: CheckboxOption[] = [
  { label: '紧急', value: FlagUrgentStatus.Urgent },
  { label: '非紧急', value: FlagUrgentStatus.NonUrgent }
];

export const NCOptions: CheckboxOption[] = [
  { label: '是', value: FlagNCStatus.True },
  { label: '否', value: FlagNCStatus.False }
];

export const ExamineTypeOptions: CheckboxOption[] = [
  { label: '普通审核', value: ApprovalType.Normal },
  { label: '高级审核', value: ApprovalType.Advanced }
];

export const HistoryPassOptions: CheckboxOption[] = [
  { label: '是', value: HistoryPassType.True },
  { label: '否', value: HistoryPassType.False }
];

export const PrintOptions: CheckboxOption[] = [
  { label: '已打印', value: true },
  { label: '未打印', value: false }
];

export const AdvancedExamineTypeOptions = AdvancedApprovalTypeOptions.map(i => {
  if (i.value === AdvancedApprovalType.AdvancedApprovalTypeSpecialBrokerage) {
    return { label: '特殊佣金', value: AdvancedApprovalType.AdvancedApprovalTypeSpecialBrokerage };
  }
  return i;
});

export const BrokerageTypeOptions: CheckboxOption[] = [
  { label: '正常收佣(C)', value: BrokerageType.BrokerageTypeC },
  { label: '过桥(B)', value: BrokerageType.BrokerageTypeB },
  { label: '免佣(N)', value: BrokerageType.BrokerageTypeN },
  { label: '特殊(R)', value: BrokerageType.BrokerageTypeR }
];

export const BridgeOptions: CheckboxOption[] = [
  { label: '过桥', value: BridgeType.Bridge },
  { label: '非过桥', value: BridgeType.NonBridge }
];

export const DEFAULT_APPROVAL_LIST_RELATED_FILTER_VALUE: ApprovalListRelatedFilter = {
  product_market_list: void 0,
  handled: false,
  status_list: void 0,
  flag_urgent: void 0,
  is_nc: void 0,
  is_advanced_approval: void 0,
  type_list: void 0,
  brokerage_type_list: void 0,
  brokerage_comment_list: void 0,
  traded_date_range: {},
  flag_history_pass: void 0,
  flag_printed: void 0
};
export const DEFAULT_APPROVAL_HISTORY_LIST_RELATED_FILTER_VALUE: ApprovalListRelatedFilter = {
  ...DEFAULT_APPROVAL_LIST_RELATED_FILTER_VALUE,
  completed: true,
  status_list: [ReceiptDealStatus.ReceiptDealPass],
  handled: void 0,
  traded_date_range: {
    start_time: moment().startOf('day').valueOf().toString(),
    end_time: moment().endOf('day').valueOf().toString()
  },
  flag_printed: void 0
};

export const DEFAULT_APPROVAL_DEAL_LIST_RELATED_FILTER_VALUE: ApprovalListRelatedFilter = {
  ...DEFAULT_APPROVAL_LIST_RELATED_FILTER_VALUE,
  handled: void 0,
  traded_date_range: {
    start_time: moment().startOf('day').valueOf().toString(),
    end_time: moment().endOf('day').valueOf().toString()
  },
  flag_printed: void 0
};

export const DEFAULT_APPROVAL_LIST_INPUT_FILTER_VALUE: ApprovalListInputFilter = {
  receipt_deal_order_no: void 0,
  bridge_code: void 0,
  trader_id: void 0,
  trader_side: void 0,
  inst_id: void 0,
  inst_is_bridge_inst: void 0,
  inst_side: void 0,
  bond_key: void 0,
  deal_price: void 0,
  volume: void 0,
  inst_user_input: void 0,
  trader_user_input: void 0
};

export const DisapprovalReceiptDealStatusSet = new Set([
  ReceiptDealStatus.ReceiptDealToBeExamined,
  ReceiptDealStatus.ReceiptDealSubmitApproval,
  ReceiptDealStatus.ReceiptDealPass
]);
