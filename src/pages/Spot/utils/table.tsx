import { ReactNode } from 'react';
import cx from 'classnames';
import { formatDate } from '@fepkg/common/utils/date';
import { BondDeal, LiquidationSpeed } from '@fepkg/services/types/common';
import { ColumnDef, createColumnHelper } from '@tanstack/react-table';
import { get } from 'lodash-es';
import { formatLiquidationSpeedListToString } from '@/common/utils/liq-speed';
import TextWithTooltip from '@/components/TextWithTooltip';
import { ColSettingDef, ColumnAlign, ColumnSettingsKeysType } from '../types';

export const calcCnCharsCount = (title: string) => {
  const shortRe = title.match(/[\d\sa-z]/g);
  const shortNum = shortRe ? shortRe.length : 0;
  return title.length - shortNum + Math.ceil(shortNum / 2);
};

export const getCnCharsWidth = (charsCount: number) => charsCount * 13 + 12 * 2;

const defaultRender = ({ getValue }) => getValue();

const getColSetting = <T,>(settings: ColSettingDef<T>[], key: ColumnSettingsKeysType<T>) =>
  settings.find(c => c.key === key);

const getColDef = <T,>(settings: ColSettingDef<T>[], key: ColumnSettingsKeysType<T>, cellFn?: (info) => ReactNode) => {
  const col = getColSetting(settings, key);
  if (!col) return null;
  let thAlignCls = '';
  let tdAlignCls = '';
  switch (col.align) {
    case ColumnAlign.CENTER:
      thAlignCls = '!justify-center !px-3';
      tdAlignCls = 'justify-center';
      break;
    case ColumnAlign.RIGHT:
      thAlignCls = 'justify-end !pr-3';
      tdAlignCls = 'justify-end';
      break;
    default:
      thAlignCls = 'justify-start !pl-3';
      tdAlignCls = 'justify-start';
      break;
  }
  const columnHelper = createColumnHelper<T>();
  const meta = {
    columnKey: col.key,
    thCls: cx(thAlignCls),
    tdCls: cx('flex items-center px-3', tdAlignCls)
  };
  return columnHelper.accessor(col.key as any, {
    header: col.label,
    size: col.width,
    minSize: col.label ? getCnCharsWidth(calcCnCharsCount(col.label)) : void 0,
    // eslint-disable-next-line prefer-spread
    cell: (...args) => (cellFn || defaultRender).apply(null, args) || '--',
    meta
  });
};

export const getColumns = <T,>(settings: ColSettingDef<T>[]) =>
  settings.map(col => getColDef(settings, col.key, col.cellRender)).filter(col => !!col) as ColumnDef<T>[];

export function renderSolidColorLiq(list: LiquidationSpeed[], idx: number, arr: LiquidationSpeed[][]) {
  return (
    <div
      className="inline-flex"
      key={idx}
    >
      <TextWithTooltip
        className="inline"
        text={formatLiquidationSpeedListToString(list, 'MM.DD')}
      />
      {idx < arr.length - 1 ? <span className="mx-1">/</span> : null}
    </div>
  );
}

export const getSpotPricingProp = (pricing: Partial<BondDeal>, path: string) => {
  switch (path) {
    case 'create_time':
    case 'update_time':
      return formatDate(pricing[path], 'YYYY-MM-DD HH:mm:ss');
    default:
      return get(pricing, path);
  }
};
