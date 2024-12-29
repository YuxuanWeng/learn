import { useMemo } from 'react';
import { BondQuoteTableColumnKey } from '@fepkg/business/components/QuoteTableCell/types';
import { Pagination } from '@fepkg/components/Pagination';
import { Portal } from '@fepkg/components/Portal';
import { Table, TableSelectEventHandler, TableSorter } from '@fepkg/components/Table';
import { ProductType, QuoteSortedField } from '@fepkg/services/types/enum';
import { ColumnOrderState } from '@tanstack/react-table';
import { useMemoizedFn } from 'ahooks';
import { useAtom, useSetAtom } from 'jotai';
import { getPollingAPIPageCount } from '@/common/ab-rules';
import useOnlineOpenDialog from '@/common/hooks/useOnlineOpenDialog';
import { copyNcdPInfos } from '@/common/utils/copy/ncdp-info';
import { NCDPShortcutSidebar } from '@/components/ShortcutSidebar/NCDPShortcutSidebar';
import { NCDPContextMenu } from '@/components/TCellContextMenu/NCDPContextMenu';
import {
  basicTablePageAtom,
  basicTableSelectedRowKeysAtom,
  basicTableSorterAtom,
  getTableSettingsAtom,
  referredTablePageAtom,
  referredTableSelectedRowKeysAtom,
  referredTableSorterAtom,
  tableCtxMenuOpenAtom,
  tableCtxMenuPositionAtom
} from '@/pages/ProductPanel/atoms/table';
import { useIssueMaturityIsTradeDate } from '@/pages/ProductPanel/components/NCDPTable/useIssueMaturityIsTradeDate';
import { useUpdateGlobalSearchValue } from '../../atoms/global-search';
import { useResetTablePage } from '../../hooks/useResetTablePage';
import { useMainGroupData } from '../../providers/MainGroupProvider';
import { useProductPanel } from '../../providers/PanelProvider';
import { BondQuoteTableColumnSettingItem, ProductPanelTableKey } from '../../types';
import { SIDEBAR_CONTENT_ID } from '../Sidebar';
import { EditModal, editMdlOpenAtom } from './EditModal';
import { columns } from './columns';
import { NCDPTableColumn, NCDPTableMouseEvent } from './types';
import { useNCDPTableData } from './useTableData';

const productType = ProductType.NCDP;

// referred：是否为已删除页签
export const NCDPTable = ({ referred = false }) => {
  const { sidebarRef, activeTableKey, groupStoreKey } = useProductPanel();
  const { delayedActiveGroupState: activeGroup, bondFilterRef } = useMainGroupData();
  const issueMaturityCache = useIssueMaturityIsTradeDate();

  const [updateGlobalSearch] = useUpdateGlobalSearchValue(groupStoreKey, useResetTablePage);
  const { beforeOpenDialogWindow } = useOnlineOpenDialog();

  /** 当前组件的表格 Key */
  const tableKey = referred ? ProductPanelTableKey.Referred : ProductPanelTableKey.Basic;
  /** 当前组件是否处于激活状态 */
  const active = tableKey === activeTableKey;

  const pageSize = useMemo(() => getPollingAPIPageCount(), []);

  const [page, setPage] = useAtom(useMemo(() => (referred ? referredTablePageAtom : basicTablePageAtom), [referred]));
  const [sorter, setSorter] = useAtom(
    useMemo(() => (referred ? referredTableSorterAtom : basicTableSorterAtom), [referred])
  );
  const [selectedRowKeys, setSelectedRowKeys] = useAtom(
    useMemo(() => (referred ? referredTableSelectedRowKeysAtom : basicTableSelectedRowKeysAtom), [referred])
  );
  const [columnSettings, setColumnSettings] = useAtom(
    useMemo(() => getTableSettingsAtom(productType, tableKey), [tableKey])
  );

  const setEditMdlOpen = useSetAtom(editMdlOpenAtom);
  const setCtxMenuOpen = useSetAtom(tableCtxMenuOpenAtom);
  const setCtxMenuPosition = useSetAtom(tableCtxMenuPositionAtom);

  const { data, prefetch } = useNCDPTableData(referred, active);
  const total = data?.total && data.total > 0 ? data.total : 0;

  const selectedNCDPList = useMemo(
    () => data?.list?.filter(item => selectedRowKeys.has(item.original.ncdp_id))?.map(item => item.original) ?? [],
    [data?.list, selectedRowKeys]
  );

  const handleColumnSettingsUpdate = (val: BondQuoteTableColumnSettingItem[]) => {
    setColumnSettings(val);
  };

  const handleSelect: TableSelectEventHandler = useMemoizedFn(keys => {
    setSelectedRowKeys(keys);

    if (referred) return;

    // 已删除表格不需要操作
    const selectedNcdPInfos = data?.list?.filter(item => keys.has(item.original.ncdp_id)).map(item => item.original);
    if (selectedNcdPInfos && issueMaturityCache) {
      copyNcdPInfos(selectedNcdPInfos, issueMaturityCache);
    }
  });

  const handleColumnSortChange = useMemoizedFn((newSorter: TableSorter<QuoteSortedField>) => {
    bondFilterRef.current?.resetQuickFilterSorting?.();

    setSorter(newSorter);
    setPage(1);
  });

  const handleColumnOrderChange = useMemoizedFn((columnOrder: ColumnOrderState) => {
    if (columnSettings) {
      const sortedCols = [...columnSettings]?.sort((a, b) => columnOrder.indexOf(a.key) - columnOrder.indexOf(b.key));
      const showCols = sortedCols.filter(item => item.visible);
      const unShowCols = sortedCols.filter(item => !item.visible);
      const updatedCols = [...showCols, ...unShowCols];
      handleColumnSettingsUpdate(updatedCols);
    }
  });

  const handleColumnResizeEnd = useMemoizedFn((key: BondQuoteTableColumnKey, width: number) => {
    if (columnSettings) {
      const settingIdx = columnSettings?.findIndex(item => item.key === key);
      if (settingIdx > -1) {
        columnSettings[settingIdx] = { ...columnSettings[settingIdx], width };
        handleColumnSettingsUpdate([...columnSettings]);
      }
    }
  });

  const handleCellDoubleClick: NCDPTableMouseEvent = useMemoizedFn((_, original, key) => {
    if (!beforeOpenDialogWindow()) return;

    const params = { groupId: activeGroup?.groupId };

    const { inst_id, inst_name, operator, operator_name } = original.original;
    switch (key) {
      case BondQuoteTableColumnKey.IssuerInst:
        updateGlobalSearch({
          ...params,
          inputFilter: { user_input: `CJ:${inst_name}`, inst_id_list: [inst_id] }
        });
        break;
      case BondQuoteTableColumnKey.Operator:
        updateGlobalSearch({
          ...params,
          inputFilter: { user_input: `BJ:${operator_name}`, broker_id_list: [operator] }
        });
        break;
      default:
        // 已删除表格不需要操作
        if (referred) return;

        setSelectedRowKeys(new Set([original.original.ncdp_id]));
        setEditMdlOpen(true);
        break;
    }
  });

  const handleCellContextMenu: NCDPTableMouseEvent = useMemoizedFn(evt => {
    setCtxMenuOpen(true);
    setCtxMenuPosition({ x: evt.pageX, y: evt.pageY });
  });

  return (
    <>
      <div className="relative flex flex-col flex-1">
        <Table<NCDPTableColumn, BondQuoteTableColumnKey, QuoteSortedField>
          className="absolute left-0 right-0 top-0 bottom-[49px] !h-auto"
          active={active}
          data={data?.list ?? []}
          columns={columns}
          rowKey={original => original.original.ncdp_id}
          pageSize={pageSize}
          sorter={sorter}
          columnSettings={columnSettings}
          selectedKeys={selectedRowKeys}
          zebra
          multiSelectEnabled={!referred}
          arrowMoveSelectEnabled={!referred}
          keyboardSelectAllEnabled={!referred}
          showHeaderContextMenu={false}
          onSelect={handleSelect}
          onColumnSortChange={handleColumnSortChange}
          onColumnOrderChange={handleColumnOrderChange}
          onColumnResizeEnd={handleColumnResizeEnd}
          onCellDoubleClick={handleCellDoubleClick}
          onCellContextMenu={handleCellContextMenu}
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

          <div className="flex justify-between py-3 px-4 bg-gray-800">
            <div className="flex leading-6 text-gray-300">
              共有<span className="pl-1 pr-1 text-sm text-primary-100">{total}</span>条
            </div>
            <Pagination
              showQuickJumper
              showSizeChanger={false}
              current={page}
              pageSize={pageSize}
              total={total}
              onChange={val => setPage(val)}
            />
          </div>
        </div>
      </div>

      {active && (
        <Portal
          rootId={SIDEBAR_CONTENT_ID}
          targetElement={sidebarRef.current || void 0}
        >
          <NCDPShortcutSidebar
            referred={referred}
            selectedNCDPList={selectedNCDPList}
            issueMaturityCache={issueMaturityCache}
          />
        </Portal>
      )}

      {active && (
        <NCDPContextMenu
          selectedNCDPList={selectedNCDPList}
          referred={referred}
        />
      )}

      {!referred && <EditModal selectedNCDPList={selectedNCDPList} />}
    </>
  );
};
