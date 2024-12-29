import { TableSorter } from '@fepkg/components/Table';
import { ApprovalSortedField } from '@fepkg/services/types/bds-enum';
import { atomWithReset } from 'jotai/utils';
import {
  DEFAULT_APPROVAL_DEAL_LIST_RELATED_FILTER_VALUE,
  DEFAULT_APPROVAL_HISTORY_LIST_RELATED_FILTER_VALUE,
  DEFAULT_APPROVAL_LIST_INPUT_FILTER_VALUE,
  DEFAULT_APPROVAL_LIST_RELATED_FILTER_VALUE
} from '@/pages/ApprovalList/constants/filter';
import { ApprovalListType } from '@/pages/ApprovalList/types';

// 表格 relatedFilterValue 相关状态
export const approvalListRelatedFilterValueAtom = atomWithReset(DEFAULT_APPROVAL_LIST_RELATED_FILTER_VALUE);

export const approvalHistoryListRelatedFilterValueAtom = atomWithReset(
  DEFAULT_APPROVAL_HISTORY_LIST_RELATED_FILTER_VALUE
);

export const approvalDealListRelatedFilterValueAtom = atomWithReset(DEFAULT_APPROVAL_DEAL_LIST_RELATED_FILTER_VALUE);

export const approvalRelatedFilterValueAtomMap = {
  [ApprovalListType.Approval]: approvalListRelatedFilterValueAtom,
  [ApprovalListType.History]: approvalHistoryListRelatedFilterValueAtom,
  [ApprovalListType.Deal]: approvalDealListRelatedFilterValueAtom
};

// 表格 inputFilterValue 相关状态
export const approvalListInputFilterValueAtom = atomWithReset(DEFAULT_APPROVAL_LIST_INPUT_FILTER_VALUE);

// 表格 page 相关状态
export const approvalListPageAtom = atomWithReset(1);

export const approvalListPageSizeAtom = atomWithReset(30);

export const approvalListTableSelectIdsAtom = atomWithReset<string[]>([]);

export const approvalListTableNeedUpdate = atomWithReset(false);

// 表格 sorter 相关状态
export const approvalListTableSorterAtom = atomWithReset<TableSorter<ApprovalSortedField> | undefined>(void 0);
