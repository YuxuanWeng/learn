import { FocusEventHandler, HTMLProps, Key, MouseEvent, MouseEventHandler, PropsWithChildren, Ref } from 'react';
import { useVirtual } from 'react-virtual';
import { PlaceholderProps } from '@fepkg/components/Placeholder';
import {
  Cell,
  ColumnDef,
  ColumnMeta,
  ColumnOrderState,
  ExpandedState,
  Header,
  Row,
  Table,
  TableMeta
} from '@tanstack/react-table';
import { Size } from '../types';

export type ScrollToIndexHandler = ReturnType<typeof useVirtual>['scrollToIndex'];
export type ScrollToOffsetHandler = ReturnType<typeof useVirtual>['scrollToOffset'];

export type ColumnSettingDef<ColumnKey = string> = {
  key: ColumnKey;
  label: string;
  width: number;
  visible?: boolean;
};

export type ColumnAlign = 'left' | 'center' | 'right';

export enum TableSorterOrder {
  ASC = 'asc',
  DESC = 'desc'
}

export type TableSorter<SortedField = string> = {
  /** 排序字段 */
  sortedField?: SortedField;
  /** 排序方式 */
  order?: TableSorterOrder;
};

export type GroupRowData = {
  /** 是否为当前分组的 header */
  isGroupHeader?: boolean;
  /** 是否为当前分组的 footer */
  isGroupFooter?: boolean;
  /** 是否为当前分组的首位（除 header 外）  */
  isGroupFirst?: boolean;
  /** 是否为当前分组的末位  */
  isGroupLast?: boolean;
  /** 当前分组 header 的 row key */
  groupHeaderRowKey?: string;
  /** 当前分组所有 item 的 keys */
  groupItemRowKeys?: string[];
};

export type RowData = object & GroupRowData;

export type ColumnOptions<T> = {
  id: string;
  header: string;
  minSize: number;
  meta: ColumnMeta<T>;
};

export type RowKeysCache = {
  /** 有序 key 集合 */
  orderedKeys: string[];
  /** 无序 key 集合 */
  keys: Set<string>;
  /** index 缓存 */
  indexCache: Map<string, number>;
};

export type ExpandingRowKeysCache = Omit<RowKeysCache, 'orderedKeys'> & {
  /** 有序 key 集合 */
  orderedKeys: { key: string; canExpand: boolean }[];
  /** 以 index 为索引，key 的缓存，用于反向查找该 key 是否有对应的 index */
  index2KeyCache: Map<number, string>;
};

export type GetRowKey<T> = (rowData: T, index?: number) => Key;

export type TableMouseEvent<T extends RowData, ColumnKey = string> = (
  evt: MouseEvent<HTMLDivElement>,
  rowData: T,
  key: ColumnKey
) => void;

export type TableSelectEventHandler = (
  keys: Set<string>,
  evt?: MouseEvent<HTMLDivElement> | KeyboardEvent,
  lastSelectedRowKey?: string
) => void;

export type TableInstance = {
  /** 根据 rowKey 将该 row 移动到可视区域内 */
  scrollRowIntoView: (rowKey: string) => void;
  /** 将 table 滚动至 offset 的可视区域内 */
  scrollToOffset?: ScrollToOffsetHandler;
  /** 将 table 滚动自定义位置 */
  scrollTo?: (options: ScrollToOptions) => void;
};

export type TableProps<T extends RowData, ColumnKey = string, SortedField = string> = {
  tableRef?: Ref<TableInstance>;
  /** Table ClassName */
  className?: string;
  /** Table 是否被激活（Table 很多有可能处于 Keepalive 的内存中，此时 Table 不应被激活响应事件） */
  active?: boolean;
  /** 表格尺寸，默认为 sm  */
  size?: Size;
  /** 是否开启斑马纹样式，默认为 false */
  zebra?: boolean;
  /** Table 列定义方式 */
  columns: ColumnDef<T>[];
  /** Table 数据源 */
  data: T[];
  /** Table Row 唯一标识 */
  rowKey: string | GetRowKey<T>;
  /** Table 列设置 */
  columnSettings?: ColumnSettingDef<ColumnKey>[];
  /** Table 可见列 keys，如 hasColumnSettings 为 false，请务必指定 columnVisibleKeys */
  columnVisibleKeys?: string[];
  /** 表格每页数量大小（目前用于优化表格滚动翻页逻辑） */
  pageSize?: number;
  /** 是否会有 Table 列设置 */
  hasColumnSettings?: boolean;
  /** 已选择的 Keys */
  selectedKeys?: Set<string>;
  /** 禁用的 keys，此处仅改变样式 */
  disabledKeys?: Set<string>;
  /** Table 排序 */
  sorter?: TableSorter<SortedField>;
  /** 是否开启 CSS 虚拟列表，默认为 true */
  cssVirtual?: boolean;
  /** 是否允许选中内容进行复制 */
  copyEnabled?: boolean;
  /** 是否开启多选，默认为 true */
  multiSelectEnabled?: boolean;
  /** 是否开启上下箭头，默认为 true */
  arrowMoveSelectEnabled?: boolean;
  /** 是否开启键盘全选，默认为 true  */
  keyboardSelectAllEnabled?: boolean;
  /** Table Loading */
  loading?: boolean;
  /** 有搜索条件时但结果为空 */
  noSearchResult?: boolean;
  /** 暂无网络的情况 */
  noNetwork?: boolean;
  /** Placeholder 的 Size */
  placeholderSize?: PlaceholderProps['size'];
  /** 是否展示 Table 的水印 */
  showWatermark?: boolean;
  /** 是否展示 Table Header */
  showHeader?: boolean;
  /** 是否展示 Table Header Reorder */
  showHeaderReorder?: boolean;
  /** 是否展示 Table 默认排序Icon */
  showHeaderDefaultSorter?: boolean;
  /** 是否展示 Table Header Resizer */
  showHeaderResizer?: boolean;
  /** 是否展示 Table Header Context Menu */
  showHeaderContextMenu?: boolean;
  /** 是否展示 Placeholder */
  showPlaceholder?: boolean;
  /** 是否展示表头分割线 */
  showHeaderDivide?: boolean;
  /** 当表格格内容为空时，显示暂无数据的文案 */
  placeholder?: string;
  /** Table 选中 Row 时的回调 */
  onSelect?: TableSelectEventHandler;
  /** TBody 聚焦时的回调 */
  onFocus?: FocusEventHandler<HTMLDivElement>;
  /** TBody 失焦时的回调 */
  onBlur?: FocusEventHandler<HTMLDivElement>;
  /** TBody 鼠标按下时的回调 */
  onMouseDown?: MouseEventHandler<HTMLDivElement>;
  /** TBody 鼠标进入时的回调 */
  onMouseEnter?: MouseEventHandler<HTMLDivElement>;
  /** Table 列排序改变时的回调 */
  onColumnSortChange?: (sorter: TableSorter<SortedField>, prevSorter?: TableSorter<SortedField>) => void;
  /** Table 列顺序改变时的回调 */
  onColumnOrderChange?: (columnOrder: ColumnOrderState) => void;
  /** Table 列宽度改变后的回调 */
  onColumnResizeEnd?: (key: ColumnKey, width: number) => void;
  /** Table 列设置触发时的回调 */
  onColumnSettingTrigger?: () => void;
  /** Table 单元格 MouseDown 时的回调 */
  onCellMouseDown?: TableMouseEvent<T, ColumnKey>;
  /** Table 单元格 MouseUp 时的回调 */
  onCellMouseUp?: TableMouseEvent<T, ColumnKey>;
  /** Table 单元格 MouseEnter 时的回调 */
  onCellMouseEnter?: TableMouseEvent<T, ColumnKey>;
  /** Table 单元格 MouseLeave 时的回调 */
  onCellMouseLeave?: TableMouseEvent<T, ColumnKey>;
  /** Table 单元格 DoubleClick 时的回调 */
  onCellDoubleClick?: TableMouseEvent<T, ColumnKey>;
  /** Table 单元格 ContextMenu 时的回调 */
  onCellContextMenu?: TableMouseEvent<T, ColumnKey>;
  /** Table 单元格 OnClick 时的回调 */
  onCellClick?: TableMouseEvent<T, ColumnKey>;
  /** 滚动到顶部触发返回前一页回调 */
  onPrevPage?: (scrollCallback: (isPageChange: boolean) => void) => void;
  /** 滚动到底部触发跳转下一页回调 */
  onNextPage?: (scrollCallback: (isPageChange: boolean) => void) => void;
  /** 上一页数据预加载的回调 */
  onPrevPagePrefetch?: () => void;
  /** 下一页数据预加载的回调 */
  onNextPagePrefetch?: () => void;
  /** Row 拖拽后触发，返回拖拽结束后重新排序的list，用于 DraggableTable 组件 */
  onDrag?: (data: T[]) => void;
};

export type THeadProps<T extends RowData> = {
  table: Table<T>;
  tableWidth: number;
  showHeaderDivide?: boolean;
};

export type THeaderOverlayProps<T extends RowData> = {
  table: Table<T>;
  header?: Header<T, unknown>;
};

export type TBodyProps<T extends RowData> = Pick<
  TableProps<T>,
  'onFocus' | 'onBlur' | 'onMouseDown' | 'onMouseEnter'
> & {
  table: Table<T>;
  className?: string;
  tableWidth: number;
};

export type GroupTBodyProps<T extends RowData> = TBodyProps<T> & { rowKeys: Set<string> };

export type TableRenderProps<T extends RowData> = THeadProps<T> &
  PropsWithChildren<{
    isColumnSettingsLoading?: boolean;
    showSettingPlaceholder?: boolean;
  }>;

export type TRowProps<T extends RowData> = HTMLProps<HTMLDivElement> & {
  table: Table<T>;
  row: Row<T>;
  selected: boolean;
  disabled: boolean;
};

export type DraggableTableProps<T extends RowData> = Pick<TRowProps<T>, 'table' | 'children'>;
export type DraggableTRowProps<T extends RowData> = Pick<TRowProps<T>, 'table' | 'row' | 'children'> & {
  dragging?: boolean;
};

export type ExpandingTableProps<T extends RowData, ColumnKey = string, SortedField = string> = TableProps<
  T,
  ColumnKey,
  SortedField
> & {
  /** 渲染器，选择渲染 TBody 是 web 还是 electron-web，
   * electron-web 因为使用的 chrome108，可使用浏览器自带的 overflow: overlay 的滚动条样式调整部分操作内容，会适配「全部选择/拖拽选择/上下键选择」等功能
   * web 使用的是用户自带浏览器的版本，使用的是三方库重新实现的滚动条样式，该渲染器暂未适配「全部选择/拖拽选择/上下键选择」等功能，
   * 默认为 electron-web
   */
  renderer?: 'web' | 'electron-web';
  /** 默认是否展开，默认为 {} */
  defaultExpanded?: ExpandedState | false;
};

export type TCellProps<T extends RowData> = {
  tableMeta?: TableMeta<T>;
  row: Row<T>;
  cell: Cell<T, unknown>;
  width: number | string;
  draggable?: boolean;
  expanded?: boolean;
};
