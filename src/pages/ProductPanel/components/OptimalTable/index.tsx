import { MouseEvent, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import cx from 'classnames';
import { BondQuoteTableColumnKey } from '@fepkg/business/components/QuoteTableCell/types';
import { Pagination } from '@fepkg/components/Pagination';
import { Portal } from '@fepkg/components/Portal';
import { Table } from '@fepkg/components/Table';
import { TableSelectEventHandler, TableSorter } from '@fepkg/components/Table/types';
import { FiccBondBasic, QuoteLite } from '@fepkg/services/types/common';
import { QuoteSortedField, Side } from '@fepkg/services/types/enum';
import { ColumnOrderState } from '@tanstack/react-table';
import { useMemoizedFn } from 'ahooks';
import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import { isEqual } from 'lodash-es';
import { getPollingAPIPageCount } from '@/common/ab-rules';
import { useDialogWindow } from '@/common/hooks/useDialog';
import useOnlineOpenDialog from '@/common/hooks/useOnlineOpenDialog';
import { copyQuotes } from '@/common/utils/copy';
import { trackPoint } from '@/common/utils/logger/point';
import { deepQuoteIsCheckedAtom } from '@/components/DeepQuote';
import { QuoteTrigger } from '@/components/Quote/types';
import { ShortcutSidebar, ShortcutSidebarPropsProvider } from '@/components/ShortcutSidebar';
import { TCellContextMenu } from '@/components/TCellContextMenu/ContextMenu';
import { GlobalSearchOptionType } from '@/components/business/GlobalSearch/types';
import { useProductParams } from '@/layouts/Home/hooks';
import {
  bondTablePageAtom,
  bondTableSelectedRowKeysAtom,
  bondTableSorterAtom,
  getTableSettingsAtom,
  optimalTablePageAtom,
  optimalTableSelectedRowKeysAtom,
  optimalTableSorterAtom,
  tableColumnSettingsMdlOpenAtom,
  tableCtxMenuOpenAtom,
  tableCtxMenuPositionAtom
} from '@/pages/ProductPanel/atoms/table';
import {
  deepQuoteModalPositionAtom,
  hoverOptimalCellAtom,
  selectedSideAtom
} from '@/pages/ProductPanel/components/OptimalTable/atoms';
import { getDeepQuoteModalPosition } from '@/pages/ProductPanel/utils';
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
import { CellTooltip } from './CellTooltip';
import { getColumns } from './columns';
import { TABLE_CELL_CLASS_NAME } from './constants';
import { OptimalTableColumn, OptimalTableMouseEvent, OptimalTableSideInfo } from './types';
import { useOptimalTableData } from './useTableData';
import './index.less';

const sideSelectedClsMap = {
  [Side.SideBid]: 'selected-side-bid',
  [Side.SideOfr]: 'selected-side-ofr'
};

export const OptimalTable = ({ unquoted = false }) => {
  // --- OptimalTable 独有逻辑 start ---
  const [selectedSide, setSelectedSide] = useAtom(selectedSideAtom);
  // --- OptimalTable 独有逻辑 end ---

  const { productType } = useProductParams();
  const { accessCache, sidebarRef, activeTableKey, groupStoreKey } = useProductPanel();
  const { delayedActiveGroupState: activeGroup, modifyLocalGroup, bondFilterRef } = useMainGroupData();

  const [updateGlobalSearch] = useUpdateGlobalSearchValue(groupStoreKey, useResetTablePage);
  const { beforeOpenDialogWindow } = useOnlineOpenDialog();
  const { openDialog } = useDialogWindow();

  /** 当前组件的表格 Key */
  const tableKey = unquoted ? ProductPanelTableKey.Bond : ProductPanelTableKey.Optimal;
  /** 当前组件是否处于激活状态 */
  const active = tableKey === activeTableKey;

  const pageSize = useMemo(() => getPollingAPIPageCount(), []);

  const columns = useMemo(() => getColumns(productType), [productType]);

  const [page, setPage] = useAtom(useMemo(() => (unquoted ? bondTablePageAtom : optimalTablePageAtom), [unquoted]));
  const [sorter, setSorter] = useAtom(
    useMemo(() => (unquoted ? bondTableSorterAtom : optimalTableSorterAtom), [unquoted])
  );
  const [selectedRowKeys, setSelectedRowKeys] = useAtom(
    useMemo(() => (unquoted ? bondTableSelectedRowKeysAtom : optimalTableSelectedRowKeysAtom), [unquoted])
  );
  const [columnSettings, setColumnSettings] = useAtom(
    useMemo(() => getTableSettingsAtom(productType, tableKey), [productType, tableKey])
  );

  const setColumnSettingsMdlOpen = useSetAtom(tableColumnSettingsMdlOpenAtom);
  const setCtxMenuOpen = useSetAtom(tableCtxMenuOpenAtom);
  const setCtxMenuPosition = useSetAtom(tableCtxMenuPositionAtom);

  const { data, prefetch, handleRefetch, optimisticUpdate } = useOptimalTableData(unquoted, pageSize, active);
  const total = data?.total || 0;

  const selectedRowList = useMemo(
    () => data?.list?.filter(item => selectedRowKeys.has(item.original.bond_basic_info.code_market)) ?? [],
    [data, selectedRowKeys]
  );

  const selectedQuoteList = useMemo(() => {
    if (!selectedSide) return [];
    return (
      selectedRowList
        ?.map(({ original, bidInfo, ofrInfo }) => {
          const { bond_basic_info: bond_info, quote_id_ext_bid, quote_id_ext_ofr } = original;

          let editQuote: QuoteLite | undefined;
          if (selectedSide === Side.SideBid) {
            if (bidInfo.intShowOptimal) editQuote = bidInfo.optimalQuote;
            else editQuote = quote_id_ext_bid !== '0' ? bidInfo.extOptimalQuote : bidInfo.intOptimalQuote;
          } else if (selectedSide === Side.SideOfr) {
            if (ofrInfo.intShowOptimal) editQuote = ofrInfo.optimalQuote;
            else editQuote = quote_id_ext_ofr !== '0' ? ofrInfo.extOptimalQuote : ofrInfo.intOptimalQuote;
          }

          if (editQuote) editQuote.bond_basic_info = bond_info;
          return editQuote as QuoteLite;
        })
        .filter(Boolean) ?? []
    );
  }, [selectedRowList, selectedSide]);
  const selectedBondList = useMemo(() => selectedRowList.map(item => item.original.bond_basic_info), [selectedRowList]);

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

    const selectedQuotes = data?.list
      ?.map(item => item.original)
      .filter(item => keys.has(item.bond_basic_info.code_market));

    if (selectedQuotes) {
      copyQuotes(selectedQuotes, ProductPanelTableKey.Optimal, evt?.altKey);
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
        columnSettings[settingIdx].width = width;
        handleColumnSettingsUpdate(columnSettings);
      }
    }
  });

  const handleColumnSettingTrigger = () => {
    setColumnSettingsMdlOpen(true);
  };

  const handleCellContextMenu: OptimalTableMouseEvent = useMemoizedFn((evt, _, key) => {
    switch (key) {
      case BondQuoteTableColumnKey.CpBid:
      case BondQuoteTableColumnKey.Bid:
      case BondQuoteTableColumnKey.NBid:
      case BondQuoteTableColumnKey.VolumeBid:
      case BondQuoteTableColumnKey.CpOfr:
      case BondQuoteTableColumnKey.Ofr:
      case BondQuoteTableColumnKey.NOfr:
      case BondQuoteTableColumnKey.VolumeOfr:
        setCtxMenuOpen(true);
        setCtxMenuPosition({ x: evt.pageX, y: evt.pageY });
        break;
      default:
        break;
    }
  });

  // --- DeepTable 独有逻辑 start ---
  const hasCheckedDeepQuoteModal = useAtomValue(deepQuoteIsCheckedAtom);
  const [hoverOptimalCellOrigin, setHoverOptimalCellOrigin] = useAtom(hoverOptimalCellAtom);
  const [deepQuoteMdlPosition, setDeepQuoteMdlPosition] = useAtom(deepQuoteModalPositionAtom);
  const [deepQuoteMdlOpen, setDeepQuoteMdlOpen] = useState(false);
  const [hasChecked, setHasChecked] = useAtom(deepQuoteIsCheckedAtom);
  const enterTimer = useRef<NodeJS.Timeout | null>(null);
  const leaveTimer = useRef<NodeJS.Timeout | null>(null);
  const tableLeaveTimer = useRef<NodeJS.Timeout | null>(null);

  const updateDeepQuoteMdlOpen = useMemoizedFn((visible: boolean) => {
    if (!visible) {
      setHasChecked(false);
      setHoverOptimalCellOrigin(undefined);
    }
    setDeepQuoteMdlOpen(visible);
  });

  const clearEnterTimer = () => {
    if (enterTimer.current) {
      clearTimeout(enterTimer.current);
      enterTimer.current = null;
    }
  };

  const clearLeaveTimer = () => {
    if (leaveTimer.current) {
      clearTimeout(leaveTimer.current);
      leaveTimer.current = null;
    }
  };

  const clearTableLeaveTimer = () => {
    if (tableLeaveTimer.current) {
      clearTimeout(tableLeaveTimer.current);
      tableLeaveTimer.current = null;
    }
  };

  const toggleVisible = useCallback(() => {
    clearEnterTimer();
    enterTimer.current = setTimeout(() => {
      updateDeepQuoteMdlOpen(true);
    }, 618);
  }, [updateDeepQuoteMdlOpen]);

  const openSingleBondDetail = useMemoizedFn(
    (bond_info: FiccBondBasic, bidInfo: OptimalTableSideInfo, ofrInfo: OptimalTableSideInfo) => {
      if (!accessCache.detail) return;

      /**
       * 剩余期限代码 简称 双击弹出单券详情弹窗
       */
      let quoteLite =
        bidInfo.optimalQuote ||
        bidInfo.extOptimalQuote ||
        bidInfo.intOptimalQuote ||
        ofrInfo.optimalQuote ||
        ofrInfo.extOptimalQuote ||
        ofrInfo.intOptimalQuote;
      if (!quoteLite) quoteLite = { bond_basic_info: bond_info } as QuoteLite;
      else quoteLite.bond_basic_info = bond_info;

      openDialog(
        getSingleBondDetailDialogConfig(productType, { data: quoteLite, tableKey: activeTableKey, bond_info })
      );
    }
  );

  const handleSearch = useMemoizedFn((user_input: string, id: string, type: GlobalSearchOptionType) => {
    updateDeepQuoteMdlOpen(false);
    setHoverOptimalCellOrigin(undefined);
    clearEnterTimer();

    const params = { groupId: activeGroup?.groupId };

    if (type === GlobalSearchOptionType.BROKER) {
      updateGlobalSearch({ ...params, inputFilter: { user_input, broker_id_list: [id] } });
    } else if (type === GlobalSearchOptionType.TRADER) {
      updateGlobalSearch({ ...params, inputFilter: { user_input, trader_id_list: [id] } });
    }
  });

  const handleCellMouseDown: OptimalTableMouseEvent = useMemoizedFn((_, __, key) => {
    switch (key) {
      case BondQuoteTableColumnKey.CpBid:
      case BondQuoteTableColumnKey.Bid:
      case BondQuoteTableColumnKey.NBid:
      case BondQuoteTableColumnKey.VolumeBid:
        if (selectedSide == undefined) {
          setSelectedSide(Side.SideBid);
        }
        break;
      case BondQuoteTableColumnKey.CpOfr:
      case BondQuoteTableColumnKey.Ofr:
      case BondQuoteTableColumnKey.NOfr:
      case BondQuoteTableColumnKey.VolumeOfr:
        if (selectedSide == undefined) {
          setSelectedSide(Side.SideOfr);
        }
        break;
      default:
        setSelectedSide(undefined);
        break;
    }
  });

  const handleCellMouseUp: OptimalTableMouseEvent = useMemoizedFn((_, __, key) => {
    switch (key) {
      case BondQuoteTableColumnKey.CpBid:
      case BondQuoteTableColumnKey.Bid:
      case BondQuoteTableColumnKey.NBid:
      case BondQuoteTableColumnKey.VolumeBid:
        setSelectedSide(Side.SideBid);
        break;
      case BondQuoteTableColumnKey.CpOfr:
      case BondQuoteTableColumnKey.Ofr:
      case BondQuoteTableColumnKey.NOfr:
      case BondQuoteTableColumnKey.VolumeOfr:
        setSelectedSide(Side.SideOfr);
        break;
      default:
        setSelectedSide(undefined);
        break;
    }
  });

  const handleCellDoubleClick: OptimalTableMouseEvent = useMemoizedFn((_, original, key) => {
    if (!beforeOpenDialogWindow()) return;

    const {
      bond_basic_info,
      quote_id_ext_bid,
      quote_id_ext_ofr,
      quote_bid_list = [],
      quote_ofr_list = []
    } = original.original;
    const { bidInfo, ofrInfo } = original;

    let editQuote: QuoteLite | undefined;
    let focusInput: QuoteFocusInputType | undefined;
    let actionMode = QuoteActionMode.EDIT;

    /** 当选中多条债券，但所有报价的信息都为空时，禁用「新报价」、「编辑」功能 */
    const editDisabled = !accessCache.quote || (selectedBondList.length > 1 && !selectedQuoteList.length);

    switch (key) {
      case BondQuoteTableColumnKey.FirstMaturityDate:
      case BondQuoteTableColumnKey.BondCode:
      case BondQuoteTableColumnKey.ShortName:
        if (!accessCache.detail) return;

        openSingleBondDetail(bond_basic_info, bidInfo, ofrInfo);
        break;
      case BondQuoteTableColumnKey.Bid:
      case BondQuoteTableColumnKey.NBid:
      case BondQuoteTableColumnKey.VolumeBid:
      case BondQuoteTableColumnKey.Ofr:
      case BondQuoteTableColumnKey.NOfr:
      case BondQuoteTableColumnKey.VolumeOfr: {
        if (editDisabled) return;

        const { config: quoteConfig, callback: quoteCallback } = getSingleQuoteDialogConfig(productType, {
          defaultValue: editQuote,
          activeTableKey,
          actionMode,
          disabled: hasSelectedSTCQuote,
          focusInput,

          onSuccess: () => {
            handleRefetch();
          }
        });

        let side: Side | undefined;

        // TODO 这块逻辑与上述计算 selectQuotes 的逻辑是一致的，后续可以抽出去
        if (
          [BondQuoteTableColumnKey.Bid, BondQuoteTableColumnKey.NBid, BondQuoteTableColumnKey.VolumeBid].includes(key)
        ) {
          side = Side.SideBid;
          // 暗盘显示最优时，默认对该方向上最优报价进行修改
          if (bidInfo.intShowOptimal) {
            editQuote = bidInfo.optimalQuote;
          } else {
            // 暗盘不显示最优时，默认对该方向上明盘最优报价进行修改，除非明盘没有价格，则对暗盘最优进行修改
            editQuote = quote_id_ext_bid !== '0' ? bidInfo.extOptimalQuote : bidInfo.intOptimalQuote;
          }
          if (key === BondQuoteTableColumnKey.VolumeBid) {
            focusInput = QuoteFocusInputType.BID_VOL;
          } else {
            focusInput = QuoteFocusInputType.BID_PRICE;
          }
          if (quote_bid_list?.length <= 0) actionMode = QuoteActionMode.JOIN;
        } else if (
          [BondQuoteTableColumnKey.Ofr, BondQuoteTableColumnKey.NOfr, BondQuoteTableColumnKey.VolumeOfr].includes(key)
        ) {
          side = Side.SideOfr;
          if (ofrInfo.intShowOptimal) {
            editQuote = ofrInfo.optimalQuote;
          } else {
            editQuote = quote_id_ext_ofr !== '0' ? ofrInfo.extOptimalQuote : ofrInfo.intOptimalQuote;
          }
          if (key === BondQuoteTableColumnKey.VolumeOfr) {
            focusInput = QuoteFocusInputType.OFR_VOL;
          } else {
            focusInput = QuoteFocusInputType.OFR_PRICE;
          }
          if (quote_ofr_list?.length <= 0) actionMode = QuoteActionMode.JOIN;
        }

        if (!editQuote) editQuote = { bond_basic_info, side } as QuoteLite;
        else editQuote.bond_basic_info = bond_basic_info;

        trackPoint(QuoteTrigger.TABLE_DBLCLICK);

        openDialog(
          {
            ...quoteConfig,
            custom: {
              ...quoteConfig.custom,
              context: { ...quoteConfig.custom.context, defaultValue: editQuote, focusInput, actionMode }
            }
          },
          { showOfflineMsg: false, ...quoteCallback }
        );
        break;
      }
      case BondQuoteTableColumnKey.CpBid: {
        if (editDisabled) return;

        const { config: cpBidConfig, callback: cpBidCallback } = getSingleQuoteDialogConfig(productType, {
          defaultValue: { bond_basic_info, side: Side.SideBid },
          activeTableKey,
          focusInput: QuoteFocusInputType.BID_PRICE,
          disabled: hasSelectedSTCQuote,
          actionMode: QuoteActionMode.JOIN,

          onSuccess: () => {
            handleRefetch();
          }
        });

        if (!bidInfo.optimalQuote) {
          openDialog(cpBidConfig, { showOfflineMsg: false, ...cpBidCallback });
          return;
        }
        if (bidInfo.traderName && bidInfo.traderId) {
          handleSearch(`TJ:${bidInfo.traderName}`, bidInfo.traderId, GlobalSearchOptionType.TRADER);
        }
        break;
      }
      case BondQuoteTableColumnKey.BrokerB:
        if (bidInfo.brokerName && bidInfo.brokerId) {
          handleSearch(`BJ:${bidInfo.brokerName}`, bidInfo.brokerId, GlobalSearchOptionType.BROKER);
        }
        break;
      case BondQuoteTableColumnKey.CpOfr: {
        if (editDisabled) return;

        const { config: cpOfrConfig, callback: cpOfrCallback } = getSingleQuoteDialogConfig(productType, {
          defaultValue: { bond_basic_info, side: Side.SideOfr },
          activeTableKey,
          focusInput: QuoteFocusInputType.OFR_PRICE,
          disabled: hasSelectedSTCQuote,
          actionMode: QuoteActionMode.JOIN,

          onSuccess: () => {
            handleRefetch();
          }
        });

        if (!ofrInfo.optimalQuote) {
          openDialog(cpOfrConfig, { showOfflineMsg: false, ...cpOfrCallback });
          return;
        }
        if (ofrInfo.traderName && ofrInfo.traderId) {
          handleSearch(`TJ:${ofrInfo.traderName}`, ofrInfo.traderId, GlobalSearchOptionType.TRADER);
        }
        break;
      }
      case BondQuoteTableColumnKey.BrokerO:
        if (ofrInfo.brokerName && ofrInfo.brokerId) {
          handleSearch(`BJ:${ofrInfo.brokerName}`, ofrInfo.brokerId, GlobalSearchOptionType.BROKER);
        }
        break;
      default:
        break;
    }
  });

  const toggleMouseEvent = useMemoizedFn(
    (evt: MouseEvent<HTMLDivElement>, original: OptimalTableColumn, key: BondQuoteTableColumnKey) => {
      const target = evt.target as HTMLDivElement;
      const ev = target.matches(TABLE_CELL_CLASS_NAME)
        ? target
        : (target.closest(TABLE_CELL_CLASS_NAME) as HTMLDivElement);

      if (!ev) return;

      if (hasChecked) {
        toggleVisible();
        return;
      }

      switch (key) {
        case BondQuoteTableColumnKey.FirstMaturityDate:
        case BondQuoteTableColumnKey.BondCode:
        case BondQuoteTableColumnKey.ShortName:
          updateDeepQuoteMdlOpen(false);
          break;
        default:
          if (original.subRows) {
            updateDeepQuoteMdlOpen(false);
            break;
          }
          setHoverOptimalCellOrigin(prev => {
            clearLeaveTimer();
            if (prev?.original.bond_basic_info.code_market !== original?.original?.bond_basic_info?.code_market) {
              const { left, right, top, bottom } = getDeepQuoteModalPosition(ev, original);
              setDeepQuoteMdlPosition([left, right, top, bottom]);
              if (!hasChecked) {
                updateDeepQuoteMdlOpen(false);
              }
              return original;
            }
            return prev;
          });
          toggleVisible();
      }
    }
  );

  const handleCellMouseEnter: OptimalTableMouseEvent = useMemoizedFn((evt, original, key) => {
    toggleMouseEvent(evt, original, key);
  });

  const handleCellMouseLeave: OptimalTableMouseEvent = useMemoizedFn(() => {
    if (hasChecked) return;
    leaveTimer.current = setTimeout(() => {
      clearEnterTimer();
      updateDeepQuoteMdlOpen(false);
    }, 64);
  });

  const handleCellClick: OptimalTableMouseEvent = useMemoizedFn(
    (evt: MouseEvent<HTMLDivElement>, original: OptimalTableColumn, key: BondQuoteTableColumnKey) => {
      toggleMouseEvent(evt, original, key);
    }
  );

  const updateVisible = useMemoizedFn((val: boolean) => {
    setHasChecked(val);
  });

  // 动态更新深度报价窗口中的值
  useEffect(() => {
    if (!hoverOptimalCellOrigin) return;

    if (!data?.list?.length) {
      updateDeepQuoteMdlOpen(false);
      clearEnterTimer();
      return;
    }

    const currentOrigin = data.list?.find(
      v => v.original.bond_basic_info.code_market === hoverOptimalCellOrigin.original.bond_basic_info.code_market
    );

    if (!currentOrigin) {
      updateDeepQuoteMdlOpen(false);
      clearEnterTimer();
      return;
    }

    const { original } = currentOrigin;

    if (isEqual(currentOrigin.original, hoverOptimalCellOrigin.original)) return;

    if (!original.optimal_price_id_list_bid?.length && !original.optimal_price_id_list_ofr?.length) {
      updateDeepQuoteMdlOpen(false);
      clearEnterTimer();
    } else {
      setHoverOptimalCellOrigin(currentOrigin);
    }
  }, [data]);
  // --- DeepTable 独有逻辑 end ---

  return (
    <>
      <div
        className="relative flex flex-col flex-1"
        onMouseLeave={() => {
          if (hasChecked) return;
          clearEnterTimer();
          tableLeaveTimer.current = setTimeout(() => {
            setDeepQuoteMdlOpen(false);
          }, 32);
        }}
      >
        <Table<OptimalTableColumn, BondQuoteTableColumnKey, QuoteSortedField>
          className={cx(
            'optimal-table',
            'absolute left-0 right-0 top-0 bottom-[49px] !h-auto',
            selectedSide && sideSelectedClsMap[selectedSide]
          )}
          active={active}
          data={data?.list ?? []}
          pageSize={pageSize}
          columns={columns}
          rowKey={original => original.original.bond_basic_info.code_market}
          columnSettings={columnSettings}
          sorter={sorter}
          keyboardSelectAllEnabled={!hasCheckedDeepQuoteModal}
          selectedKeys={selectedRowKeys}
          zebra
          onSelect={handleSelect}
          onColumnSortChange={handleColumnSortChange}
          onColumnOrderChange={handleColumnOrderChange}
          onColumnResizeEnd={handleColumnResizeEnd}
          onColumnSettingTrigger={handleColumnSettingTrigger}
          onCellMouseDown={handleCellMouseDown}
          onCellMouseUp={handleCellMouseUp}
          onCellDoubleClick={handleCellDoubleClick}
          onCellContextMenu={handleCellContextMenu}
          onCellMouseEnter={handleCellMouseEnter}
          onCellMouseLeave={handleCellMouseLeave}
          onCellClick={handleCellClick}
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
              onChange={setPage}
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
            onOptimisticUpdate={optimisticUpdate}
            selectedSide={selectedSide}
            selectedBondList={selectedBondList}
            selectedQuoteList={selectedQuoteList}
            hasSelectedSTCQuote={hasSelectedSTCQuote}
            onEventSuccess={handleRefetch}
          >
            <ShortcutSidebar />
          </ShortcutSidebarPropsProvider>
        </Portal>
      )}

      {active && (
        <TCellContextMenu
          productType={productType}
          activeTableKey={activeTableKey}
          selectedSide={selectedSide}
          selectedBondList={selectedBondList}
          selectedQuoteList={selectedQuoteList}
          hasSelectedSTCQuote={hasSelectedSTCQuote}
          onEventSuccess={handleRefetch}
          onOptimisticUpdate={optimisticUpdate}
        />
      )}

      {hoverOptimalCellOrigin?.showContent && (
        <CellTooltip
          visible={deepQuoteMdlOpen}
          unquoted={unquoted}
          updateVisible={updateVisible}
          position={deepQuoteMdlPosition || [0, -1, 0, 0]}
          column={hoverOptimalCellOrigin}
          clearDeepQuoteTimer={() => {
            clearLeaveTimer();
            clearTableLeaveTimer();
          }}
          close={() => {
            clearEnterTimer();
            setDeepQuoteMdlOpen(false);
          }}
          shortcutDisabled={!active}
        />
      )}
    </>
  );
};
