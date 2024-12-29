import { describe, expect, it, vi } from 'vitest';
import { LiquidationSpeedTag } from '@fepkg/services/types/enum';
import moment from 'moment';
import { isFRALiquidation, liquidationDateToTag } from '@packages/utils/liq-speed';
import { formatLiquidationSpeedListToString } from './liq-speed';

describe('test liquidation utils', () => {
  beforeEach(() => {
    vi.setSystemTime(moment('2022-01-01').valueOf());
  });
  afterEach(() => {
    vi.clearAllMocks();
  });
  it('具体日期转化为`今天/明天`', () => {
    expect(
      liquidationDateToTag([
        {
          date: moment('2022-01-01').valueOf().toString(),
          offset: 1
        },
        {
          tag: LiquidationSpeedTag.Tomorrow,
          offset: 0
        },
        {
          date: moment('2022-01-02').valueOf().toString(),
          offset: 0
        },
        {
          date: moment('2022-01-02').valueOf().toString(),
          offset: 1
        },
        {
          date: moment('2022-11-02').valueOf().toString(),
          offset: 1
        },
        {
          date: moment('2022-11-03').valueOf().toString(),
          offset: 1
        },
        {
          date: moment('2022-11-03').valueOf().toString(),
          offset: 1
        }
      ])
    ).toEqual([
      {
        tag: LiquidationSpeedTag.Today,
        offset: 1
      },
      {
        tag: LiquidationSpeedTag.Tomorrow,
        offset: 0
      },
      {
        tag: LiquidationSpeedTag.Tomorrow,
        offset: 1
      },
      {
        date: moment('2022-11-02').valueOf().toString(),
        offset: 1
      },
      {
        date: moment('2022-11-03').valueOf().toString(),
        offset: 1
      }
    ]);
  });
  it('是否为远期报价', () => {
    expect(
      isFRALiquidation({
        tag: LiquidationSpeedTag.Tomorrow,
        offset: 1
      })
    ).toBeTruthy();
    expect(
      isFRALiquidation({
        date: moment('2022-01-02').valueOf().toString(),
        offset: 1
      })
    ).toBeTruthy();
    expect(
      isFRALiquidation({
        tag: LiquidationSpeedTag.Today,
        offset: 1
      })
    ).toBeFalsy();
    expect(
      isFRALiquidation({
        tag: LiquidationSpeedTag.Today,
        offset: 0
      })
    ).toBeFalsy();
    expect(
      isFRALiquidation({
        date: moment('2022-01-01').valueOf().toString(),
        offset: 0
      })
    ).toBeFalsy();
  });
  it('格式化结算/交割方式', () => {
    expect(
      formatLiquidationSpeedListToString([
        {
          offset: 1,
          tag: LiquidationSpeedTag.Tomorrow
        },
        {
          offset: 1,
          date: '1676476800000'
        },
        {
          offset: 1,
          date: '1677427200000'
        }
      ])
    ).toEqual('明天+1,2023-02-16+1,2023-02-27+1');
  });
});
