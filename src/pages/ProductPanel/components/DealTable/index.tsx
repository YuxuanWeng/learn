import { useMemo } from 'react';
import { BondQuoteTableColumnKey } from '@fepkg/business/components/QuoteTableCell/types';
import { Pagination } from '@fepkg/components/Pagination';
import { Portal } from '@fepkg/components/Portal';
import { Table, TableSelectEventHandler, TableSorter } from '@fepkg/components/Table';
import { QuoteLite } from '@fepkg/services/types/common';
import { QuoteSortedField } from '@fepkg/services/types/enum';
import { ColumnOrderState } from '@tanstack/react-table';
import { useMemoizedFn } from 'ahooks';
import { useAtom, useSetAtom } from 'jotai';
import { getPollingAPIPageCount } from '@/common/ab-rules';
import { useDialogWindow } from '@/common/hooks/useDialog';
import useOnlineOpenDialog from '@/common/hooks/useOnlineOpenDialog';
import { copyMarketDeals } from '@/common/utils/copy';
import { trackPoint } from '@/common/utils/logger/point';
import { DealShortcutSidebar } from '@/components/ShortcutSidebar';
import { DealTrace } from '@/components/ShortcutSidebar/useDealShortcutEvent';
import { DealContextMenu } from '@/components/TCellContextMenu/DealContextMenu';
import { useProductParams } from '@/layouts/Home/hooks';
import { getMarketDealDialogConfig } from '@/pages/Deal/Market/MarketDealForm/utils';
import { useUpdateGlobalSearchValue } from '@/pages/ProductPanel/atoms/global-search';
import {
  dealTablePageAtom,
  dealTableSelectedRowKeysAtom,
  dealTableSorterAtom,
  getTableSettingsAtom,
  tableColumnSettingsMdlOpenAtom,
  tableCtxMenuOpenAtom,
  tableCtxMenuPositionAtom
} from '@/pages/ProductPanel/atoms/table';
import { SIDEBAR_CONTENT_ID } from '@/pages/ProductPanel/components/Sidebar';
import { updateTableParamsCache } from '@/pages/ProductPanel/providers/MainGroupProvider/storage';
import { useProductPanel } from '@/pages/ProductPanel/providers/PanelProvider';
import { getSingleBondDetailDialogConfig } from '@/pages/Quote/BondDetail/utils';
import { useResetTablePage } from '../../hooks/useResetTablePage';
import { useMainGroupData } from '../../providers/MainGroupProvider';
import { BondQuoteTableColumnSettingItem, ProductPanelTableKey } from '../../types';
import { TableColumnSettingsModal } from '../TableColumnSettingsModal';
import { JoinModal } from './JoinModal';
import { columns } from './columns';
import { DealTableColumn, DealTableMouseEvent } from './types';
import { useDealTableData } from './useTableData';

const tableKey = ProductPanelTableKey.Deal;

export const DealTable = () => {
  const { productType } = useProductParams();
  const { accessCache, sidebarRef, activeTableKey, groupStoreKey } = useProductPanel();
  const { delayedActiveGroupState: activeGroup, modifyLocalGroup, bondFilterRef } = useMainGroupData();

  const [updateGlobalSearch] = useUpdateGlobalSearchValue(groupStoreKey, useResetTablePage);
  const { beforeOpenDialogWindow } = useOnlineOpenDialog();
  const { openDialog } = useDialogWindow();

  /** 当前组件是否处于激活状态 */
  const active = tableKey === activeTableKey;

  const pageSize = useMemo(() => getPollingAPIPageCount(), []);

  const [page, setPage] = useAtom(dealTablePageAtom);
  const [sorter, setSorter] = useAtom(dealTableSorterAtom);
  const [selectedRowKeys, setSelectedRowKeys] = useAtom(dealTableSelectedRowKeysAtom);
  const [columnSettings, setColumnSettings] = useAtom(
    useMemo(() => getTableSettingsAtom(productType, tableKey), [productType])
  );

  const setColumnSettingsMdlOpen = useSetAtom(tableColumnSettingsMdlOpenAtom);
  const setCtxMenuOpen = useSetAtom(tableCtxMenuOpenAtom);
  const setCtxMenuPosition = useSetAtom(tableCtxMenuPositionAtom);

  const { data, prefetch, handleRefetch } = useDealTableData(active);
  const total = data?.total ?? 0;

  const selectedMarketDealList = useMemo(
    () => data?.list?.filter(item => selectedRowKeys.has(item.original.deal_id))?.map(item => item.original) ?? [],
    [data, selectedRowKeys]
  );

  const disabledRowKeys = useMemo(
    () => new Set(data?.list?.filter(item => item.original.nothing_done)?.map(item => item.original.deal_id) ?? []),
    [data]
  );

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

  const handleSelect: TableSelectEventHandler = keys => {
    setSelectedRowKeys(keys);
    const selectedMarketDeals = data?.list?.filter(item => keys.has(item.original.deal_id)).map(item => item.original);
    if (selectedMarketDeals) {
      copyMarketDeals(selectedMarketDeals);
    }
  };

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

  const handleColumnSettingTrigger = () => {
    setColumnSettingsMdlOpen(true);
  };

  const handleCellDoubleClick: DealTableMouseEvent = useMemoizedFn((_, original, key) => {
    if (!beforeOpenDialogWindow()) return;

    const {
      bid_broker_name,
      bid_trader_name,
      ofr_broker_name,
      ofr_trader_name,
      bid_broker_id,
      ofr_broker_id,
      bid_trader_id,
      ofr_trader_id
    } = original.original;

    const params = { groupId: activeGroup?.groupId };

    switch (key) {
      case BondQuoteTableColumnKey.FirstMaturityDate:
      case BondQuoteTableColumnKey.BondCode:
      case BondQuoteTableColumnKey.ShortName: {
        if (!accessCache.detail) return;

        openDialog(
          getSingleBondDetailDialogConfig(productType, {
            data: { bond_basic_info: original.original.bond_basic_info } as QuoteLite,
            bond_info: original.original.bond_basic_info,
            tableKey: activeTableKey
          }),
          { showOfflineMsg: false }
        );
        break;
      }
      case BondQuoteTableColumnKey.BrokerB:
        if (bid_broker_name && bid_broker_id)
          updateGlobalSearch({
            ...params,
            inputFilter: { user_input: `BJ:${bid_broker_name}`, broker_id_list: [bid_broker_id] }
          });
        break;
      case BondQuoteTableColumnKey.BrokerO:
        if (ofr_broker_name && ofr_broker_id)
          updateGlobalSearch({
            ...params,
            inputFilter: { user_input: `BJ:${ofr_broker_name}`, broker_id_list: [ofr_broker_id] }
          });
        break;
      case BondQuoteTableColumnKey.CpBid:
        if (bid_trader_name && bid_trader_id)
          updateGlobalSearch({
            ...params,
            inputFilter: { user_input: `TJ:${bid_trader_name}`, trader_id_list: [bid_trader_id] }
          });
        break;
      case BondQuoteTableColumnKey.CpOfr:
        if (ofr_trader_name && ofr_trader_id)
          updateGlobalSearch({
            ...params,
            inputFilter: { user_input: `TJ:${ofr_trader_name}`, trader_id_list: [ofr_trader_id] }
          });
        break;
      default: {
        if (!accessCache.deal) return;

        const marketDealDialogConfig = getMarketDealDialogConfig(productType, {
          defaultValue: original.original,
          defaultBondReadOnly: true,
          defaultFocused: 'price',
          onSuccess: handleRefetch
        });

        trackPoint(DealTrace.TableDblClick);
        openDialog(marketDealDialogConfig, { showOfflineMsg: false });
        break;
      }
    }
  });

  const handleCellContextMenu: DealTableMouseEvent = useMemoizedFn(evt => {
    setCtxMenuOpen(true);
    setCtxMenuPosition({ x: evt.pageX, y: evt.pageY });
  });

  return (
    <>
      <div className="relative flex flex-col flex-1">
        <Table<DealTableColumn, BondQuoteTableColumnKey, QuoteSortedField>
          className="absolute left-0 right-0 top-0 bottom-[49px] !h-auto"
          active={active}
          data={data?.list ?? []}
          columns={columns}
          rowKey={original => original.original.deal_id}
          pageSize={pageSize}
          sorter={sorter}
          columnSettings={columnSettings}
          selectedKeys={selectedRowKeys}
          disabledKeys={disabledRowKeys}
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
          <DealShortcutSidebar
            selectedMarketDealList={selectedMarketDealList}
            onEventSuccess={handleRefetch}
          />
        </Portal>
      )}

      {active && <DealContextMenu selectedMarketDealList={selectedMarketDealList} />}

      {accessCache.deal && (
        <JoinModal
          defaultValue={selectedMarketDealList[0]}
          onSuccess={handleRefetch}
        />
      )}
    </>
  );
};
