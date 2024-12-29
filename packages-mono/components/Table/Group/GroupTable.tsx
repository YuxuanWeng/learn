import { useMemo } from 'react';
import cx from 'classnames';
import { usePropsValue } from '@fepkg/common/hooks';
import { ColumnOrderState, getCoreRowModel, useReactTable } from '@tanstack/react-table';
import * as utils from '../utils';
import { TableRender } from '../TableRender';
import { GROUP_FOOTER_ID, GROUP_HEADER_ID } from '../constants';
import { useGroupKeyAllSelect } from '../hooks/useGroupKeyAllSelect';
import { useTableColumnOrder } from '../hooks/useTableColumnOrder';
import { useTableColumnSizing } from '../hooks/useTableColumnSizing';
import { useTableColumnVisibility } from '../hooks/useTableColumnVisibility';
import { useTableWidth } from '../hooks/useTableWidth';
import { useTableProps } from '../providers/TablePropsProvider';
import { TableProvider } from '../providers/TableProvider';
import { RowData, TableProps, TableSorterOrder } from '../types';
import { GroupTBody } from './GroupTBody';
import '../index.less';

const Inner = <T extends RowData, ColumnKey = string, SortedField = string>() => {
  const {
    columns,
    data,
    columnSettings,
    columnVisibleKeys,
    hasColumnSettings,
    rowKey,
    selectedKeys,
    disabledKeys,
    sorter: outerSorter,
    loading,
    zebra,
    cssVirtual,
    showHeaderResizer,
    onSelect,
    onFocus,
    onBlur,
    onMouseDown,
    onMouseEnter,
    onColumnSortChange,
    onColumnOrderChange,
    onColumnResizeEnd,
    onColumnSettingTrigger,
    onCellMouseDown,
    onCellMouseUp,
    onCellMouseEnter,
    onCellMouseLeave,
    onCellDoubleClick,
    onCellContextMenu,
    onCellClick
  } = useTableProps<T, ColumnKey, SortedField>();

  const [columnOrder, setColumnOrder] = useTableColumnOrder(columnSettings);
  const [columnSizing, setColumnSizing] = useTableColumnSizing(columnSettings);
  const { columnVisibilityCache } = useTableColumnVisibility(columnSettings);
  const [sorter, setSorter] = usePropsValue({ defaultValue: outerSorter, value: outerSorter ?? {} });

  const isColumnSettingsLoading = hasColumnSettings && !Object.keys(columnSizing).length;

  const rowKeysCache = useMemo(() => {
    const orderedKeys: string[] = [];
    const keys = new Set<string>();
    const indexCache = new Map<string, number>();

    for (let i = 0, len = data?.length ?? 0; i < len; i++) {
      const item = data[i];

      let key = '';
      if (typeof rowKey === 'function') key = rowKey(item).toString();
      else key = item[rowKey];

      orderedKeys.push(key);
      keys.add(key);
      indexCache.set(key, i);
    }

    return { orderedKeys, keys, indexCache };
  }, [data, rowKey]);

  const table = useReactTable<T>({
    data,
    columns,
    defaultColumn: { minSize: 0, size: 0 },
    state: {
      columnSizing,
      columnOrder,
      columnVisibility: columnVisibilityCache.visibility,
      columnPinning: {
        left: [GROUP_HEADER_ID, GROUP_FOOTER_ID],
        right: columnVisibleKeys ?? columnVisibilityCache.visibleKeys
      }
    },
    getCoreRowModel: getCoreRowModel(),
    onColumnOrderChange: val => {
      setColumnOrder(val);
      onColumnOrderChange?.(val as ColumnOrderState);
    },
    enableColumnResizing: showHeaderResizer,
    getRowId: original => utils.getRowKey(rowKey, original),
    meta: {
      rowKey,
      rowKeysCache,
      selectedKeys,
      disabledKeys,
      sorter,
      selectRows(keys, evt, lastSelectedRowKey) {
        requestAnimationFrame(() => {
          onSelect?.(keys, evt, lastSelectedRowKey);
        });
      },
      sortColumn(field) {
        setSorter(prev => {
          let order;
          let sortedField = field;
          if (prev?.sortedField !== field) {
            order = TableSorterOrder.DESC;
          } else if (!prev?.order) {
            order = TableSorterOrder.DESC;
          } else if (prev.order === TableSorterOrder.DESC) {
            order = TableSorterOrder.ASC;
          } else if (prev.order === TableSorterOrder.ASC) {
            sortedField = undefined;
            order = undefined;
          }
          const newSorter = { sortedField, order };
          onColumnSortChange?.(newSorter, prev);
          return { sortedField, order };
        });
      },
      setColumnSizing,
      resizeColumn: onColumnResizeEnd,
      triggerColumnSetting: onColumnSettingTrigger,
      triggerCellMouseDown: onCellMouseDown,
      triggerCellMouseUp: onCellMouseUp,
      triggerCellMouseEnter: onCellMouseEnter,
      triggerCellMouseLeave: onCellMouseLeave,
      triggerCellDoubleClick: onCellDoubleClick,
      triggerCellContextMenu: onCellContextMenu,
      triggerCellClick: onCellClick
    }
  });

  const tableWidth = useTableWidth(table);
  useGroupKeyAllSelect(table);

  return (
    <TableRender<T, ColumnKey, SortedField>
      table={table}
      tableWidth={tableWidth}
      isColumnSettingsLoading={isColumnSettingsLoading}
      showSettingPlaceholder={columnVisibilityCache.showSettingPlaceholder}
    >
      <GroupTBody
        className={cx(loading && 'h-0', cssVirtual && 's-table-css-virtual', zebra && 's-table-zebra')}
        table={table}
        tableWidth={tableWidth}
        rowKeys={rowKeysCache.keys}
        onMouseDown={onMouseDown}
        onMouseEnter={onMouseEnter}
        onFocus={onFocus}
        onBlur={onBlur}
      />
    </TableRender>
  );
};

export const GroupTable = <T extends RowData, ColumnKey = string, SortedField = string>(
  props: TableProps<T, ColumnKey, SortedField>
) => {
  return (
    <TableProvider<T, ColumnKey, SortedField> {...props}>
      <Inner<T, ColumnKey, SortedField> />
    </TableProvider>
  );
};
