import { useState } from 'react';
import cx from 'classnames';
import { usePropsValue } from '@fepkg/common/hooks';
import {
  ColumnOrderState,
  ExpandedState,
  getCoreRowModel,
  getExpandedRowModel,
  useReactTable
} from '@tanstack/react-table';
import * as utils from '../utils';
import { TableRender } from '../TableRender';
import { GROUP_FOOTER_ID, GROUP_HEADER_ID } from '../constants';
import { useTableColumnOrder } from '../hooks/useTableColumnOrder';
import { useTableColumnSizing } from '../hooks/useTableColumnSizing';
import { useTableColumnVisibility } from '../hooks/useTableColumnVisibility';
import { useTableWidth } from '../hooks/useTableWidth';
import { useTableProps } from '../providers/TablePropsProvider';
import { TableProvider } from '../providers/TableProvider';
import { ExpandingTableProps, RowData, TableSorterOrder } from '../types';
import { getExpanded, getRowKey } from '../utils';
import { ExpandingTBody as ExpandingElectronWebTBody } from './renderer/electron-web';
import { ExpandingTBody as ExpandingWebTBody } from './renderer/web';
import '../index.less';

const rowKeysCache = {
  orderedKeys: [],
  keys: new Set<string>(),
  indexCache: new Map()
};

const getTableRenderer = (renderer: ExpandingTableProps<object>['renderer']) => {
  switch (renderer) {
    case 'web':
      return ExpandingWebTBody;
    default:
      return ExpandingElectronWebTBody;
  }
};

const Inner = <T extends RowData & { children?: T[] }, ColumnKey = string, SortedField = string>() => {
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
    renderer = 'electron-web',
    defaultExpanded = true,
    showHeaderResizer,
    showHeaderDivide,
    onSelect,
    onMouseDown,
    onMouseEnter,
    onFocus,
    onBlur,
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
  } = useTableProps<T, ColumnKey, SortedField>() as ExpandingTableProps<T, ColumnKey, SortedField>;

  // 展开项的缓存（默认收缩时使用）
  const [expanded, setExpanded] = useState<ExpandedState>(defaultExpanded || {});
  // 收缩项的缓存（默认展开时使用）
  const [shrinkSet, setShrinkSet] = useState(new Set<string>());

  const [columnOrder, setColumnOrder] = useTableColumnOrder(columnSettings, true);
  const [columnSizing, setColumnSizing] = useTableColumnSizing(columnSettings);
  const { columnVisibilityCache } = useTableColumnVisibility(columnSettings);
  const [sorter, setSorter] = usePropsValue({ defaultValue: outerSorter, value: outerSorter ?? {} });

  const isColumnSettingsLoading = hasColumnSettings && !Object.keys(columnSizing).length;

  const table = useReactTable<T>({
    data,
    columns,
    defaultColumn: { minSize: 0, size: 0 },
    state: {
      // 默认展开，当存在收缩项时使用自定义逻辑
      expanded: defaultExpanded ? getExpanded(rowKey, shrinkSet, data) : expanded,
      columnSizing,
      columnOrder,
      columnVisibility: columnVisibilityCache.visibility,
      columnPinning: {
        left: [GROUP_HEADER_ID, GROUP_FOOTER_ID],
        right: columnVisibleKeys ?? columnVisibilityCache.visibleKeys
      }
    },
    getCoreRowModel: getCoreRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
    onColumnOrderChange: val => {
      setColumnOrder(val);
      onColumnOrderChange?.(val as ColumnOrderState);
    },
    enableColumnResizing: showHeaderResizer,
    enableExpanding: true,
    onExpandedChange: !defaultExpanded
      ? setExpanded
      : updater => {
          if (typeof updater === 'function') {
            // 获取当页的展开项
            const expandedState = updater(getExpanded(rowKey, shrinkSet, data));

            // 递归获取所有key
            const getRowKeyList = (list: T[]) => {
              const result: string[] = [];

              for (const i of list) {
                result.push(getRowKey(rowKey, i), ...getRowKeyList(i.children ?? []));
              }

              return result;
            };

            // 获取当页的唯一id列表
            const rowKeyList = getRowKeyList(data);
            const shrinks = new Set(shrinkSet);
            for (const key of rowKeyList) {
              if (!expandedState[key]) {
                // 添加收缩项
                shrinks.add(key);
              } else if (expandedState[key] && shrinks.has(key)) {
                // 去除重新展开项
                shrinks.delete(key);
              }
            }

            setShrinkSet(shrinks);
          }
        },
    getRowId: original => utils.getRowKey(rowKey, original),
    getSubRows: original => original?.children,
    meta: {
      rowKey,
      // 仅提供值，不进行具体使用，具体请使用由 rows 计算出来的 expandingRowKeysCache
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
  const Renderer = getTableRenderer(renderer);

  return (
    <TableRender<T, ColumnKey, SortedField>
      table={table}
      tableWidth={tableWidth}
      isColumnSettingsLoading={isColumnSettingsLoading}
      showSettingPlaceholder={columnVisibilityCache.showSettingPlaceholder}
      showHeaderDivide={showHeaderDivide}
    >
      <Renderer
        className={cx(loading && 'h-0', cssVirtual && 's-table-css-virtual', zebra && 's-table-zebra')}
        table={table}
        tableWidth={tableWidth}
        onMouseDown={onMouseDown}
        onMouseEnter={onMouseEnter}
        onFocus={onFocus}
        onBlur={onBlur}
      />
    </TableRender>
  );
};

export const ExpandingTable = <T extends RowData & { children?: T[] }, ColumnKey = string, SortedField = string>(
  props: ExpandingTableProps<T, ColumnKey, SortedField>
) => {
  return (
    <TableProvider<T, ColumnKey, SortedField> {...props}>
      <Inner<T, ColumnKey, SortedField> />
    </TableProvider>
  );
};
