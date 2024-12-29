import { useMemo } from 'react';
import { Pagination } from '@fepkg/components/Pagination';
import { GroupTable, TableSelectEventHandler } from '@fepkg/components/Table';
import { QuoteDraftDetailStatus } from '@fepkg/services/types/enum';
import { useMemoizedFn } from 'ahooks';
import { useAtomValue, useSetAtom } from 'jotai';
import { originalTextMdlOpenAtom } from '@/pages/Quote/Collaborative/atoms/modal';
import { ctxMenuPositionAtom, ctxMenuVisibleAtom } from '@/pages/Quote/Collaborative/atoms/panel';
import { DRAFT_TABLE_PAGE_SIZE } from '@/pages/Quote/Collaborative/constants';
import { useDraftAction } from '@/pages/Quote/Collaborative/hooks/useDraftAction';
import { useTableState } from '@/pages/Quote/Collaborative/providers/TableStateProvider';
import {
  DraftGroupTableColumnKey,
  DraftGroupTableMessageData,
  DraftGroupTableMouseEvent,
  DraftGroupTableRowData
} from '@/pages/Quote/Collaborative/types/table';
import { isDraftDetailData } from '@/pages/Quote/Collaborative/utils';
import { columnVisibleKeys, columns } from './columns';
import './index.less';

export const DraftGroupTable = () => {
  const {
    tableRef,
    selectedDetailKeys,
    setSelectedMessageKey,
    setSelectedDetailKeys,
    updateKeepingTimestamp,
    page,
    setPage,
    tableData,
    tableTotal,
    indexCache,
    operable
  } = useTableState();
  const { showEditModal } = useDraftAction();

  const originalTextMdlOpen = useAtomValue(originalTextMdlOpenAtom);
  const setCtxVisible = useSetAtom(ctxMenuVisibleAtom);
  const setCtxPosition = useSetAtom(ctxMenuPositionAtom);

  const ignoredDetailKeys = useMemo(() => {
    const keys = new Set<string>();

    for (let i = 0, len = tableData.length; i < len; i++) {
      const item = tableData[i];
      if (isDraftDetailData(item) && item.original?.status === QuoteDraftDetailStatus.QuoteDraftDetailStatusIgnored) {
        keys.add(item.id);
      }
    }

    return keys;
  }, [tableData]);

  const handleSelect: TableSelectEventHandler = useMemoizedFn((keys, _, lastSelectedRowKey) => {
    if (!lastSelectedRowKey) return;
    const lastSelectedRowIdx = indexCache.get(lastSelectedRowKey);

    if (lastSelectedRowIdx === void 0) return;
    const lastSelectedRow = tableData[lastSelectedRowIdx];

    if (!lastSelectedRow?.groupHeaderRowKey) return;
    const messageRowIdx = indexCache.get(lastSelectedRow.groupHeaderRowKey);
    if (messageRowIdx === void 0) return;

    const message = tableData[messageRowIdx] as DraftGroupTableMessageData;

    const selectedKeys = new Set<string>();

    const groupFirstKey = lastSelectedRow?.groupItemRowKeys?.at(0);
    const groupLastKey = lastSelectedRow?.groupItemRowKeys?.at(-1);

    const groupStart = indexCache.get(groupFirstKey ?? '') ?? 0;
    const groupEnd = (indexCache.get(groupLastKey ?? '') ?? 0) + 1;

    for (let i = groupStart; i < groupEnd; i++) {
      const item = tableData[i];
      if (keys.has(item.id) && isDraftDetailData(item) && item) {
        selectedKeys.add(item.id);
      }
    }

    setSelectedMessageKey(keys.size > 0 ? message.id : void 0);
    setSelectedDetailKeys(selectedKeys);
  });

  const handleCellClick: DraftGroupTableMouseEvent = useMemoizedFn((_, rowData, key) => {
    if (!isDraftDetailData(rowData)) return;

    if (key === DraftGroupTableColumnKey.Text) window.Main.copy(rowData.text);
  });

  const handleCellDblClick: DraftGroupTableMouseEvent = useMemoizedFn((_, rowData, key) => {
    if (!operable) return;
    if (!isDraftDetailData(rowData)) return;

    showEditModal(rowData.original, key);
  });

  const handleCellContextMenu: DraftGroupTableMouseEvent = useMemoizedFn((evt, rowData) => {
    if (!operable) return;
    if (!isDraftDetailData(rowData)) return;

    setCtxVisible(true);
    setCtxPosition({ x: evt.pageX, y: evt.pageY });
  });

  return (
    <>
      <GroupTable<DraftGroupTableRowData, DraftGroupTableColumnKey>
        active={!originalTextMdlOpen}
        tableRef={tableRef}
        className="oms-co-quote-group-table relative s-table-border-none pl-3 pr-0 pb-3 bg-gray-700"
        columns={columns}
        columnVisibleKeys={columnVisibleKeys}
        data={tableData}
        rowKey="id"
        copyEnabled
        selectedKeys={selectedDetailKeys}
        disabledKeys={ignoredDetailKeys}
        hasColumnSettings={false}
        showHeader={false}
        showWatermark={false}
        onSelect={handleSelect}
        onCellClick={handleCellClick}
        onCellDoubleClick={handleCellDblClick}
        onCellContextMenu={handleCellContextMenu}
        onPrevPage={scrollCallback => {
          if (page === 1) {
            // 在首页顶部时向上翻页时，需要刷新数据
            updateKeepingTimestamp({ reset: true });
            scrollCallback(false);
            return;
          }
          let prev = page - 1;
          if (prev < 1) prev = 1;
          setPage(prev);
          scrollCallback(true);
        }}
        onNextPage={scrollCallback => {
          if (page >= Math.ceil(tableTotal / DRAFT_TABLE_PAGE_SIZE)) {
            scrollCallback(false);
            return;
          }
          let next = page + 1;
          const max = Math.ceil(tableTotal / DRAFT_TABLE_PAGE_SIZE);
          if (next > max) next = max;
          if (next < 1) next = 1;
          setPage(next);
          scrollCallback(true);
        }}
        // 看后续刷新流畅度再考虑是否需要预加载
        // onPrevPagePrefetch={}
        // onNextPagePrefetch={}
      />

      <div className="component-dashed-x h-px" />
      <div className="flex justify-between items-center shrink-0 h-12 px-4 bg-gray-800">
        <div className="flex leading-6 text-gray-300">
          共有<span className="pl-1 pr-1 text-sm text-primary-100">{tableTotal}</span>条
        </div>

        {!!tableTotal && (
          <Pagination
            showQuickJumper
            showSizeChanger={false}
            current={page}
            pageSize={DRAFT_TABLE_PAGE_SIZE}
            total={tableTotal}
            onChange={setPage}
          />
        )}
      </div>
    </>
  );
};
