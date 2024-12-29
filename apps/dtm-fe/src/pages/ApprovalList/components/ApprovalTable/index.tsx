import { useEffect, useMemo } from 'react';
import { Pagination } from '@fepkg/components/Pagination';
import { ExpandingTable, TableSorter } from '@fepkg/components/Table';
import { ApprovalSortedField } from '@fepkg/services/types/bds-enum';
import { useMemoizedFn } from 'ahooks';
import { useAtom } from 'jotai';
import { useFlagSearchChild } from '@/common/atoms';
import {
  approvalListPageAtom,
  approvalListPageSizeAtom,
  approvalListTableSorterAtom
} from '@/pages/ApprovalList/atoms';
import { useApprovalTable } from '@/pages/ApprovalList/providers/TableProvider';
import {
  ApprovalListType,
  ApprovalTableColumnKey,
  ApprovalTableMouseEvent,
  ApprovalTableRowData
} from '@/pages/ApprovalList/types';
import {
  approvalColumnVisibleKeysMap,
  approvalDealListColumn,
  approvalHistoryListColumn,
  approvalListColumn
} from './columns';
import { useRemoveCheckedItems } from './useRemoveCheckedItems';
import { isBridgeParentData } from './utils';
import './index.less';

export const ApprovalTable = () => {
  const { accessCache, type, data, prefetch, updateDrawerState, approvalListTableSelectIds } = useApprovalTable();
  const [page, setPage] = useAtom(approvalListPageAtom);
  const [pageSize, setPageSize] = useAtom(approvalListPageSizeAtom);
  const [sorter, setSorter] = useAtom(approvalListTableSorterAtom);
  const flagSearchChild = useFlagSearchChild();
  useRemoveCheckedItems();

  const searchChild = type === ApprovalListType.Deal ? true : flagSearchChild;

  const columns = useMemo(() => {
    switch (type) {
      case ApprovalListType.Approval:
        return approvalListColumn(!accessCache?.approvalLog);
      case ApprovalListType.History:
        return approvalHistoryListColumn(!accessCache?.historyAudit || !accessCache?.historyLog, searchChild);
      case ApprovalListType.Deal:
        return approvalDealListColumn;
      default:
        return [];
    }
  }, [accessCache?.approvalLog, accessCache?.historyAudit, accessCache?.historyLog, searchChild, type]);

  // 防止切换视图时，由于使用原面板数据，出现重复id
  const tableData = flagSearchChild === data?.flag_search_child ? data.list ?? [] : [];
  const total = flagSearchChild === data?.flag_search_child ? data?.total ?? 0 : 0;
  const bridgeMergeTotal = flagSearchChild === data?.flag_search_child ? data?.bridge_merge_total ?? 0 : 0;
  let paginationTotal = 0;
  if (flagSearchChild === data?.flag_search_child) {
    paginationTotal = searchChild ? data?.total ?? 0 : data?.bridge_merge_total ?? 0;
  }

  const handleCellDoubleClick: ApprovalTableMouseEvent = useMemoizedFn((_, original, key) => {
    if (
      ![ApprovalTableColumnKey.Expander, ApprovalTableColumnKey.Action, ApprovalTableColumnKey.Parent].includes(key)
    ) {
      if (!isBridgeParentData(original)) {
        updateDrawerState(draft => {
          draft.open = true;
          draft.selectedId = original.original.receipt_deal_id;
          draft.initialData = [original.original];
          draft.action = type === ApprovalListType.Approval;
        });
      }
    }
  });

  const handleColumnSortChange = useMemoizedFn((newSorter: TableSorter<ApprovalSortedField>) => {
    if (searchChild) {
      setSorter(newSorter);
      setPage(1);
    }
  });

  useEffect(() => {
    setSorter(void 0);
    setPage(1);
    // 必须包含searchChild
  }, [searchChild, setPage, setSorter]);

  return (
    <div className="relative flex flex-col flex-1">
      <ExpandingTable<ApprovalTableRowData, ApprovalTableColumnKey, ApprovalSortedField>
        key={String(searchChild)}
        className="dtm-approval-table absolute left-0 right-0 top-0 bottom-[49px] border border-solid border-gray-800 rounded-t-lg !h-auto"
        size="md"
        cssVirtual={false}
        showHeaderDivide={false}
        showHeaderDefaultSorter={searchChild}
        data={tableData}
        rowKey="id"
        renderer="web"
        columns={columns}
        pageSize={searchChild ? pageSize : pageSize * 9}
        sorter={sorter}
        columnVisibleKeys={approvalColumnVisibleKeysMap(searchChild, accessCache?.dealLog)[type]}
        defaultExpanded
        hasColumnSettings={false}
        showHeaderReorder={false}
        showHeaderResizer={false}
        showHeaderContextMenu={false}
        onCellDoubleClick={handleCellDoubleClick}
        onColumnSortChange={handleColumnSortChange}
        onPrevPage={scrollCallback => {
          if (page === 1) {
            scrollCallback(false);
            return;
          }
          let prev = page - 1;
          if (prev < 1) prev = 1;
          setPage(prev);
          scrollCallback(true);
        }}
        onNextPage={scrollCallback => {
          if (page >= Math.ceil(total / pageSize)) {
            scrollCallback(false);
            return;
          }
          let next = page + 1;
          const max = Math.ceil(total / pageSize);
          if (next > max) next = max;
          if (next < 1) next = 1;
          setPage(next);
          scrollCallback(true);
        }}
        onPrevPagePrefetch={() => {
          const prev = page - 1;
          if (prev < 1) {
            return;
          }
          prefetch({ page: prev });
        }}
        onNextPagePrefetch={() => {
          const max = Math.ceil(total / pageSize);
          if (max <= 1) {
            return;
          }
          let next = page + 1;
          if (next > max) next = max;
          if (next === page) {
            return;
          }
          prefetch({ page: next });
        }}
      />

      <div className="absolute bottom-0 left-0 right-0 select-none">
        <div className="component-dashed-x-600 h-px" />
        <div className="flex justify-between py-3 px-4 bg-gray-800 rounded-b-lg items-center">
          <div className="flex h-4 text-xs font-normal text-gray-300 gap-x-2">
            <span>
              共有<span className="pl-1 pr-1 text-sm leading-4 font-bold text-primary-100">{total}</span>条
            </span>
            {!searchChild && (
              <span>
                过桥成交单合并后共计
                <span className="pl-1 pr-1 text-sm leading-4 font-bold text-orange-100">{bridgeMergeTotal}</span>条
              </span>
            )}
            {!!approvalListTableSelectIds.length && (
              <span>
                已选
                <span className="pl-1 pr-1 text-sm leading-4 font-bold text-gray-000">
                  {approvalListTableSelectIds.length}
                </span>
                条
              </span>
            )}
          </div>
          <Pagination
            showQuickJumper
            showSizeChanger
            current={page}
            pageSize={pageSize}
            total={paginationTotal}
            onChange={val => setPage(val)}
            pageSizeOptions={[30, 50, 100]}
            onShowSizeChange={(pageNum, size) => {
              setPage(pageNum);
              setPageSize(size);
            }}
          />
        </div>
      </div>
    </div>
  );
};
