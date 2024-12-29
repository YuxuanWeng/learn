import { useEffect, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { AccessCode } from '@fepkg/services/access-code';
import { ReceiptDeal } from '@fepkg/services/types/common';
import { useAuth } from '@/providers/AuthProvider';
import { useMemoizedFn } from 'ahooks';
import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import { createContainer } from 'unstated-next';
import { useImmer } from 'use-immer';
import {
  approvalDealListRelatedFilterValueAtom,
  approvalHistoryListRelatedFilterValueAtom,
  approvalListInputFilterValueAtom,
  approvalListPageAtom,
  approvalListPageSizeAtom,
  approvalListRelatedFilterValueAtom,
  approvalListTableSelectIdsAtom,
  approvalListTableSorterAtom,
  approvalRelatedFilterValueAtomMap
} from '@/pages/ApprovalList/atoms';
import { useReceiptDealApprovalTableData } from '@/pages/ApprovalList/components/ApprovalTable/useTableData';
import { transform2ReceiptDealCache } from '@/pages/ApprovalList/components/ApprovalTable/utils';
import {
  DEFAULT_APPROVAL_DEAL_LIST_RELATED_FILTER_VALUE,
  DEFAULT_APPROVAL_HISTORY_LIST_RELATED_FILTER_VALUE,
  DEFAULT_APPROVAL_LIST_INPUT_FILTER_VALUE,
  DEFAULT_APPROVAL_LIST_RELATED_FILTER_VALUE
} from '@/pages/ApprovalList/constants/filter';
import { ApprovalListInputFilter, ApprovalListRelatedFilter, ApprovalListType } from '@/pages/ApprovalList/types';
import { useRoleSettingList } from '@/pages/BackendSetting/RoleSetting/hooks';

type InitialState = {
  type: ApprovalListType;
};

export const ApprovalTableContainer = createContainer((initialState?: InitialState) => {
  const type = initialState?.type ?? ApprovalListType.Approval;

  const { pathname } = useLocation();
  const { access } = useAuth();
  const setListRelated = useSetAtom(approvalListRelatedFilterValueAtom);
  const setHistoryListRelated = useSetAtom(approvalHistoryListRelatedFilterValueAtom);
  const setDealListRelated = useSetAtom(approvalDealListRelatedFilterValueAtom);
  const [relatedFilterValue, setRelatedFilterValue] = useAtom(
    useMemo(() => approvalRelatedFilterValueAtomMap[type], [type])
  );
  const [inputFilterValue, setInputFilterValue] = useAtom(approvalListInputFilterValueAtom);
  const [page, setPage] = useAtom(approvalListPageAtom);
  const setSorter = useSetAtom(approvalListTableSorterAtom);
  const pageSize = useAtomValue(approvalListPageSizeAtom);
  const [approvalListTableSelectIds, setApprovalListTableSelectIds] = useAtom(approvalListTableSelectIdsAtom);

  const [drawerState, updateDrawerState] = useImmer({
    open: false,
    selectedId: '',
    initialData: [] as ReceiptDeal[],
    action: true
  });
  const [modalState, updateModalState] = useImmer({
    open: false,
    selectedId: ''
  });

  const { data, prefetch, handleRefetch, needUpdate, filterParams, refetch } = useReceiptDealApprovalTableData(
    type,
    relatedFilterValue,
    true
  );

  const receiptDealCache = useMemo(() => {
    return transform2ReceiptDealCache(data?.list);
  }, [data?.list]);

  const updateRelatedFilterValue = useMemoizedFn((param: Partial<ApprovalListRelatedFilter>) => {
    setPage(1);
    const newValue = { ...relatedFilterValue, ...param };
    setRelatedFilterValue(newValue);
  });

  const updateInputFilterValue = useMemoizedFn((param: Partial<ApprovalListInputFilter>) => {
    setPage(1);
    const newValue = { ...inputFilterValue, ...param };
    setInputFilterValue(newValue);
  });

  const onShowAll = useMemoizedFn(() => {
    setListRelated(DEFAULT_APPROVAL_LIST_RELATED_FILTER_VALUE);
    setHistoryListRelated(DEFAULT_APPROVAL_HISTORY_LIST_RELATED_FILTER_VALUE);
    setDealListRelated(DEFAULT_APPROVAL_DEAL_LIST_RELATED_FILTER_VALUE);
  });

  useEffect(() => {
    onShowAll();
    updateInputFilterValue({
      ...DEFAULT_APPROVAL_LIST_INPUT_FILTER_VALUE,
      receipt_deal_order_no: null,
      bridge_code: null,
      deal_price: null
    });
    setSorter(void 0);
    setApprovalListTableSelectIds([]);
    // 必须含有pathname
  }, [pathname, onShowAll, updateInputFilterValue, setSorter, setApprovalListTableSelectIds]);

  // 当后续页面没有数据时，需要往前翻页
  useEffect(() => {
    if (data?.bridge_merge_total !== undefined) {
      const maxPage = Math.ceil(data.bridge_merge_total / pageSize) + 1;
      if (page > maxPage) {
        setPage(maxPage);
      }
    }
  }, [data?.bridge_merge_total, page, pageSize, setPage]);

  const accessCache = {
    historyPrint: access?.has(AccessCode.CodeDTMHistoryPrint),
    historyExport: access?.has(AccessCode.CodeDTMHistoryExport),
    approvalLog: access?.has(AccessCode.CodeDTMApprovalLog),
    historyLog: access?.has(AccessCode.CodeDTMHistoryLog),
    historyAudit: access?.has(AccessCode.CodeDTMHistoryAudit),
    dealLog: access?.has(AccessCode.CodeDTMCompletedHistoryLog),
    dealPrint: access?.has(AccessCode.CodeDTMCompletedHistoryPrint)
  };

  const { data: roleList } = useRoleSettingList(type !== ApprovalListType.Deal);

  return {
    accessCache,
    type,
    filterParams,
    relatedFilterValue,
    updateRelatedFilterValue,
    inputFilterValue,
    updateInputFilterValue,
    onShowAll,
    data,
    prefetch,
    refetch,
    handleRefetch,
    receiptDealCache,
    needUpdate,
    drawerState,
    updateDrawerState,
    modalState,
    updateModalState,
    roleList,
    approvalListTableSelectIds
  };
});

export const ApprovalTableProvider = ApprovalTableContainer.Provider;
export const useApprovalTable = ApprovalTableContainer.useContainer;
