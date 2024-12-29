import { useMemo } from 'react';
import { message } from '@fepkg/components/Message';
import { Pagination } from '@fepkg/components/Pagination';
import { ExpandingTable, TableSelectEventHandler, TableSorter } from '@fepkg/components/Table';
import { ReceiptDealSortedField, ReceiptDealStatus } from '@fepkg/services/types/bds-enum';
import { ColumnOrderState } from '@tanstack/react-table';
import { useMemoizedFn } from 'ahooks';
import { useAtom, useSetAtom } from 'jotai';
import { getParentPollingAPIPageCount } from '@/common/ab-rules';
import { useDialogWindow } from '@/common/hooks/useDialog';
import useOnlineOpenDialog from '@/common/hooks/useOnlineOpenDialog';
import { useAccess } from '@/common/providers/AccessProvider';
import { getReceiptDealDisabledStyleStatus } from '@/common/services/api/receipt-deal/search';
import { OmsAccessCodeSuffix } from '@/common/types/access';
import { getOmsAccessCodeEnum } from '@/common/utils/access';
import { copyReceiptDeals } from '@/common/utils/copy';
import { trackPoint } from '@/common/utils/logger/point';
import { ReceiptDealContextMenu } from '@/components/TCellContextMenu/ReceiptDealContextMenu';
import { TableColumnSettingsModal as TableColumnSettingsModalInner } from '@/components/TableColumnSettingsModal';
import { useProductParams } from '@/layouts/Home/hooks';
import { ReceiptDealFormMode } from '@/pages/Deal/Receipt/ReceiptDealForm/types';
import { getReceiptDealFormConfig } from '@/pages/Deal/Receipt/ReceiptDealForm/utils';
import {
  getTableSettingsAtom,
  receiptDealTableColumnSettingsMdlOpenAtom,
  receiptDealTableCtxMenuOpenAtom,
  receiptDealTableCtxMenuPositionAtom,
  receiptDealTablePageAtom,
  receiptDealTableSelectedRowKeysAtom,
  receiptDealTableSorterAtom
} from '@/pages/Deal/Receipt/ReceiptDealPanel/atoms/table';
import { isBridgeParentData } from '@/pages/Deal/Receipt/ReceiptDealPanel/components/ReceiptDealTable/utils';
import { getDefaultReceiptDealTableColumnSettings } from '@/pages/Deal/Receipt/ReceiptDealPanel/constants/table';
import { useReceiptDealPanel } from '@/pages/Deal/Receipt/ReceiptDealPanel/providers/ReceiptDealPanelProvider';
import { updateReceiptDealPanelStructCache } from '@/pages/Deal/Receipt/ReceiptDealPanel/providers/ReceiptDealPanelProvider/storage';
import {
  ReceiptDealTableColumnKey,
  ReceiptDealTableColumnSettingItem
} from '@/pages/Deal/Receipt/ReceiptDealPanel/types';
import { globalSearchValueAtom } from '@/pages/ProductPanel/atoms/global-search';
import { columns, getExpanderColumnSetting } from './columns';
import { ReceiptDealRowData, ReceiptDealTableMouseEvent, ReceiptDealTrace } from './types';
import './index.less';

export const ReceiptDealTable = () => {
  const { access } = useAccess();
  const { productType } = useProductParams();
  const { openDialog } = useDialogWindow();

  const { panelStoreKey, selectedList, data, prefetch } = useReceiptDealPanel();
  const { beforeOpenDialogWindow } = useOnlineOpenDialog();
  const setGlobalSearchValue = useSetAtom(globalSearchValueAtom);
  const pageSize = useMemo(() => getParentPollingAPIPageCount(), []);
  const [sorter, setSorter] = useAtom(receiptDealTableSorterAtom);
  const [columnSettings, setColumnSettings] = useAtom(useMemo(() => getTableSettingsAtom(productType), [productType]));
  const [selectedRowKeys, setSelectedRowKeys] = useAtom(receiptDealTableSelectedRowKeysAtom);
  const [columnSettingsMdlOpen, setColumnSettingsMdlOpen] = useAtom(receiptDealTableColumnSettingsMdlOpenAtom);
  const [page, setPage] = useAtom(receiptDealTablePageAtom);
  const setCtxMenuOpen = useSetAtom(receiptDealTableCtxMenuOpenAtom);
  const setCtxMenuPosition = useSetAtom(receiptDealTableCtxMenuPositionAtom);

  const tableColumnSettings = useMemo(() => {
    if (columnSettings.every(s => !s.visible)) {
      return [getExpanderColumnSetting(false), ...columnSettings];
    }
    return [getExpanderColumnSetting(true), ...columnSettings];
  }, [columnSettings]);

  const total = data?.total ?? 0;
  const mergeTotal = data?.bridge_merge_total ?? 0;
  // 排序后，使用细粒度total
  const tableTotal = sorter && sorter.sortedField ? total : mergeTotal;

  const disabledRowKeys = useMemo(() => {
    return new Set(
      data?.flatList
        ?.filter(d => getReceiptDealDisabledStyleStatus(d.receipt_deal_status))
        ?.map(item => item.receipt_deal_id) ?? []
    );
  }, [data]);

  const handleSelect: TableSelectEventHandler = useMemoizedFn(keys => {
    setSelectedRowKeys(keys);
    const selectedReceiptDeals = data?.flatList?.filter(item => keys.has(item.receipt_deal_id));
    if (selectedReceiptDeals) {
      copyReceiptDeals(selectedReceiptDeals, productType, data?.originalParentList);
    }
  });

  const handleColumnSortChange = useMemoizedFn((newSorter: TableSorter<ReceiptDealSortedField>) => {
    setSorter(newSorter);
    setPage(1);
  });

  const handleColumnSettingsUpdate = (newSettings: ReceiptDealTableColumnSettingItem[]) => {
    setColumnSettings(newSettings);
    updateReceiptDealPanelStructCache({
      storeKey: panelStoreKey,
      type: 'columnSettings',
      value: newSettings
    });
  };

  const handleColumnOrderChange = useMemoizedFn((columnOrder: ColumnOrderState) => {
    if (columnSettings) {
      const sortedCols = [...columnSettings]?.sort((a, b) => columnOrder.indexOf(a.key) - columnOrder.indexOf(b.key));
      const showCols = sortedCols.filter(item => item.visible);
      const unShowCols = sortedCols.filter(item => !item.visible);
      const updatedCols = [...showCols, ...unShowCols];
      handleColumnSettingsUpdate(updatedCols);
    }
  });

  const handleColumnResizeEnd = useMemoizedFn((key: ReceiptDealTableColumnKey, width: number) => {
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

  const handleCellDoubleClick: ReceiptDealTableMouseEvent = useMemoizedFn((_, original, key) => {
    if (beforeOpenDialogWindow() && !isBridgeParentData(original)) {
      switch (key) {
        case ReceiptDealTableColumnKey.FlagNeedBridge:
          break;
        case ReceiptDealTableColumnKey.CpBid: {
          const traderName = original.original.bid_trade_info.trader?.name_zh;
          const traderId = original.original.bid_trade_info.trader?.trader_id;
          if (traderName && traderId) {
            setGlobalSearchValue({ user_input: `TJ:${traderName}`, trader_id_list: [traderId] });
          }
          break;
        }
        case ReceiptDealTableColumnKey.CpOfr: {
          const traderName = original.original.ofr_trade_info.trader?.name_zh;
          const traderId = original.original.ofr_trade_info.trader?.trader_id;
          if (traderName && traderId) {
            setGlobalSearchValue({ user_input: `TJ:${traderName}`, trader_id_list: [traderId] });
          }
          break;
        }
        case ReceiptDealTableColumnKey.BrokerB: {
          const brokerName = original.original.bid_trade_info.broker?.name_cn;
          const brokerId = original.original.bid_trade_info.broker?.user_id;
          if (brokerName && brokerId) {
            setGlobalSearchValue({ user_input: `BJ:${brokerName}`, broker_id_list: [brokerId] });
          }
          break;
        }
        case ReceiptDealTableColumnKey.BrokerO: {
          const brokerName = original.original.ofr_trade_info.broker?.name_cn;
          const brokerId = original.original.ofr_trade_info.broker?.user_id;
          if (brokerName && brokerId) {
            setGlobalSearchValue({ user_input: `BJ:${brokerName}`, broker_id_list: [brokerId] });
          }
          break;
        }
        default:
          if (!access?.has(getOmsAccessCodeEnum(productType, OmsAccessCodeSuffix.ReceiptDealEdit))) return;

          trackPoint(ReceiptDealTrace.TableDblClick);
          openDialog(
            getReceiptDealFormConfig(productType, {
              mode: ReceiptDealFormMode.Edit,
              defaultReceiptDeal: original.original,
              editable: original.editable
            })
          );
          break;
      }
    }
  });

  const handleCellContextMenu: ReceiptDealTableMouseEvent = useMemoizedFn((evt, original, key) => {
    const first = selectedList.at(0);
    if (
      !isBridgeParentData(original) &&
      (selectedList.length === 1 ||
        (selectedList.length > 1 &&
          selectedList.length >= 2 &&
          selectedList.every(d => {
            const item = d.original;
            return (
              item.bridge_code &&
              item.bridge_code === first?.original?.bridge_code &&
              !item.order_no &&
              item.receipt_deal_status !== ReceiptDealStatus.ReceiptDealDestroyed &&
              item.receipt_deal_status !== ReceiptDealStatus.ReceiptDealDeleted
            );
          })))
    ) {
      setCtxMenuOpen(true);
      setCtxMenuPosition({ x: evt.pageX, y: evt.pageY });
    }
  });

  return (
    <>
      <div className="relative flex flex-col flex-1">
        <ExpandingTable<ReceiptDealRowData, ReceiptDealTableColumnKey, ReceiptDealSortedField>
          className="receipt-deal-table absolute left-0 right-0 top-0 bottom-[49px] !h-auto"
          showHeaderDivide={false}
          data={data?.list ?? []}
          disabledKeys={disabledRowKeys}
          rowKey="id"
          columns={columns}
          pageSize={pageSize * 9}
          sorter={sorter}
          columnSettings={tableColumnSettings}
          selectedKeys={selectedRowKeys}
          onSelect={handleSelect}
          defaultExpanded
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
            if (page >= Math.ceil(tableTotal / pageSize)) {
              scrollCallback(false);
              return;
            }
            let next = page + 1;
            const max = Math.ceil(tableTotal / pageSize);
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
            const max = Math.ceil(tableTotal / pageSize);
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
          <div className="flex justify-between py-3 px-3 bg-gray-800">
            <div className="flex leading-6 text-gray-300 gap-x-2">
              <span>
                共有<span className="pl-1 pr-1 text-sm text-primary-100">{total}</span>条
              </span>
              <span>
                过桥成交单合并后共计
                <span className="pl-1 pr-1 text-sm text-orange-100">{mergeTotal}</span>条
              </span>
            </div>
            <Pagination
              showQuickJumper
              showSizeChanger={false}
              current={page}
              pageSize={pageSize}
              total={tableTotal}
              prefetch={p => prefetch({ page: p })}
              onChange={val => setPage(val)}
            />
          </div>
        </div>
      </div>

      <TableColumnSettingsModalInner<ReceiptDealTableColumnKey>
        visible={columnSettingsMdlOpen}
        columnSettings={columnSettings}
        onSubmit={val => {
          handleColumnSettingsUpdate(val);
          message.success('保存成功');
          setColumnSettingsMdlOpen(false);
        }}
        onReset={() => {
          handleColumnSettingsUpdate(getDefaultReceiptDealTableColumnSettings(productType));
          message.success('保存成功');
          setColumnSettingsMdlOpen(false);
        }}
        onCancel={() => setColumnSettingsMdlOpen(false)}
      />

      <ReceiptDealContextMenu selectedReceiptDealList={selectedList} />
    </>
  );
};
