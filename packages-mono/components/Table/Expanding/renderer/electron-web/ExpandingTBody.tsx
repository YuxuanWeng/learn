import { MouseEvent, useMemo } from 'react';
import cx from 'classnames';
import { KeyboardKeys } from '@fepkg/common/utils/keyboard';
import { TRow } from '../../../TRow';
import { useTBodyScrollEvent } from '../../../hooks/useTBodyScrollEvent';
import { useTableProps } from '../../../providers/TablePropsProvider';
import { useTableState } from '../../../providers/TableStateProvider';
import { ExpandingRowKeysCache, RowData, TBodyProps } from '../../../types';
import { useKeyAllSelect } from './useKeyAllSelect';
import { useKeyArrowMove } from './useKeyArrowMove';
import { useTRowMouseEvent } from './useTRowMouseEvent';

export const ExpandingTBody = <T extends RowData>({ className, table, tableWidth, ...restProps }: TBodyProps<T>) => {
  const tbodyCls = cx('s-tbody', className);
  const { rows } = table.getRowModel();
  const { meta: tableMeta } = table.options;

  const expandingRowKeysCache: ExpandingRowKeysCache = useMemo(() => {
    const orderedKeys: ExpandingRowKeysCache['orderedKeys'] = [];
    const keys = new Set<string>();
    const indexCache = new Map<string, number>();
    const index2KeyCache = new Map<number, string>();

    for (let i = 0, len = rows?.length ?? 0; i < len; i++) {
      const row = rows[i];
      // 如果行不能被折叠，代表为子项，需把对应的 key 放入缓存中
      const canExpand = row.getCanExpand();
      if (!canExpand) {
        keys.add(row.id);
        indexCache.set(row.id, i);
        index2KeyCache.set(i, row.id);
      }

      orderedKeys.push({ key: row.id, canExpand });
    }

    return { orderedKeys, keys, indexCache, index2KeyCache, indexCacheEntries: indexCache.entries() };
  }, [rows]);

  const { active, copyEnabled } = useTableProps<T>();
  const { tRowRefs, tBodyRef, selecting } = useTableState();
  const { handleTBodyWrapperScroll, handleContainerWheel } = useTBodyScrollEvent();
  const { handleMouseEnter, handleMouseDown } = useTRowMouseEvent(table, expandingRowKeysCache);
  useKeyAllSelect(table, expandingRowKeysCache);
  useKeyArrowMove(table, expandingRowKeysCache);

  const handleTBodyMouseDown = (evt: MouseEvent<HTMLDivElement>) => {
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
          {rows.map((row, index) => {
            const selected = !!tableMeta?.selectedKeys?.has(row.id ?? '');
            const disabled = !!tableMeta?.disabledKeys?.has(row.id ?? '');

            let trCls = '';
            if (row.getCanExpand()) trCls = 'tr-expand-parent';
            if (row.parentId) trCls = 'tr-expand-children';

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
