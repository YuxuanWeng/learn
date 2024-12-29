import { useCallback } from 'react';
import { useVirtual } from 'react-virtual';
import cx from 'classnames';
import { KeyboardKeys } from '@fepkg/common/utils/keyboard';
import { TRow } from '../TRow';
import { GROUP_LINE_HEIGHT, HEADER_HEIGHT } from '../constants';
import { useGroupKeyArrowMove } from '../hooks/useGroupKeyArrowMove';
import { useGroupTRowMouseEvent } from '../hooks/useGroupTRowMouseEvent';
import { useGroupTableImperativeHandle } from '../hooks/useGroupTableImperativeHandle';
import { useTBodyScrollEvent } from '../hooks/useTBodyScrollEvent';
import { useTableProps } from '../providers/TablePropsProvider';
import { useTableState } from '../providers/TableStateProvider';
import { GroupTBodyProps, RowData } from '../types';

export const GroupTBody = <T extends RowData>({
  className,
  table,
  tableWidth,
  rowKeys,
  ...restProps
}: GroupTBodyProps<T>) => {
  const { active, copyEnabled } = useTableProps<T>();
  const { tRowRefs, tBodyRef } = useTableState();
  const { handleTBodyWrapperScroll, handleContainerWheel } = useTBodyScrollEvent();
  const { handleMouseEnter, handleMouseDown } = useGroupTRowMouseEvent(table);

  const tbodyCls = cx('s-tbody s-group-tbody', className);
  const { meta: tableMeta } = table.options;
  const { rows } = table.getRowModel();

  const estimateSize = useCallback(
    index => {
      const row = rows[index];

      let size = GROUP_LINE_HEIGHT + 1; // 1 为 mt-px
      if (row?.original?.isGroupHeader) {
        size = HEADER_HEIGHT;
      } else if (row.original?.isGroupFirst && !row.original?.isGroupLast) {
        size = GROUP_LINE_HEIGHT;
      } else if ((row.original?.isGroupFirst && row.original?.isGroupLast) || row.original?.isGroupFooter) {
        size = GROUP_LINE_HEIGHT + 12; // 12 为 mb-3
      } else if (row.original?.isGroupLast && index !== rows.length - 1) {
        size = GROUP_LINE_HEIGHT + 1 + 12; // 1 为 mt-px，12 为 mb-3
      }
      return size;
    },
    [rows]
  );

  const { virtualItems, totalSize, scrollToIndex, scrollToOffset } = useVirtual({
    parentRef: tBodyRef,
    size: rows.length,
    overscan: 30,
    estimateSize,
    keyExtractor: index => rowKeys[index]
  });
  useGroupKeyArrowMove(table, scrollToIndex);
  useGroupTableImperativeHandle(table, scrollToIndex, scrollToOffset);

  const paddingTop = virtualItems.length > 0 ? virtualItems[0]?.start ?? 0 : 0;
  const paddingBottom = virtualItems.length > 0 ? totalSize - (virtualItems.at(-1)?.end ?? 0) : 0;

  return (
    <div
      ref={tBodyRef}
      className={cx('s-tbody-wrapper', active && 'active')}
      onScroll={handleTBodyWrapperScroll}
      onWheel={handleContainerWheel}
      {...restProps}
    >
      <div
        tabIndex={-1}
        className={tbodyCls}
        style={{ width: tableWidth }}
        // 阻止复制元素
        onKeyDown={evt => {
          if (evt.key.toLowerCase() === KeyboardKeys.KeyC) {
            if (evt.ctrlKey || evt.metaKey) {
              if (!copyEnabled) evt.preventDefault();
            }
          }
        }}
      >
        <div className="s-tbody-inner">
          {paddingTop > 0 && <div style={{ height: paddingTop }} />}

          {virtualItems.map((virtualRow, index) => {
            const row = rows[virtualRow.index];

            const selected = !!tableMeta?.selectedKeys?.has(row.id ?? '');
            const disabled = !!tableMeta?.disabledKeys?.has(row.id ?? '');

            let trCls = '';
            if (row?.original?.isGroupHeader) trCls = 'group-header';
            if (row?.original?.isGroupFooter) trCls = 'group-footer';
            if (row?.original?.isGroupFirst) trCls = 'group-first';
            if (row?.original?.isGroupLast) trCls = 'group-last';

            return (
              <TRow<T>
                key={row.id}
                ref={node => {
                  tRowRefs.current[index] = node;
                }}
                className={trCls}
                table={table}
                row={row}
                selected={selected}
                disabled={disabled}
                onMouseEnter={evt => handleMouseEnter(evt, row)}
                onMouseDown={evt => handleMouseDown(evt, row)}
              />
            );
          })}

          {paddingBottom > 0 && <div style={{ height: paddingBottom }} />}
        </div>
      </div>
    </div>
  );
};
