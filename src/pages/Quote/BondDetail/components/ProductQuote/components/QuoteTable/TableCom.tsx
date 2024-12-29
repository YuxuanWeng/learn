import {
  Dispatch,
  FC,
  MutableRefObject,
  SetStateAction,
  useEffect,
  useImperativeHandle,
  useLayoutEffect,
  useMemo,
  useRef,
  useState
} from 'react';
import { BondQuoteTableColumnKey } from '@fepkg/business/components/QuoteTableCell/types';
import { message } from '@fepkg/components/Message';
import { Table, TableInstance, TableMouseEvent, TableSelectEventHandler, TableSorter } from '@fepkg/components/Table';
import { QuoteLite } from '@fepkg/services/types/common';
import { ProductType, QuoteSortedField, Side } from '@fepkg/services/types/enum';
import { QueryObserverResult, RefetchOptions, RefetchQueryFilters } from '@tanstack/react-query';
import { ColumnOrderState } from '@tanstack/react-table';
import { useMemoizedFn } from 'ahooks';
import { useSetAtom } from 'jotai';
import { useDialogWindow } from '@/common/hooks/useDialog';
import useOnlineOpenDialog from '@/common/hooks/useOnlineOpenDialog';
import { BondQuoteFetchData } from '@/common/services/hooks/useBondQuoteQuery';
import { trackPoint } from '@/common/utils/logger/point';
import { QuoteTrigger } from '@/components/Quote/types';
import { TCellContextMenu } from '@/components/TCellContextMenu/ContextMenu';
import { TableColumnSettingsModal } from '@/components/TableColumnSettingsModal';
import { tableCtxMenuOpenAtom, tableCtxMenuPositionAtom } from '@/pages/ProductPanel/atoms/table';
import { ProductPanelTableKey } from '@/pages/ProductPanel/types';
import { useBondTableData } from '@/pages/Quote/BondDetail/hooks/useBondTableData';
import { useTableAllSelect } from '@/pages/Quote/BondDetail/hooks/useTableAllSelect';
import { useDetailPanel } from '@/pages/Quote/BondDetail/providers/DetailPanelProvider';
import { QuoteActionMode, QuoteFocusInputType } from '@/pages/Quote/SingleQuote/types';
import { getSingleQuoteDialogConfig } from '@/pages/Quote/SingleQuote/utils';
import { BondDetailTableType, getDefaultTableSettingItem } from '../../../ColumnSettings/data';
import { useTableColumnSetting, useTableColumnSettingMutation } from '../../../ColumnSettings/useColumnSettings';
import { bidColumns, ofrColumns } from './columns';
import { QuoteFetchType, QuoteTableColumn } from './types';

type Props = {
  productType: ProductType;
  bondId?: string;
  quoteFlag: boolean;
  side: Side;
  selectedRowKeys: Set<string>;
  setSelectedRowKeys: Dispatch<SetStateAction<Set<string>>>;
  setAnotherSelectedRowKeys: Dispatch<SetStateAction<Set<string>>>;
  setSelectedQuoteIdList: Dispatch<SetStateAction<Set<string>>>;
  setSelectedQuoteList: Dispatch<SetStateAction<QuoteLite[]>>;
  refetchRef: MutableRefObject<
    | {
        refetch: <TPageData>(
          options?: (RefetchOptions & RefetchQueryFilters<TPageData>) | undefined
        ) => Promise<QueryObserverResult<QuoteFetchType | BondQuoteFetchData, unknown>>;
      }
    | undefined
  >;
};

type QuoteTableMouseEvent = TableMouseEvent<QuoteTableColumn, BondQuoteTableColumnKey>;

const activeTableKey = ProductPanelTableKey.Basic;

const TableCom: FC<Props> = ({
  productType,
  bondId,
  quoteFlag,
  side,
  selectedRowKeys,
  setSelectedRowKeys,
  setAnotherSelectedRowKeys,
  setSelectedQuoteIdList,
  setSelectedQuoteList,
  refetchRef
}) => {
  const { accessCache } = useDetailPanel();

  const [sorter, setSorter] = useState<TableSorter<QuoteSortedField>>();
  const { data, refetch } = useBondTableData({ productType, bondId, quoteFlag, sorter, side });

  const [ref, active] = useTableAllSelect();
  const { openDialog } = useDialogWindow();

  const { beforeOpenDialogWindow } = useOnlineOpenDialog();

  useImperativeHandle(refetchRef, () => ({
    refetch
  }));

  const tableData = useMemo(() => {
    if (sorter) {
      return data?.list?.filter(item => item.original.side === side) || [];
    }
    return data?.list || [];
  }, [data?.list, side, sorter]);

  const selectedRowList = useMemo(() => {
    return tableData?.filter(item => selectedRowKeys.has(item.original.quote_id)) ?? [];
  }, [tableData, selectedRowKeys]);

  const selectedQuoteList = useMemo(() => {
    return selectedRowList?.map(({ original }) => original).filter(Boolean) ?? [];
  }, [selectedRowList]);
  /** 是否有选择 STC 报价 */
  // const hasSelectedSTCQuote = useMemo(() => getHasSTCQuote(selectedQuoteList), [selectedQuoteList]);
  const hasSelectedSTCQuote = false;

  useEffect(() => {
    setSelectedQuoteList(selectedQuoteList);
  }, [selectedQuoteList, setSelectedQuoteList]);

  const selectedBondList = useMemo(
    () => selectedQuoteList.map(item => item.bond_basic_info).filter(Boolean),
    [selectedQuoteList]
  );

  const { columnSettings } = useTableColumnSetting({
    productType,
    type: side === Side.SideBid ? BondDetailTableType.QuoteBid : BondDetailTableType.QuoteOfr
  });

  const { updateColumnSetting } = useTableColumnSettingMutation({
    productType,
    type: side === Side.SideBid ? BondDetailTableType.QuoteBid : BondDetailTableType.QuoteOfr
  });

  const [columnSettingsMdlOpen, setColumnSettingsMdlOpen] = useState(false);
  const setCtxMenuOpen = useSetAtom(tableCtxMenuOpenAtom);
  const setCtxMenuPosition = useSetAtom(tableCtxMenuPositionAtom);

  const handleColumnSettingTrigger = useMemoizedFn(() => {
    setColumnSettingsMdlOpen(true);
  });

  const handleColumnSortChange = useMemoizedFn((newSorter: TableSorter<QuoteSortedField>) => {
    setSorter(newSorter);
  });

  const handleColumnOrderChange = useMemoizedFn((columnOrder: ColumnOrderState) => {
    if (columnSettings) {
      const sortedCols = [...columnSettings]?.sort((a, b) => columnOrder.indexOf(a.key) - columnOrder.indexOf(b.key));
      const showCols = sortedCols.filter(item => item.visible);
      const unShowCols = sortedCols.filter(item => !item.visible);
      const updatedCols = [...showCols, ...unShowCols];
      updateColumnSetting(updatedCols);
    }
  });

  const handleSelect: TableSelectEventHandler = useMemoizedFn(keys => {
    setSelectedRowKeys(keys);
    setAnotherSelectedRowKeys(new Set<string>());
    setSelectedQuoteIdList(keys);
  });

  const handleCellContextMenu: QuoteTableMouseEvent = useMemoizedFn(evt => {
    setCtxMenuOpen(true);
    setCtxMenuPosition({ x: evt.pageX, y: evt.pageY });
  });

  const handleCellDoubleClick: QuoteTableMouseEvent = useMemoizedFn((_, original, key) => {
    if (!beforeOpenDialogWindow()) return;
    if (!accessCache.quote) return;

    let field = '';
    if (side === Side.SideBid) field += 'BID_';
    if (side === Side.SideOfr) field += 'OFR_';
    if (key === 'volume') field += 'VOL';
    else field += 'PRICE';
    const focusInput = QuoteFocusInputType[field];

    trackPoint(QuoteTrigger.TABLE_DBLCLICK);

    const { config, callback } = getSingleQuoteDialogConfig(productType, {
      defaultValue: original.original,
      activeTableKey,
      disabled: hasSelectedSTCQuote,
      focusInput,
      actionMode: QuoteActionMode.EDIT,
      onSuccess: refetch
    });
    openDialog(config, { ...callback, showOfflineMsg: false });
  });

  const handleColumnResizeEnd = useMemoizedFn((key: BondQuoteTableColumnKey, width: number) => {
    if (columnSettings) {
      const settingIdx = columnSettings?.findIndex(item => item.key === key);
      if (settingIdx > -1) {
        columnSettings[settingIdx] = { ...columnSettings[settingIdx], width };
        updateColumnSetting([...columnSettings]);
      }
    }
  });

  const tableRef = useRef<TableInstance>(null);
  const isInitDataFetched = useRef(false);

  useLayoutEffect(() => {
    if (isInitDataFetched.current) return;

    if (side === Side.SideBid && data !== void 0) {
      isInitDataFetched.current = true;
      tableRef.current?.scrollTo?.({ left: 9999999 });
    }
  }, [side, data]);

  return (
    <div
      ref={ref}
      className="flex-1 overflow-hidden"
    >
      <Table<QuoteTableColumn, BondQuoteTableColumnKey, QuoteSortedField>
        className="relative rounded-lg border-solid border-[1px] border-gray-600"
        zebra
        data={tableData}
        tableRef={tableRef}
        columns={side === Side.SideBid ? bidColumns : ofrColumns}
        rowKey={row => row?.original.quote_id}
        sorter={sorter}
        onColumnSortChange={handleColumnSortChange}
        onColumnOrderChange={handleColumnOrderChange}
        columnSettings={columnSettings}
        onColumnSettingTrigger={handleColumnSettingTrigger}
        onColumnResizeEnd={handleColumnResizeEnd}
        selectedKeys={selectedRowKeys}
        onSelect={handleSelect}
        onCellDoubleClick={handleCellDoubleClick}
        onCellContextMenu={handleCellContextMenu}
        placeholderSize="xs"
        showPlaceholder={false}
        active={active}
      />
      <TCellContextMenu
        productType={productType}
        activeTableKey={activeTableKey}
        selectedSide={side}
        selectedBondList={selectedBondList}
        selectedQuoteList={selectedQuoteList}
        hasSelectedSTCQuote={hasSelectedSTCQuote}
        onEventSuccess={() => {
          refetch();
        }}
      />
      <TableColumnSettingsModal<BondQuoteTableColumnKey>
        visible={columnSettingsMdlOpen}
        columnSettings={columnSettings}
        onSubmit={val => {
          updateColumnSetting(val, {
            onSuccess: () => {
              message.success('保存成功');
              setColumnSettingsMdlOpen(false);
            }
          });
        }}
        onReset={() => {
          updateColumnSetting(
            getDefaultTableSettingItem(
              productType,
              side === Side.SideBid ? BondDetailTableType.QuoteBid : BondDetailTableType.QuoteOfr
            ),
            {
              onSuccess: () => {
                message.success('保存成功');
                setColumnSettingsMdlOpen(false);
              }
            }
          );
        }}
        onCancel={() => setColumnSettingsMdlOpen(false)}
      />
    </div>
  );
};

export default TableCom;
