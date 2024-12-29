import { vi } from 'vitest';
import { SERVER_NIL } from '@fepkg/common/constants';
import { DealQuote } from '@fepkg/services/types/common';
import { BondQuoteType, DealType, LiquidationSpeedTag, Side } from '@fepkg/services/types/enum';
import { WindowName } from 'app/types/window-v2';
import { cloneDeep } from 'lodash-es';
import moment from 'moment';
import BitOper from '@/common/utils/bit';
import { SpotDate, SpotModalProps } from './types';
import {
  calcTotalVolume,
  getBondQuoteSyncLikePriceFromSpotPricing,
  getSpotId,
  getSpotIdPrefix,
  getUpdatedOrAddedQuoteIds,
  isSameQuote,
  isSameSpotDate,
  isValidSpot
} from './utils';

describe('test utils', () => {
  beforeEach(() => {
    vi.setSystemTime(moment('2022-01-01').valueOf());
  });
  afterEach(() => {
    vi.clearAllMocks();
  });
  it('满足点价条件', () => {
    expect(
      isValidSpot({
        flag_internal: true,
        flag_star: 1,
        volume: 3000
      } as DealQuote)
    ).toBeTruthy();
    expect(
      isValidSpot({
        flag_internal: true,
        flag_star: 1,
        volume: 3000,
        deal_liquidation_speed_list: [
          {
            tag: LiquidationSpeedTag.Today,
            offset: 1
          }
        ]
      } as DealQuote)
    ).toBeTruthy();
    expect(
      isValidSpot({
        flag_internal: true,
        flag_star: 2,
        volume: 3000,
        deal_liquidation_speed_list: [
          {
            tag: LiquidationSpeedTag.Today,
            offset: 1
          }
        ]
      } as DealQuote)
    ).toBeFalsy();
    expect(
      isValidSpot({
        flag_internal: true,
        flag_star: 1,
        volume: 3001,
        deal_liquidation_speed_list: [
          {
            tag: LiquidationSpeedTag.Today,
            offset: 1
          }
        ]
      } as DealQuote)
    ).toBeFalsy();
    expect(
      isValidSpot({
        flag_internal: true,
        flag_star: 1,
        volume: 3000,
        deal_liquidation_speed_list: [
          {
            tag: LiquidationSpeedTag.Tomorrow,
            offset: 1
          }
        ]
      } as DealQuote)
    ).toBeFalsy();
    expect(
      isValidSpot(
        {
          flag_internal: true,
          flag_star: 1,
          volume: 3000,
          deal_liquidation_speed_list: [
            {
              tag: LiquidationSpeedTag.Today,
              offset: 0
            }
          ]
        } as DealQuote,
        {
          includeDate: SpotDate.Plus0
        }
      )
    ).toBeTruthy();
    expect(
      isValidSpot(
        {
          flag_internal: true,
          flag_star: 1,
          volume: 3000,
          deal_liquidation_speed_list: [
            {
              tag: LiquidationSpeedTag.Tomorrow,
              offset: 1
            }
          ]
        } as DealQuote,
        {
          includeDate: SpotDate.Plus0
        }
      )
    ).toBeFalsy();
    expect(
      isValidSpot(
        {
          flag_internal: true,
          flag_star: 1,
          volume: 3000,
          deal_liquidation_speed_list: [
            {
              tag: LiquidationSpeedTag.Tomorrow,
              offset: 1
            }
          ]
        } as DealQuote,
        {
          includeDate: BitOper.combine(SpotDate.Plus1, SpotDate.Tomorrow0)
        }
      )
    ).toBeFalsy();
    expect(
      isValidSpot(
        {
          quote_id: '297993801975353344',
          bond_key_market: 'J0003592023LGBLLB14SSE',
          create_time: '1677660029424',
          update_time: '1677663529516',
          product_type: 6,
          volume: 7000,
          yield: 2.788705,
          clean_price: 100.1354,
          full_price: 100.189482,
          return_point: 0.04,
          side: 1,
          quote_type: 3,
          deal_liquidation_speed_list: [
            {
              offset: 1,
              tag: 2
            }
          ],
          flag_urgent: 0,
          flag_rebate: 1,
          flag_star: 1,
          flag_package: 0,
          flag_oco: 0,
          flag_exchange: 0,
          flag_stock_exchange: 0,
          flag_intention: 0,
          flag_indivisible: 0,
          flag_stc: 0,
          is_exercise: 0,
          comment: '',
          flag_internal: 0,
          spread: SERVER_NIL,
          quote_price: 2.78,
          inst_biz_short_name_list: [],
          flag_request: 0,
          flag_bilateral: 0,
          sync_version: '1677663529516'
        } as unknown as DealQuote,
        {
          includeDate: SpotDate.FRA
        }
      )
    ).toBeTruthy();
  });
  // it('计算报价窗口高度', () => {
  //   expect(calcSpotDialogHeight(5)).toBe(566);
  // });
  it('计算总量', () => {
    expect(calcTotalVolume([{ volume: 1000 }, { volume: 1000 }, { volume: 3000 }])).toBe(5000);
    expect(calcTotalVolume([])).toBe(0);
  });
  it('比较新旧报价列表并甄别新增或更新的', () => {
    const oldList = [
      {
        quote_id: '111',
        update_time: '1'
      } as DealQuote,
      {
        quote_id: '222',
        update_time: '2'
      } as DealQuote,
      {
        quote_id: '333',
        update_time: '3'
      } as DealQuote
    ];

    const newList = cloneDeep(oldList);
    newList[0].update_time = '1a';
    newList.splice(1, 1);
    newList.push({
      quote_id: '444',
      update_time: '4'
    } as DealQuote);

    expect(getUpdatedOrAddedQuoteIds(oldList, newList)).toEqual(['111', '444']);
  });
  it('转换类型', () => {
    expect(
      getBondQuoteSyncLikePriceFromSpotPricing(DealType.TKN, {
        price: 1.2300000001,
        price_type: BondQuoteType.Yield,
        return_point: 0.3
      })
    ).toEqual({
      return_point: 0.3,
      quote_price: 1.2300000001,
      quote_type: BondQuoteType.Yield,
      side: Side.SideOfr,
      flag_rebate: true
    });
    expect(
      getBondQuoteSyncLikePriceFromSpotPricing(DealType.GVN, {
        price: 1.2300000001,
        price_type: BondQuoteType.Yield
      })
    ).toEqual({
      quote_price: 1.2300000001,
      quote_type: BondQuoteType.Yield,
      side: Side.SideBid,
      flag_rebate: false
    });
  });
  it('比较idc中的报价是否等价', () => {
    expect(
      isSameQuote(
        {
          clean_price: 100.00001,
          quote_type: BondQuoteType.Yield,
          yield: 1.1
        },
        {
          clean_price: 100.00002,
          quote_type: BondQuoteType.CleanPrice
        }
      )
    ).toBeTruthy();
    expect(
      isSameQuote(
        {
          quote_type: BondQuoteType.Yield,
          yield: 1.1,
          flag_rebate: true,
          return_point: 0.003
        },
        {
          quote_type: BondQuoteType.Yield,
          yield: 1.1,
          flag_rebate: true,
          return_point: 0.003
        }
      )
    ).toBeTruthy();
    expect(
      isSameQuote(void 0, {
        yield: 1.1,
        flag_rebate: true,
        return_point: 0.003
      })
    ).toBeFalsy();
  });
  it('比较idc点价分区', () => {
    expect(
      isSameSpotDate(
        { spotDate: SpotDate.Plus0, optimal: { deal_liquidation_speed_list: [] } },
        { spotDate: SpotDate.Plus0, optimal: { deal_liquidation_speed_list: [] } }
      )
    ).toBeTruthy();
    expect(
      isSameSpotDate(
        { spotDate: SpotDate.FRA, optimal: { deal_liquidation_speed_list: [] } },
        { spotDate: SpotDate.FRA, optimal: { deal_liquidation_speed_list: [{ date: '2029-01-01', offset: 0 }] } }
      )
    ).toBeFalsy();
    expect(
      isSameSpotDate(
        { spotDate: SpotDate.FRA, optimal: { deal_liquidation_speed_list: [{ date: '2029-01-01', offset: 0 }] } },
        { spotDate: SpotDate.FRA, optimal: { deal_liquidation_speed_list: [{ date: '2029-01-01', offset: 0 }] } }
      )
    ).toBeTruthy();
  });
  it('取得dialogId点价分区后缀', () => {
    expect(
      getSpotIdPrefix({
        spotDate: SpotDate.Plus0,
        optimal: { deal_liquidation_speed_list: [] }
      })
    ).toBe(SpotDate.Plus0);
    expect(
      getSpotIdPrefix({
        spotDate: SpotDate.FRA,
        optimal: {
          deal_liquidation_speed_list: [
            {
              tag: LiquidationSpeedTag.Today,
              offset: 1
            }
          ]
        }
      })
    ).toBe('+1');
    expect(
      getSpotIdPrefix({
        spotDate: SpotDate.FRA,
        optimal: {
          deal_liquidation_speed_list: [
            {
              date: '2029-01-01',
              offset: 1
            }
          ]
        }
      })
    ).toBe('01/01+1');
    expect(getSpotIdPrefix({ spotDate: SpotDate.FRA, optimal: {} })).toBe('');
    expect(getSpotIdPrefix()).toBe('');
  });
  it('计算点价dialogId', () => {
    expect(
      getSpotId({
        bond: {
          key_market: 'abc'
        },
        dealType: DealType.GVN,
        spotDate: SpotDate.Plus0
      } as SpotModalProps)
    ).toBe(`${WindowName.IdcSpot}_abc_${DealType.GVN}_${SpotDate.Plus0}`);
    expect(getSpotId()).toBe('');
  });
});
