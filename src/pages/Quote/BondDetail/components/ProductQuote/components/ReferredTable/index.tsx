import { Dispatch, SetStateAction, useCallback, useEffect, useMemo, useState } from 'react';
import cx from 'classnames';
import { BondQuoteTableColumnKey } from '@fepkg/business/components/QuoteTableCell/types';
import { ReferTypeOptions } from '@fepkg/business/constants/options';
import { Button } from '@fepkg/components/Button';
import { Caption } from '@fepkg/components/Caption';
import { message } from '@fepkg/components/Message';
import { Pagination } from '@fepkg/components/Pagination';
import { Select } from '@fepkg/components/Select';
import { Table, TableSelectEventHandler, TableSorter } from '@fepkg/components/Table';
import { IconMenuFold, IconMenuUnfold } from '@fepkg/icon-park-react';
import { ProductType, QuoteSortedField, RefType, Side, UserHotkeyFunction } from '@fepkg/services/types/enum';
import { ColumnOrderState } from '@tanstack/react-table';
import { useMemoizedFn } from 'ahooks';
import moment from 'moment';
import { useDialogWindow } from '@/common/hooks/useDialog';
import useOnlineOpenDialog from '@/common/hooks/useOnlineOpenDialog';
import { mulUnrefBondQuoteWithUndo } from '@/common/undo-services';
import { copyQuotes, copyQuotesByID } from '@/common/utils/copy';
import { userHotkeyManager } from '@/common/utils/hotkey';
import { trackPoint } from '@/common/utils/logger/point';
import { QuoteTrigger } from '@/components/Quote/types';
import { TableColumnSettingsModal } from '@/components/TableColumnSettingsModal';
import { BasicTableColumn } from '@/pages/ProductPanel/components/BasicTable/types';
import { ProductPanelTableKey } from '@/pages/ProductPanel/types';
import { getUnreferParamsByQuoteLite } from '@/pages/ProductPanel/utils';
import { useTableAllSelect } from '@/pages/Quote/BondDetail/hooks/useTableAllSelect';
import { useDetailPanel } from '@/pages/Quote/BondDetail/providers/DetailPanelProvider';
import { RangeValue } from '@/pages/Quote/BondDetail/type';
import { PAGE_SIZE, getDateRange } from '@/pages/Quote/BondDetail/utils';
import { QuoteActionMode, QuoteFocusInputType } from '@/pages/Quote/SingleQuote/types';
import { getSingleQuoteDialogConfig } from '@/pages/Quote/SingleQuote/utils';
import { useReferredTableData } from '../../../../hooks/useReferredTableData';
import { BondDetailTableType, getDefaultTableSettingItem } from '../../../ColumnSettings/data';
import { useTableColumnSetting, useTableColumnSettingMutation } from '../../../ColumnSettings/useColumnSettings';
import DateRangePicker from '../DateRangePicker';
import { getColumns } from './columns';
import styles from '../../style.module.less';

type ReferredTableProps = {
  productType: ProductType;
  key_market?: string;
  dealVisible: boolean;
  setDealVisible: Dispatch<SetStateAction<boolean>>;
  bondSelected: boolean;
  setBottomSelected: Dispatch<SetStateAction<boolean>>;
  onResizeIconClick?: () => void;
};

const ReferredTable = ({
  productType,
  key_market,
  dealVisible,
  setDealVisible,
  bondSelected,
  setBottomSelected,
  onResizeIconClick
}: ReferredTableProps) => {
  const { accessCache } = useDetailPanel();

  const [dateRange, setDateRange] = useState<RangeValue>(() => [moment().add(-1, 'month'), moment()]);
  const [referTypeList, setReferTypeList] = useState<RefType[]>();
  const [page, setPage] = useState(1);
  const [sorter, setSorter] = useState<TableSorter<QuoteSortedField>>();
  const [selectedRowKeys, setSelectedRowKeys] = useState(new Set<string>());
  const [ref, active] = useTableAllSelect();

  const { beforeOpenDialogWindow } = useOnlineOpenDialog();
  const { openDialog } = useDialogWindow();

  const columns = useMemo(() => getColumns(productType), [productType]);

  /** 处理选择撤销类型的回调 */
  const handleSelectRefer = (val: RefType[]) => {
    setReferTypeList(val);
  };

  const handleColumnSortChange = useMemoizedFn((newSorter: TableSorter<QuoteSortedField>) => {
    setSorter(newSorter);
    setPage(1);
  });

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

  const { data, refetch } = useReferredTableData({
    productType,
    key_market,
    page,
    sorter,
    dateRange: getDateRange(dateRange),
    referTypeList
  });

  const selectedQuoteList = useMemo(() => {
    return data?.list?.filter(i => selectedRowKeys.has(i.original.quote_id) ?? []).map(i => i.original) ?? [];
  }, [data?.list, selectedRowKeys]);
  /** 是否有选择 STC 报价 */
  // const hasSelectedSTCQuote = useMemo(() => getHasSTCQuote(selectedQuoteList), [selectedQuoteList]);
  const hasSelectedSTCQuote = false;

  const { columnSettings } = useTableColumnSetting({ productType, type: BondDetailTableType.QuoteReferred });
  const { updateColumnSetting } = useTableColumnSettingMutation({
    productType,
    type: BondDetailTableType.QuoteReferred
  });

  const [columnSettingsMdlOpen, setColumnSettingsMdlOpen] = useState(false);

  const handleColumnSettingTrigger = useMemoizedFn(() => {
    setColumnSettingsMdlOpen(true);
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

  const handleSelect: TableSelectEventHandler = useMemoizedFn((keys, evt) => {
    setSelectedRowKeys(keys);
    const selectedQuotes = data?.list?.filter(item => keys.has(item.original.quote_id)).map(item => item.original);
    if (selectedQuotes) {
      copyQuotes(selectedQuotes, ProductPanelTableKey.Referred, evt?.altKey);
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

  const handleCellDoubleClick = useMemoizedFn((_, original, key) => {
    if (!beforeOpenDialogWindow()) return;
    if (!accessCache.quote) return;

    const { side } = original.original;
    let field = '';
    if (side === Side.SideBid) field += 'BID_';
    if (side === Side.SideOfr) field += 'OFR_';
    if (key === 'volume') field += 'VOL';
    else field += 'PRICE';
    const focusInput = QuoteFocusInputType[field];

    trackPoint(QuoteTrigger.TABLE_DBLCLICK);
    const { config, callback } = getSingleQuoteDialogConfig(productType, {
      defaultValue: original.original,
      activeTableKey: ProductPanelTableKey.Referred,
      disabled: hasSelectedSTCQuote,
      focusInput,
      actionMode: QuoteActionMode.EDIT_UNREFER,
      onSuccess: () => {
        refetch();
      }
    });
    openDialog(config, { ...callback, showOfflineMsg: false });
  });

  const actionUnRefer = useCallback(async () => {
    if (selectedRowKeys.size === 0) {
      message.error('没有选择要操作的数据！');
      return;
    }
    if (hasSelectedSTCQuote) {
      message.error('修改失败，存在不可被修改的报价！');
      return;
    }

    const params = await getUnreferParamsByQuoteLite(selectedQuoteList, productType);
    if (params.quote_item_list?.length) {
      await mulUnrefBondQuoteWithUndo(params, { origin: selectedQuoteList, productType });
    }
    copyQuotesByID(
      productType,
      undefined,
      (params.quote_item_list ?? []).map(
        qu => (data?.list ?? []).find(q => q.original.quote_id === qu.quote_id)!.original
      )
    );

    setSelectedRowKeys(new Set<string>());
  }, [selectedRowKeys.size, hasSelectedSTCQuote, selectedQuoteList, productType, data?.list]);

  useEffect(() => {
    userHotkeyManager.register(UserHotkeyFunction.UserHotkeyQuoteUnRefer, actionUnRefer);
  }, [actionUnRefer]);

  const hasVisibleColumn = useMemo(() => {
    if (columnSettings) {
      const showColsLength = columnSettings.filter(item => item.visible).length;
      if (showColsLength === 0) {
        return false;
      }
    }
    return true;
  }, [columnSettings]);

  return (
    <>
      <div className="flex items-center justify-between mb-3">
        <Caption type="orange">Referred</Caption>
        <div className={cx('flex items-center gap-3', styles.quoteTypeSelectDark, styles.dateRangePickerWhiteText)}>
          <Select
            label="撤销类型"
            labelWidth={72}
            className="w-[168px] h-7 bg-gray-800"
            placeholder="请选择"
            multiple
            clearIcon={null}
            destroyOnClose
            tags={false}
            options={ReferTypeOptions}
            value={referTypeList}
            onChange={handleSelectRefer}
          />

          <DateRangePicker
            dateRange={dateRange}
            setDateRange={setDateRange}
          />

          <Button.Icon
            className="w-7 h-7"
            icon={!dealVisible ? <IconMenuUnfold /> : <IconMenuFold />}
            onClick={() => {
              setDealVisible(!dealVisible);
              onResizeIconClick?.();
            }}
          />
        </div>
      </div>

      <div
        className="relative h-[calc(100%_-_90px)]"
        ref={ref}
      >
        <Table<BasicTableColumn, BondQuoteTableColumnKey, QuoteSortedField>
          className="rounded-t-lg bg-gray-800 border border-solid border-gray-600 border-b-0"
          zebra
          data={data?.list ?? []}
          columns={columns}
          rowKey={original => original.original.quote_id}
          sorter={sorter}
          onColumnSortChange={handleColumnSortChange}
          onColumnOrderChange={handleColumnOrderChange}
          columnSettings={columnSettings}
          onColumnSettingTrigger={handleColumnSettingTrigger}
          onColumnResizeEnd={handleColumnResizeEnd}
          selectedKeys={selectedRowKeys}
          onSelect={handleSelect}
          onCellDoubleClick={handleCellDoubleClick}
          placeholderSize="xs"
          showPlaceholder={false}
          active={active}
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
          updateColumnSetting(getDefaultTableSettingItem(productType, BondDetailTableType.QuoteReferred), {
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

export default ReferredTable;
