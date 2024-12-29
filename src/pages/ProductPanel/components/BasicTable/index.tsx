import { useMemo } from 'react';
import { BondQuoteTableColumnKey } from '@fepkg/business/components/QuoteTableCell/types';
import { Pagination } from '@fepkg/components/Pagination';
import { Portal } from '@fepkg/components/Portal';
import { Table, TableSelectEventHandler, TableSorter } from '@fepkg/components/Table';
import { QuoteSortedField, Side } from '@fepkg/services/types/enum';
import { ColumnOrderState } from '@tanstack/react-table';
import { useMemoizedFn } from 'ahooks';
import { useAtom, useSetAtom } from 'jotai';
import { getPollingAPIPageCount } from '@/common/ab-rules';
import { useDialogWindow } from '@/common/hooks/useDialog';
import useOnlineOpenDialog from '@/common/hooks/useOnlineOpenDialog';
import { copyQuotes } from '@/common/utils/copy';
import { trackPoint } from '@/common/utils/logger/point';
import { QuoteTrigger } from '@/components/Quote/types';
import { ShortcutSidebar, ShortcutSidebarPropsProvider } from '@/components/ShortcutSidebar';
import { TCellContextMenu } from '@/components/TCellContextMenu/ContextMenu';
import { InvalidContextMenu } from '@/components/TCellContextMenu/InvalidContextMenu';
import { useProductParams } from '@/layouts/Home/hooks';
import {
  basicTablePageAtom,
  basicTableSelectedRowKeysAtom,
  basicTableSorterAtom,
  getTableSettingsAtom,
  referredTablePageAtom,
  referredTableSelectedRowKeysAtom,
  referredTableSorterAtom,
  tableColumnSettingsMdlOpenAtom,
  tableCtxMenuOpenAtom,
  tableCtxMenuPositionAtom
} from '@/pages/ProductPanel/atoms/table';
import { getColumns } from '@/pages/ProductPanel/components/BasicTable/columns';
import { getSingleBondDetailDialogConfig } from '@/pages/Quote/BondDetail/utils';
import { QuoteActionMode, QuoteFocusInputType } from '@/pages/Quote/SingleQuote/types';
import { getSingleQuoteDialogConfig } from '@/pages/Quote/SingleQuote/utils';
import { useUpdateGlobalSearchValue } from '../../atoms/global-search';
import { useResetTablePage } from '../../hooks/useResetTablePage';
import { useMainGroupData } from '../../providers/MainGroupProvider';
import { updateTableParamsCache } from '../../providers/MainGroupProvider/storage';
import { useProductPanel } from '../../providers/PanelProvider';
import { BondQuoteTableColumnSettingItem, ProductPanelTableKey } from '../../types';
import { SIDEBAR_CONTENT_ID } from '../Sidebar';
import { TableColumnSettingsModal } from '../TableColumnSettingsModal';
import { BasicTableColumn, BasicTableMouseEvent } from './types';
import { useBasicTableData } from './useTableData';

export const BasicTable = ({ referred = false }) => {
  const { productType } = useProductParams();
  const { accessCache, sidebarRef, activeTableKey, groupStoreKey } = useProductPanel();
  const { delayedActiveGroupState: activeGroup, modifyLocalGroup, bondFilterRef } = useMainGroupData();

  const [updateGlobalSearch] = useUpdateGlobalSearchValue(groupStoreKey, useResetTablePage);
  const { beforeOpenDialogWindow } = useOnlineOpenDialog();
  const { openDialog } = useDialogWindow();

  /** 当前组件的表格 Key */
  const tableKey = referred ? ProductPanelTableKey.Referred : ProductPanelTableKey.Basic;
  /** 当前组件是否处于激活状态 */
  const active = tableKey === activeTableKey;

  const pageSize = useMemo(() => getPollingAPIPageCount(), []);

  const columns = useMemo(() => getColumns(productType, referred), [productType, referred]);

  const [page, setPage] = useAtom(useMemo(() => (referred ? referredTablePageAtom : basicTablePageAtom), [referred]));
  const [sorter, setSorter] = useAtom(
    useMemo(() => (referred ? referredTableSorterAtom : basicTableSorterAtom), [referred])
  );
  const [selectedRowKeys, setSelectedRowKeys] = useAtom(
    useMemo(() => (referred ? referredTableSelectedRowKeysAtom : basicTableSelectedRowKeysAtom), [referred])
  );
  const [columnSettings, setColumnSettings] = useAtom(
    useMemo(() => getTableSettingsAtom(productType, tableKey), [productType, tableKey])
  );

  const setColumnSettingsMdlOpen = useSetAtom(tableColumnSettingsMdlOpenAtom);
  const setCtxMenuOpen = useSetAtom(tableCtxMenuOpenAtom);
  const setCtxMenuPosition = useSetAtom(tableCtxMenuPositionAtom);

  const { data, prefetch, handleRefetch, optimisticUpdate } = useBasicTableData(referred, active);
  const total = data?.total && data.total > 0 ? data.total : 0;

  const selectedQuoteList = useMemo(
    () => data?.list?.filter(item => selectedRowKeys.has(item.original.quote_id))?.map(item => item.original) ?? [],
    [data?.list, selectedRowKeys]
  );
  const selectedBondList = useMemo(
    () => selectedQuoteList.map(item => item.bond_basic_info).filter(Boolean),
    [selectedQuoteList]
  );
  /** 是否有选择 STC 报价 */
  // const hasSelectedSTCQuote = useMemo(() => getHasSTCQuote(selectedQuoteList), [selectedQuoteList]);
  const hasSelectedSTCQuote = false;

  const handleColumnSettingsUpdate = (val: BondQuoteTableColumnSettingItem[]) => {
    setColumnSettings(val);

    if (activeGroup?.groupId) {
      updateTableParamsCache({
        storeKey: groupStoreKey,
        groupId: activeGroup.groupId,
        tableKeys: [tableKey],
        type: 'columnSettings',
        value: val
      });
    }
  };

  const handleSelect: TableSelectEventHandler = useMemoizedFn((keys, evt) => {
    setSelectedRowKeys(keys);
    const selectedQuotes = data?.list?.filter(item => keys.has(item.original.quote_id)).map(item => item.original);
    if (selectedQuotes) {
      copyQuotes(selectedQuotes, referred ? ProductPanelTableKey.Referred : ProductPanelTableKey.Basic, evt?.altKey);
    }
  });

  const handleColumnSortChange = useMemoizedFn((newSorter: TableSorter<QuoteSortedField>) => {
    bondFilterRef.current?.resetQuickFilterSorting?.();
    setSorter(newSorter);
    setPage(1);

    if (activeGroup?.groupId) {
      modifyLocalGroup({ ...activeGroup, quickFilter: { ...activeGroup?.quickFilter, intelligence_sorting: false } });
      updateTableParamsCache({
        storeKey: groupStoreKey,
        groupId: activeGroup.groupId,
        tableKeys: [tableKey],
        type: 'tableSorter',
        value: newSorter
      });
    }
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

  const handleColumnSettingTrigger = useMemoizedFn(() => {
    setColumnSettingsMdlOpen(true);
  });

  const handleCellDoubleClick: BasicTableMouseEvent = useMemoizedFn((_, original, key) => {
    if (!beforeOpenDialogWindow()) return;

    const params = { groupId: activeGroup?.groupId };

    const { traderId, traderName, brokerId, brokerName } = original;
    switch (key) {
      case 'first_maturity_date':
      case 'bond_code':
      case 'short_name':
        if (!accessCache.detail) return;

        openDialog(getSingleBondDetailDialogConfig(productType, { data: original.original, tableKey: activeTableKey }));
        break;
      case 'cp':
        if (traderName && traderId) {
          updateGlobalSearch({
            ...params,
            inputFilter: { user_input: `TJ:${traderName}`, trader_id_list: [traderId] }
          });
        }
        break;
      case 'broker':
        if (brokerName && brokerId) {
          updateGlobalSearch({
            ...params,
            inputFilter: { user_input: `BJ:${brokerName}`, broker_id_list: [brokerId] }
          });
        }
        break;
      default: {
        if (!accessCache.quote) return;

        const { side } = original.original;
        let field = '';
        if (side === Side.SideBid) field += 'BID_';
        if (side === Side.SideOfr) field += 'OFR_';
        if (key === 'volume') field += 'VOL';
        else field += 'PRICE';

        const focusInput = QuoteFocusInputType[field];

        const config = getSingleQuoteDialogConfig(productType, {
          actionMode: tableKey === ProductPanelTableKey.Referred ? QuoteActionMode.EDIT_UNREFER : QuoteActionMode.EDIT,
          defaultValue: original.original,
          activeTableKey,
          focusInput,
          disabled: hasSelectedSTCQuote,
          onSuccess: () => {
            handleRefetch();
          }
        });

        trackPoint(QuoteTrigger.TABLE_DBLCLICK);
        openDialog(config.config, { ...config.callback, showOfflineMsg: false });
        break;
      }
    }
  });

  const handleCellContextMenu: BasicTableMouseEvent = useMemoizedFn(evt => {
    setCtxMenuOpen(true);
    setCtxMenuPosition({ x: evt.pageX, y: evt.pageY });
  });

  return (
    <>
      <div className="relative flex flex-col flex-1">
        <Table<BasicTableColumn, BondQuoteTableColumnKey, QuoteSortedField>
          className="absolute left-0 right-0 top-0 bottom-[49px] !h-auto"
          active={active}
          data={data?.list ?? []}
          columns={columns}
          rowKey={original => original.original.quote_id}
          pageSize={pageSize}
          sorter={sorter}
          columnSettings={columnSettings}
          selectedKeys={selectedRowKeys}
          zebra
          onSelect={handleSelect}
          onColumnSortChange={handleColumnSortChange}
          onColumnOrderChange={handleColumnOrderChange}
          onColumnResizeEnd={handleColumnResizeEnd}
          onColumnSettingTrigger={handleColumnSettingTrigger}
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
        <TableColumnSettingsModal
          productType={productType}
          tableKey={tableKey}
          settings={columnSettings}
          onSettingsUpdate={handleColumnSettingsUpdate}
        />
      )}

      {active && (
        <Portal
          rootId={SIDEBAR_CONTENT_ID}
          targetElement={sidebarRef.current || void 0}
        >
          <ShortcutSidebarPropsProvider
            activeTableKey={activeTableKey}
            selectedBondList={selectedBondList}
            selectedQuoteList={selectedQuoteList}
            hasSelectedSTCQuote={hasSelectedSTCQuote}
            onEventSuccess={handleRefetch}
            onOptimisticUpdate={optimisticUpdate}
          >
            <ShortcutSidebar />
          </ShortcutSidebarPropsProvider>
        </Portal>
      )}

      {active &&
        (referred ? (
          <InvalidContextMenu selectedQuoteList={selectedQuoteList} />
        ) : (
          <TCellContextMenu
            productType={productType}
            activeTableKey={activeTableKey}
            selectedBondList={selectedBondList}
            selectedQuoteList={selectedQuoteList}
            hasSelectedSTCQuote={hasSelectedSTCQuote}
            onEventSuccess={handleRefetch}
            onOptimisticUpdate={optimisticUpdate}
          />
        ))}
    </>
  );
};
