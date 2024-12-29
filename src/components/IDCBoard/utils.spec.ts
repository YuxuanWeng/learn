import { fakeBondLite, fakeBondQuoteSync } from '@fepkg/mock/utils/fake';
import { DealQuote } from '@fepkg/services/types/common';
import { BondCategory, BondQuoteType, LiquidationSpeedTag } from '@fepkg/services/types/enum';
import moment from 'moment';
import { SpotDate } from '../IDCSpot/types';
import { IGrid } from './types';
import { filterGridsBySpotDate, formatPrice, isLGB, isOptimalDataEmpty, sortOptimal } from './utils';

const c1 = {
  quote_type: BondQuoteType.CleanPrice,
  clean_price: 100
} as DealQuote;

const c2 = {
  quote_type: BondQuoteType.CleanPrice,
  clean_price: 200
} as DealQuote;

const y1 = {
  quote_type: BondQuoteType.Yield,
  flag_rebate: true
} as DealQuote;

const y2 = {
  quote_type: BondQuoteType.Yield,
  flag_rebate: false,
  yield: 1
} as DealQuote;

const y3 = {
  quote_type: BondQuoteType.Yield,
  flag_rebate: false
} as DealQuote;

describe('test utils', () => {
  it('为取得档位报价，对报价列按优先级排序', () => {
    expect([c1, c2].sort(sortOptimal)).toEqual([c1, c2]);
    expect([y1, y2].sort(sortOptimal)).toEqual([y1, y2]);
    expect([y3, y2].sort(sortOptimal)).toEqual([y3, y2]);
    expect([y2, c1, y1].sort(sortOptimal)).toEqual([y1, y2, c1]);
  });
  it('格式化报价', () => {
    expect(formatPrice(3.99999991)).toEqual('3.9999');
    expect(formatPrice(3.9)).toEqual('3.90');
    expect(formatPrice(3.91)).toEqual('3.91');
    expect(formatPrice(3.912)).toEqual('3.912');
    // @ts-ignore
    expect(formatPrice(void 0)).toEqual('');
  });
  it('是否为地方债', () => {
    expect(
      isLGB({
        ...fakeBondLite(),
        bond_category: BondCategory.LGB
      })
    ).toBeTruthy();
    expect(
      isLGB({
        ...fakeBondLite(),
        bond_category: BondCategory.CB
      })
    ).toBeFalsy();
  });
  it('最优次优数据是否为空', () => {
    expect(isOptimalDataEmpty(void 0)).toBeTruthy();
    expect(
      isOptimalDataEmpty({
        bidOptimalQuoteList: [],
        bidSubOptimalQuoteList: [],
        ofrOptimalQuoteList: [],
        ofrSubOptimalQuoteList: []
      })
    ).toBeTruthy();
    expect(
      isOptimalDataEmpty({
        bidOptimalQuoteList: [],
        bidSubOptimalQuoteList: [],
        ofrOptimalQuoteList: [],
        ofrSubOptimalQuoteList: []
      })
    ).toBeFalsy();
  });
  it('根据报价日期分区筛选报价网格数据', () => {
    const g0: IGrid = {
      quote: {
        ...fakeBondQuoteSync(),
        deal_liquidation_speed_list: []
      }
    };
    const g1: IGrid = {
      quote: {
        ...fakeBondQuoteSync(),
        deal_liquidation_speed_list: [
          {
            tag: LiquidationSpeedTag.Default,
            offset: 0
          }
        ]
      }
    };
    const g2: IGrid = {
      quote: {
        ...fakeBondQuoteSync(),
        deal_liquidation_speed_list: [
          {
            tag: LiquidationSpeedTag.Today,
            offset: 0
          }
        ]
      }
    };
    const g3: IGrid = {
      quote: {
        ...fakeBondQuoteSync(),
        deal_liquidation_speed_list: [
          {
            tag: LiquidationSpeedTag.Today,
            offset: 1
          }
        ]
      }
    };
    const g4: IGrid = {
      quote: {
        ...fakeBondQuoteSync(),
        deal_liquidation_speed_list: [
          {
            tag: LiquidationSpeedTag.Today,
            offset: 1
          },
          {
            tag: LiquidationSpeedTag.Tomorrow,
            offset: 0
          }
        ]
      }
    };
    const g5: IGrid = {
      quote: {
        ...fakeBondQuoteSync(),
        deal_liquidation_speed_list: [
          {
            tag: LiquidationSpeedTag.Today,
            offset: 0
          },
          {
            tag: LiquidationSpeedTag.Tomorrow,
            offset: 1
          },
          {
            date: moment('2099-09-09').valueOf().toString(),
            offset: 1
          }
        ]
      }
    };
    const g6: IGrid = {
      quote: {
        ...fakeBondQuoteSync(),
        deal_liquidation_speed_list: [
          {
            tag: LiquidationSpeedTag.Tomorrow,
            offset: 1
          },
          {
            date: moment('2099-09-09').valueOf().toString(),
            offset: 1
          },
          {
            date: moment('2099-09-19').valueOf().toString(),
            offset: 0
          }
        ]
      }
    };
    const toIds = (grids: IGrid[]) => grids.map(grid => grid.quote?.quote_id).sort();
    const gridList = [g0, g1, g2, g3, g4, g5, g6];
    expect(toIds(filterGridsBySpotDate(gridList))).toEqual(toIds(gridList));
    expect(toIds(filterGridsBySpotDate(gridList, SpotDate.Plus0))).toEqual(toIds([g2, g5]));
    expect(toIds(filterGridsBySpotDate(gridList, SpotDate.Plus1 | SpotDate.Tomorrow0))).toEqual(
      toIds([g0, g1, g3, g4])
    );
    expect(toIds(filterGridsBySpotDate(gridList, SpotDate.FRA))).toEqual(toIds([g5, g5, g6, g6, g6]));
  });
});
