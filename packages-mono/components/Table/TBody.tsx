import { MouseEventHandler } from 'react';
import cx from 'classnames';
import { KeyboardKeys } from '@fepkg/common/utils/keyboard';
import { TRow } from './TRow';
import { useTBodyScrollEvent } from './hooks/useTBodyScrollEvent';
import { useTRowMouseEvent } from './hooks/useTRowMouseEvent';
import { useTableProps } from './providers/TablePropsProvider';
import { useTableState } from './providers/TableStateProvider';
import { RowData, TBodyProps } from './types';

export const TBody = <T extends RowData>({ className, table, tableWidth, ...restProps }: TBodyProps<T>) => {
  const { active, copyEnabled } = useTableProps<T>();
  const { tRowRefs, tBodyRef, selecting } = useTableState();
  const { handleTBodyWrapperScroll, handleContainerWheel } = useTBodyScrollEvent();
  const { handleMouseEnter, handleMouseDown } = useTRowMouseEvent(table);

  const tbodyCls = cx('s-tbody', className);
  const { rows } = table.getRowModel();
  const { meta: tableMeta } = table.options;

  const handleTBodyMouseDown: MouseEventHandler<HTMLDivElement> = evt => {
    if (!active) return;
    // evt.preventDefault();
    if (!selecting.current && evt.buttons !== 2) {
      // 点击空白区域，清空选项（避开滚动条）
      tableMeta?.selectRows?.(new Set(), evt);
    }
  };

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
        onMouseDown={handleTBodyMouseDown}
        // 阻止复制元素
        onKeyDown={evt => {
          if (evt.key.toLowerCase() === KeyboardKeys.KeyC) {
            if (evt.ctrlKey || evt.metaKey) {
              if (!copyEnabled) evt.preventDefault();
            }
          }
        }}
      >
        <div className={cx('s-tbody-inner', !!rows.length && 's-tbody-data-inner')}>
          {rows.map(row => {
            const selected = !!tableMeta?.selectedKeys?.has(row.id ?? '');
            const disabled = !!tableMeta?.disabledKeys?.has(row.id ?? '');

            return (
              <TRow<T>
                key={row.id}
                ref={node => {
                  tRowRefs.current[row.index] = node;
                }}
                table={table}
                row={row}
                selected={selected}
                disabled={disabled}
                onMouseEnter={evt => handleMouseEnter(evt, row)}
                onMouseDown={evt => handleMouseDown(evt, row)}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};
