import { CheckboxOption } from '@fepkg/components/Checkbox';
import { DealDateType, ReceiptDealStatus } from '@fepkg/services/types/enum';
import {
  BridgeFilterState,
  InternalFilterState,
  ReceiptDealFilterState,
  ReceiptDealInputFilter,
  ReceiptDealRelatedFilter
} from '@/pages/Deal/Receipt/ReceiptDealPanel/types';

export const receiptDealUnfinishedStatuses = [
  ReceiptDealStatus.ReceiptDealToBeHandOver,
  ReceiptDealStatus.ReceiptDealToBeConfirmed,
  ReceiptDealStatus.ReceiptDealToBeSubmitted,
  ReceiptDealStatus.ReceiptDealSubmitApproval,
  ReceiptDealStatus.ReceiptDealToBeExamined,
  ReceiptDealStatus.ReceiptDealNoPass
];

export const receiptDealFinishedStatuses = [
  ReceiptDealStatus.ReceiptDealPass,
  ReceiptDealStatus.ReceiptDealDestroyed,
  ReceiptDealStatus.ReceiptDealDeleted
];

export const DEFAULT_RECEIPT_DEAL_RELATED_FILTER_VALUE: ReceiptDealRelatedFilter = {
  finished: [],
  receipt_deal_status: void 0,
  flag_internal: void 0,
  flag_bridge: void 0,
  flag_self: void 0,
  date_range: void 0, // 五个工作日内
  date_type: DealDateType.DealTime
};

export const DEFAULT_RECEIPT_DEAL_INPUT_FILTER_VALUE: ReceiptDealInputFilter = {
  order_no: void 0,
  bridge_code: void 0,
  seq_number: void 0,
  internal_code: void 0
};

export const receiptDealFinishedOptions: CheckboxOption[] = [
  { label: '未完成', value: ReceiptDealFilterState.Unfinished },
  { label: '已完成', value: ReceiptDealFilterState.Finished }
];

export const internalOptions: CheckboxOption[] = [
  { label: '内部成交', value: InternalFilterState.Internal },
  { label: '非内部成交', value: InternalFilterState.NonInternal }
];

export const bridgeOptions: CheckboxOption[] = [
  { label: '过桥', value: BridgeFilterState.Bridge },
  { label: '非过桥', value: BridgeFilterState.NonBridge }
];
