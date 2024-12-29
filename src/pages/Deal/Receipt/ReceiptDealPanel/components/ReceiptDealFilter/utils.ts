import { ReceiptDealSearch } from '@fepkg/services/types/receipt-deal/search';
import {
  receiptDealFinishedStatuses,
  receiptDealUnfinishedStatuses
} from '@/pages/Deal/Receipt/ReceiptDealPanel/constants/filter';
import {
  BridgeFilterState,
  InternalFilterState,
  ReceiptDealFilterState
} from '@/pages/Deal/Receipt/ReceiptDealPanel/types';

export const getReceiptDealFilterStatusValue = (filterValue: ReceiptDealSearch.ReceiptDealTableRelatedFilter) => {
  if (filterValue.receipt_deal_status?.some(s => receiptDealFinishedStatuses.includes(s))) {
    return [ReceiptDealFilterState.Finished];
  }
  if (filterValue.receipt_deal_status?.some(s => receiptDealUnfinishedStatuses.includes(s))) {
    return [ReceiptDealFilterState.Unfinished];
  }
  return [];
};

export const getReceiptDealFilterInternalValue = (filterValue: ReceiptDealSearch.ReceiptDealTableRelatedFilter) => {
  if (filterValue.flag_internal) {
    return [InternalFilterState.Internal];
  }
  if (filterValue.flag_internal === false) {
    return [InternalFilterState.NonInternal];
  }
  return [];
};

export const getReceiptDealFilterBridgeValue = (filterValue: ReceiptDealSearch.ReceiptDealTableRelatedFilter) => {
  if (filterValue.flag_bridge) {
    return [BridgeFilterState.Bridge];
  }
  if (filterValue.flag_bridge === false) {
    return [BridgeFilterState.NonBridge];
  }
  return [];
};
