import { describe, expect, it } from 'vitest';
import { BondDeal, LiquidationSpeed } from '@fepkg/services/types/common';
import { LiquidationSpeedTag } from '@fepkg/services/types/enum';
import { CellContext } from '@tanstack/react-table';
import { render, screen } from '@testing-library/react';
import { CellRender, ColSettingDef, ColumnAlign } from '../types';
import { calcCnCharsCount, getCnCharsWidth, getColumns, renderSolidColorLiq } from './table';

describe('test idc common table utils', () => {
  it('计算表格标题的中文长度', () => {
    let title = 'title with 123 numbers';
    let count = calcCnCharsCount(title);
    expect(count).toBe(11);
    title = '中文标题，汉字和数字123';
    count = calcCnCharsCount(title);
    expect(count).toBe(12);
    title = '';
    count = calcCnCharsCount(title);
    expect(count).toBe(0);
  });
  it('获取列配置', () => {
    const data = {
      row: {
        original: {
          contract_id: 123
        }
      },
      getValue() {
        return this;
      }
    } as unknown as CellContext<BondDeal, unknown>;
    const logRender: CellRender<BondDeal> = ({ row }) => {
      return <h1>{row.original.deal_id}</h1>;
    };
    const columnSettings = [
      { key: 'create_time', label: '创建时间' },
      { key: 'internal_code', label: '内码', width: 64, align: ColumnAlign.CENTER },
      { key: 'log', label: '操作记录', width: 72, cellRender: logRender }
    ] as ColSettingDef<BondDeal>[];
    const columns = getColumns<BondDeal>(columnSettings);
    columns.forEach(column => {
      const colSetting = columnSettings.find(col => col.key === column.meta?.columnKey);
      expect(column.meta?.columnKey).toBe(colSetting?.key);
      expect(column.meta?.thCls).toBeDefined();
      expect(column.meta?.tdCls).toBeDefined();
      expect(column.minSize).toBe(getCnCharsWidth(calcCnCharsCount(column.header as string)));
    });
    expect(columns[1]?.meta?.tdCls).toContain('text-center');
    expect(columns[1]?.meta?.thCls).toContain('justify-center');
    const fn1 = columns[0]?.cell;
    expect((fn1 as CellRender<BondDeal>)?.(data)).toEqual('--');
    const fn3 = columns[2]?.cell;
    expect((fn3 as CellRender<BondDeal>)?.(data)).toEqual(logRender(data));
  });
  it('渲染交割', () => {
    const list: LiquidationSpeed[][] = [
      [
        {
          tag: LiquidationSpeedTag.Today,
          offset: 1
        }
      ],
      [
        {
          date: '2030-01-01',
          offset: 0
        }
      ]
    ];
    const Comp = function () {
      return <>{list.map(renderSolidColorLiq)}</>;
    };
    render(<Comp />);
    const textEle1 = screen.getByText('+1');
    const textEle2 = screen.getByText('/');
    const textEle3 = screen.getByText('01.01+0');
    expect(textEle1).toBeInTheDocument();
    expect(textEle2).toBeInTheDocument();
    expect(textEle3).toBeInTheDocument();
  });
});
