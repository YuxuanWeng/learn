import { useEffect } from 'react';
import cx from 'classnames';
import { KeyboardKeys } from '@fepkg/common/utils/keyboard';
import { useOverlayScrollbars } from 'overlayscrollbars-react';
import { TRow } from '../../../TRow';
import { useTBodyOverlayScrollEvent } from '../../../hooks/useTBodyOverlayScrollEvent';
import { useTRowMouseEvent } from '../../../hooks/useTRowMouseEvent';
import { useTableProps } from '../../../providers/TablePropsProvider';
import { useTableState } from '../../../providers/TableStateProvider';
import { RowData, TBodyProps } from '../../../types';

export const ExpandingTBody = <T extends RowData>({ className, table, tableWidth, ...restProps }: TBodyProps<T>) => {
  const { active, copyEnabled } = useTableProps<T>();
  const { tRowRefs, tBodyRef } = useTableState();
  const { handleTBodyWrapperScroll, handleContainerWheel } = useTBodyOverlayScrollEvent();
  const { handleMouseEnter, handleMouseDown } = useTRowMouseEvent(table);

  const [initialize, instance] = useOverlayScrollbars({
    options: { scrollbars: { autoHide: 'leave', autoHideDelay: 0 } },
    events: {
      scroll: args => {
        const { scrollOffsetElement } = args.elements();
        handleTBodyWrapperScroll(scrollOffsetElement);
      }
    }
  });

  useEffect(() => {
    if (tBodyRef.current) initialize(tBodyRef.current);
  }, [tBodyRef, initialize]);

  const tbodyCls = cx('s-tbody', className);
  const { rows } = table.getRowModel();
  const { meta: tableMeta } = table.options;

  return (
    <div
      ref={tBodyRef}
      className={cx('s-tbody-wrapper', active && 'active')}
      onWheel={evt => {
        const { scrollOffsetElement } = instance()?.elements() ?? {};
        if (scrollOffsetElement) handleContainerWheel(evt, scrollOffsetElement);
      }}
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
        <div className={cx('s-tbody-inner', !!rows.length && 's-tbody-data-inner')}>
          {rows.map(row => {
            const selected = !!tableMeta?.selectedKeys?.has(row.id ?? '');
            const disabled = !!tableMeta?.disabledKeys?.has(row.id ?? '');

            let trCls = '';
            if (row.getCanExpand()) trCls = 'tr-expand-parent';
            if (row.parentId) trCls = 'tr-expand-children';

            return (
              <TRow<T>
                key={row.id}
                ref={node => {
                  tRowRefs.current[row.index] = node;
                }}
                className={trCls}
                table={table}
                row={row}
                selected={selected}
                disabled={disabled}
                onMouseEnter={evt => handleMouseEnter(evt, row)}
                onMouseDown={evt => handleMouseDown(evt, row)}
                // 支持点击整行展开收起
                onClick={() => {
                  if (row.getCanExpand()) {
                    row.getToggleExpandedHandler()();
                  }
                }}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};
