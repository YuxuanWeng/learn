import cx from 'classnames';
import { Button } from '@fepkg/components/Button';
import { Placeholder } from '@fepkg/components/Placeholder';
import { Watermark } from '@fepkg/components/Watermark';
import { EmptyPlaceholder } from './EmptyPlaceholder';
import { THead } from './THead/THead';
import { placeholderContainerCls } from './constants';
import { useTableResizeObserver } from './hooks/useTableResizeObserver';
import { useTableProps } from './providers/TablePropsProvider';
import { RowData, TableRenderProps } from './types';

const tableContainerCls = 'relative h-full overflow-x-overlay overflow-y-hidden';

const Inner = <T extends RowData>({
  table,
  tableWidth,
  isColumnSettingsLoading,
  showSettingPlaceholder,
  children,
  showHeaderDivide
}: TableRenderProps<T>) => {
  const { noNetwork, placeholderSize, showHeader, onColumnSettingTrigger } = useTableProps<T>();

  if (noNetwork) {
    return (
      <div className="flex-1 flex items-center bg-gray-800">
        <Placeholder
          type="no-network"
          size={placeholderSize}
        />
      </div>
    );
  }

  if (isColumnSettingsLoading) return <div className="flex-1 bg-gray-800" />;

  if (showSettingPlaceholder) {
    return (
      <div className="flex-1 flex items-center bg-gray-800">
        <Placeholder
          type="no-setting"
          size={placeholderSize}
          label={
            <div className="flex flex-col items-center">
              <span className="font-normal text-gray-200">未设置表格</span>
              <span className="mb-4 text-xs font-normal text-gray-300"> 请设置表格后查看数据</span>
              <Button
                type="primary"
                onClick={onColumnSettingTrigger}
              >
                表格设置
              </Button>
            </div>
          }
        />
      </div>
    );
  }

  return (
    <>
      {showHeader && (
        <THead
          table={table}
          tableWidth={tableWidth}
          showHeaderDivide={showHeaderDivide}
        />
      )}

      {children}
    </>
  );
};

export const TableRender = <T extends object, ColumnKey = string, SortedField = string>({
  table,
  tableWidth,
  isColumnSettingsLoading,
  showSettingPlaceholder,
  children,
  showHeaderDivide
}: TableRenderProps<T>) => {
  const {
    className,
    size,
    data,
    loading,
    noSearchResult,
    noNetwork,
    placeholderSize,
    showWatermark,
    showHeader,
    showPlaceholder,
    placeholder
  } = useTableProps<T, ColumnKey, SortedField>();
  const [containerRef] = useTableResizeObserver();

  const showLoading = loading && !noNetwork;
  const empty = !data.length;
  const showEmpty = !loading && !noNetwork && empty && !showSettingPlaceholder;

  return (
    <div className={cx('flex flex-col h-full overflow-hidden', className)}>
      <div
        ref={containerRef}
        className={tableContainerCls}
      >
        <div className={`s-table s-table-${size}`}>
          <Inner<T>
            table={table}
            tableWidth={tableWidth}
            isColumnSettingsLoading={isColumnSettingsLoading}
            showSettingPlaceholder={showSettingPlaceholder}
            showHeaderDivide={showHeaderDivide}
          >
            {children}
          </Inner>

          {showWatermark && <Watermark />}
        </div>
      </div>

      {showPlaceholder && showLoading && (
        <div className={showHeader ? `${placeholderContainerCls} pt-9` : placeholderContainerCls}>
          <Placeholder
            type="loading"
            size={placeholderSize}
          />
        </div>
      )}

      {showPlaceholder && showEmpty && (
        <EmptyPlaceholder
          className={showHeader ? `${placeholderContainerCls} pt-9` : placeholderContainerCls}
          label={placeholder}
          noSearchResult={noSearchResult}
          empty={empty}
          size={placeholderSize}
        />
      )}
    </div>
  );
};
