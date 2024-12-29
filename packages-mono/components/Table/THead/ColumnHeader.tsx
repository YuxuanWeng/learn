import { ForwardedRef, forwardRef, HTMLAttributes, ReactNode, useMemo } from 'react';
import cx from 'classnames';
import { IconDownArrow, IconTransferUd, IconUpArrow } from '@fepkg/icon-park-react';
import { flexRender, Header, Table } from '@tanstack/react-table';
import { RowData } from '../types';
import { getTableWidth } from '../utils';

type ColumnHeaderProps<T extends RowData> = HTMLAttributes<HTMLDivElement> & {
  table: Table<T>;
  header: Header<T, unknown>;
  resizer?: ReactNode;
  dragging?: boolean;
  resizing?: boolean;
  showHeaderReorder?: boolean;
  showHeaderResizer?: boolean;
  showHeaderDefaultSorter?: boolean;
};

const sortIconMap = { asc: IconUpArrow, desc: IconDownArrow };
const alignMap = { left: 'justify-start pl-4', center: 'justify-center', right: 'justify-end pr-4' };

const Inner = <T extends RowData>(
  {
    table,
    header,
    resizer,
    dragging,
    resizing,
    showHeaderReorder,
    showHeaderResizer,
    showHeaderDefaultSorter,
    className,
    ...restProps
  }: ColumnHeaderProps<T>,
  ref: ForwardedRef<HTMLDivElement>
) => {
  const { meta: tableMeta } = table.options;
  const { column } = header;
  const { meta: columnMeta, minSize } = column.columnDef;
  const { sortedField, resizable = showHeaderResizer, reorderable = showHeaderReorder } = columnMeta ?? {};
  const showSortIcon = sortedField && sortedField === tableMeta?.sorter?.sortedField;

  const width = getTableWidth(header.getSize, !!resizing, table.getState().columnSizingInfo?.deltaOffset, minSize);

  const thCls = cx(
    's-thead-th group',
    'flex items-center w-full overflow-hidden',
    columnMeta?.align ? alignMap[columnMeta.align] : alignMap.left,
    resizing ? 's-thead-th-resizing border-primary-400' : 'border-transparent',
    !resizing && (resizable || reorderable) && 'hover:border-primary-400', // 无需排序或拖拽时则取消边框
    !resizable && !reorderable && '!cursor-default', // 无需排序或拖拽时则取消鼠标选中样式
    dragging ? '!border-primary-400' : '',
    columnMeta?.thCls,
    className
  );

  const iconNode = useMemo(() => {
    if (showHeaderDefaultSorter && sortedField && sortedField !== tableMeta?.sorter?.sortedField) {
      return (
        <IconTransferUd
          size={12}
          className="absolute -left-4 -top-1.5 text-gray-000"
        />
      );
    }
    if (!tableMeta?.sorter?.order || !showSortIcon) return null;
    const Icon = sortIconMap[tableMeta.sorter.order];
    return (
      <Icon
        size={12}
        className="absolute -left-4 -top-1.5 text-gray-000"
      />
    );
  }, [showHeaderDefaultSorter, showSortIcon, sortedField, tableMeta?.sorter?.order, tableMeta?.sorter?.sortedField]);

  return (
    <div
      {...restProps}
      tabIndex={-1}
      ref={ref}
      style={{ width }}
      className={thCls}
    >
      <div className={cx('relative w-0 h-0')}>{iconNode}</div>

      <span className="text-sm text-gray-200 whitespace-nowrap select-none">
        {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
      </span>

      {resizable && resizer}
    </div>
  );
};

export const ColumnHeader = forwardRef(Inner) as <T extends RowData>(
  props: ColumnHeaderProps<T> & { ref?: ForwardedRef<HTMLDivElement> }
) => ReturnType<typeof Inner>;
