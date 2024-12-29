import { Dispatch, SetStateAction, useEffect, useMemo, useState } from 'react';
import cx from 'classnames';
import { BondQuoteTableColumnKey } from '@fepkg/business/components/QuoteTableCell/types';
import { Button } from '@fepkg/components/Button';
import { Caption } from '@fepkg/components/Caption';
import { message } from '@fepkg/components/Message';
import { Pagination } from '@fepkg/components/Pagination';
import { Table, TableSelectEventHandler, TableSorter } from '@fepkg/components/Table';
import { IconMenuFold, IconMenuUnfold } from '@fepkg/icon-park-react';
import { ProductType, QuoteSortedField } from '@fepkg/services/types/enum';
import { ColumnOrderState } from '@tanstack/react-table';
import { useMemoizedFn } from 'ahooks';
import moment from 'moment';
import { useDialogWindow } from '@/common/hooks/useDialog';
import useOnlineOpenDialog from '@/common/hooks/useOnlineOpenDialog';
import { trackPoint } from '@/common/utils/logger/point';
import { DealTrace } from '@/components/ShortcutSidebar/useDealShortcutEvent';
import { TableColumnSettingsModal } from '@/components/TableColumnSettingsModal';
import { getMarketDealDialogConfig } from '@/pages/Deal/Market/MarketDealForm/utils';
import { DealTableColumn, DealTableMouseEvent } from '@/pages/ProductPanel/components/DealTable/types';
import { useDealTableData } from '@/pages/Quote/BondDetail/hooks/useDealTableData';
import { useTableAllSelect } from '@/pages/Quote/BondDetail/hooks/useTableAllSelect';
import { useDetailPanel } from '@/pages/Quote/BondDetail/providers/DetailPanelProvider';
import { RangeValue } from '@/pages/Quote/BondDetail/type';
import { PAGE_SIZE, getDateRange } from '@/pages/Quote/BondDetail/utils';
import { BondDetailTableType, getDefaultTableSettingItem } from '../../../ColumnSettings/data';
import { useTableColumnSetting, useTableColumnSettingMutation } from '../../../ColumnSettings/useColumnSettings';
import DateRangePicker from '../DateRangePicker';
import { columns } from './columns';
import styles from '../../style.module.less';

type DealTableProps = {
  productType: ProductType;
  code_market?: string;
  referredVisible: boolean;
  setReferredVisible: Dispatch<SetStateAction<boolean>>;
  bondSelected: boolean;
  setBottomSelected: Dispatch<SetStateAction<boolean>>;
  onResizeIconClick?: () => void;
};

const DealTable = ({
  productType,
  code_market,
  referredVisible,
  setReferredVisible,
  bondSelected,
  setBottomSelected,
  onResizeIconClick
}: DealTableProps) => {
  const { accessCache } = useDetailPanel();

  const [dateRange, setDateRange] = useState<RangeValue>(() => [moment().add(-1, 'month'), moment()]);
  const [page, setPage] = useState(1);
  const [sorter, setSorter] = useState<TableSorter<QuoteSortedField>>();
  const { data, handleRefetch } = useDealTableData({
    productType,
    code_market,
    page,
    sorter,
    dateRange: getDateRange(dateRange)
  });

  useEffect(() => {
    setDateRange([moment().add(-1, 'month'), moment()]);
  }, []);

  const { columnSettings } = useTableColumnSetting({ productType, type: BondDetailTableType.QuoteDeal });
  const { updateColumnSetting } = useTableColumnSettingMutation({ productType, type: BondDetailTableType.QuoteDeal });
  const [columnSettingsMdlOpen, setColumnSettingsMdlOpen] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState(new Set<string>());
  const [ref, active] = useTableAllSelect();
  const { beforeOpenDialogWindow } = useOnlineOpenDialog();
  const { openDialog } = useDialogWindow();
  const handleColumnSettingTrigger = () => {
    setColumnSettingsMdlOpen(true);
  };

  const handleColumnResizeEnd = useMemoizedFn((key: BondQuoteTableColumnKey, width: number) => {
    if (columnSettings) {
      const settingIdx = columnSettings?.findIndex(item => item.key === key);
      if (settingIdx > -1) {
        columnSettings[settingIdx] = { ...columnSettings[settingIdx], width };
        updateColumnSetting([...columnSettings]);
      }
    }
  });

  const handleColumnOrderChange = useMemoizedFn((columnOrder: ColumnOrderState) => {
    if (columnSettings) {
      const sortedCols = [...columnSettings]?.sort((a, b) => columnOrder.indexOf(a.key) - columnOrder.indexOf(b.key));
      const showCols = sortedCols.filter(item => item.visible);
      const unShowCols = sortedCols.filter(item => !item.visible);
      const updatedCols = showCols.concat(unShowCols);
      updateColumnSetting(updatedCols);
    }
  });

  const handleColumnSortChange = useMemoizedFn((newSorter: TableSorter<QuoteSortedField>) => {
    setSorter(newSorter);
    setPage(1);
  });

  const hasVisibleColumn = useMemo(() => {
    if (columnSettings) {
      const showColsLength = columnSettings.filter(item => item.visible).length;
      if (showColsLength === 0) {
        return false;
      }
    }
    return true;
  }, [columnSettings]);

  useEffect(() => {
    if (selectedRowKeys.size > 0) {
      setBottomSelected(true);
    } else {
      setBottomSelected(false);
    }
  }, [selectedRowKeys]);

  useEffect(() => {
    if (bondSelected) {
      setSelectedRowKeys(new Set<string>());
    }
  }, [bondSelected]);

  const handleSelect: TableSelectEventHandler = useMemoizedFn(keys => {
    setSelectedRowKeys(keys);
  });

  const handleCellDoubleClick: DealTableMouseEvent = useMemoizedFn((_, original) => {
    if (!beforeOpenDialogWindow()) return;
    if (!accessCache.deal) return;

    trackPoint(DealTrace.TableDblClick);
    const config = getMarketDealDialogConfig(productType, {
      defaultValue: original.original,
      defaultBondReadOnly: true,
      defaultFocused: 'price',
      onSuccess: handleRefetch
    });
    openDialog(config, { showOfflineMsg: false, onSuccess: handleRefetch });
  });

  const disabledRowKeys = useMemo(
    () => new Set(data?.list?.filter(item => item.original.nothing_done)?.map(item => item.original.deal_id) ?? []),
    [data]
  );

  return (
    <>
      <div className="flex justify-between items-center mb-3 truncate">
        <Caption>市场成交</Caption>
        <div className={cx('flex items-center', styles.dateRangePickerWhiteText)}>
          <DateRangePicker
            dateRange={dateRange}
            setDateRange={setDateRange}
          />

          <Button.Icon
            className="w-7 h-7 ml-3"
            icon={referredVisible ? <IconMenuUnfold /> : <IconMenuFold />}
            onClick={() => {
              setReferredVisible(!referredVisible);
              onResizeIconClick?.();
            }}
          />
        </div>
      </div>

      <div
        className="relative h-[calc(100%_-_90px)]"
        ref={ref}
      >
        <Table<DealTableColumn, BondQuoteTableColumnKey, QuoteSortedField>
          className="rounded-t-lg bg-gray-800 border border-solid border-gray-600 border-b-0"
          zebra
          data={data?.list ?? []}
          columns={columns}
          rowKey={original => original.original.deal_id}
          sorter={sorter}
          columnSettings={columnSettings}
          onColumnSortChange={handleColumnSortChange}
          onColumnOrderChange={handleColumnOrderChange}
          onColumnSettingTrigger={handleColumnSettingTrigger}
          onColumnResizeEnd={handleColumnResizeEnd}
          placeholderSize="xs"
          selectedKeys={selectedRowKeys}
          onSelect={handleSelect}
          active={active}
          showPlaceholder={false}
          onCellDoubleClick={handleCellDoubleClick}
          disabledKeys={disabledRowKeys}
        />
        {hasVisibleColumn && (
          <>
            <div className="component-dashed-x-600 w-full bg-gray-800 h-px border border-y-0 border-gray-600 border-solid" />
            <div className="flex overflow-hidden rounded-b-lg justify-between py-3 px-4 bg-gray-800 border border-t-0 border-gray-600 border-solid">
              <div className="text-gray-300 flex items-center text-xs">
                共有<span className="pl-1 pr-1 text-primary-100 text-sm">{data?.total ?? 0}</span>条
              </div>
              <Pagination
                showSizeChanger={false}
                current={page}
                pageSize={PAGE_SIZE}
                total={data?.total ?? 0}
                onChange={setPage}
                showQuickJumper={typeof data?.total === 'number' && data.total > 250}
              />
            </div>
          </>
        )}
      </div>

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
          updateColumnSetting(getDefaultTableSettingItem(productType, BondDetailTableType.QuoteDeal), {
            onSuccess: () => {
              message.success('保存成功');
              setColumnSettingsMdlOpen(false);
            }
          });
        }}
        onCancel={() => setColumnSettingsMdlOpen(false)}
      />
    </>
  );
};

export default DealTable;
