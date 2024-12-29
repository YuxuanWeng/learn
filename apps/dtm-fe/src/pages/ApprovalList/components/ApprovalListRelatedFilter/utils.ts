import {
  BCOProductMarketOptions,
  BNCProductMarketOptions,
  NCDProductMarketOptions
} from '@fepkg/business/constants/options';
import { CheckboxOption } from '@fepkg/components/Checkbox';
import { ProductType } from '@fepkg/services/types/bdm-enum';
import {
  ApprovalListRelatedFilter,
  ApprovalStatus,
  ApprovalType,
  FlagNCStatus,
  FlagUrgentStatus,
  HistoryApprovalStatus,
  HistoryPassType
} from '@/pages/ApprovalList/types';

export const getProductOptions = (productTypeList?: ProductType[]) => {
  const options: CheckboxOption[] = [];
  if (productTypeList?.includes(ProductType.BNC)) {
    options.push(...BNCProductMarketOptions);
  }
  if (productTypeList?.includes(ProductType.BCO)) {
    options.push(...BCOProductMarketOptions);
  }
  if (productTypeList?.includes(ProductType.NCD)) {
    options.push(...NCDProductMarketOptions);
  }
  return options;
};

export const getApprovalListFilterHandledValue = (filterValue: ApprovalListRelatedFilter) => {
  if (filterValue.handled === false) {
    return [ApprovalStatus.ToBeExaminedByMyself];
  }
  if (filterValue.handled) {
    return [ApprovalStatus.HasExamined];
  }
  return [];
};

export const getHistoryApprovalListFilterHandledValue = (filterValue: ApprovalListRelatedFilter) => {
  if (filterValue.completed === false) {
    return [HistoryApprovalStatus.InCompleted];
  }
  if (filterValue.completed) {
    return [HistoryApprovalStatus.Completed];
  }
  return [];
};

export const getApprovalListFilterUrgentValue = (filterValue: ApprovalListRelatedFilter) => {
  if (filterValue.flag_urgent) {
    return [FlagUrgentStatus.Urgent];
  }
  if (filterValue.flag_urgent === false) {
    return [FlagUrgentStatus.NonUrgent];
  }
  return [];
};

export const getApprovalListFilterNCValue = (filterValue: ApprovalListRelatedFilter) => {
  if (filterValue.is_nc === false) {
    return [FlagNCStatus.False];
  }
  if (filterValue.is_nc) {
    return [FlagNCStatus.True];
  }
  return [];
};

export const getApprovalListFilterExamineTypeValue = (filterValue: ApprovalListRelatedFilter) => {
  if (filterValue.is_advanced_approval === false) {
    return [ApprovalType.Normal];
  }
  if (filterValue.is_advanced_approval) {
    return [ApprovalType.Advanced];
  }
  return [];
};

export const getApprovalListFilterHistoryPassValue = (filterValue: ApprovalListRelatedFilter) => {
  if (filterValue.flag_history_pass === false) {
    return [HistoryPassType.False];
  }
  if (filterValue.flag_history_pass) {
    return [HistoryPassType.True];
  }
  return [];
};
