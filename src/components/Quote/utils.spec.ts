import { describe, expect, it } from 'vitest';
import { LocalOptionType } from '@fepkg/business/types/bond';
import { hasOption } from '@fepkg/business/utils/bond';
import { SERVER_NIL } from '@fepkg/common/constants';
import { DealQuote, FiccBondBasic } from '@fepkg/services/types/common';
import { BondQuoteType, Side } from '@fepkg/services/types/enum';
import { isFR } from '@/common/utils/bond';
import { isListed, isScattered } from '@/common/utils/quote';
import {
  getEstimation,
  hasSomePrice,
  hasValidPrice,
  normalizePrice,
  omitPriceIntent
} from '@/common/utils/quote-price';
import { QuoteTypeKeyEnum } from './types';

describe('test Quote utils', () => {
  it('限制价格小数位，并根据报价方向区分向上向下取数', () => {
    expect(getEstimation(Side.SideBid, 1.223344)).toBe('1.2234');
    expect(getEstimation(Side.SideOfr, 1.223344)).toBe('1.2233');
    expect(getEstimation(Side.SideBid, 1.223344, 4)).toBe('1.2234');
    expect(getEstimation(Side.SideOfr, 1.223344, 4)).toBe('1.2233');
    expect(getEstimation(Side.SideBid, 1.223344, 3)).toBe('1.224');
    expect(getEstimation(Side.SideOfr, 1.223344, 3)).toBe('1.223');
    expect(getEstimation(Side.SideBid, 1.223344, 2)).toBe('1.23');
    expect(getEstimation(Side.SideOfr, 1.223344, 2)).toBe('1.22');
  });
  it('按可提交的标准，校验广义报价（包括数量和意向等）', () => {
    expect(hasValidPrice({})).toBeFalsy();
    expect(hasValidPrice({ clean_price: 123 })).toBeTruthy();
    expect(hasValidPrice({ yield: 1 })).toBeTruthy();
    expect(hasValidPrice({ return_point: 1 })).toBeTruthy();
    expect(hasValidPrice({ flag_intention: true })).toBeTruthy();
    expect(hasValidPrice({ flag_intention: true }, false)).toBeFalsy();
  });
  it('只校验几种狭义报价', () => {
    expect(hasSomePrice({})).toBeFalsy();
    expect(hasSomePrice({ yield: '' })).toBeFalsy();
    expect(hasSomePrice({ yield: SERVER_NIL })).toBeFalsy();
    expect(hasSomePrice({ yield: 'BID' })).toBeFalsy();
    expect(hasSomePrice({ yield: 'BI' })).toBeFalsy();
    expect(hasSomePrice({ yield: 'B' })).toBeFalsy();
    expect(hasSomePrice({ yield: 'O' })).toBeFalsy();
    expect(hasSomePrice({ yield: 'OF' })).toBeFalsy();
    expect(hasSomePrice({ yield: 'OFR' })).toBeFalsy();
    expect(hasSomePrice({ clean_price: 1 })).toBeTruthy();
    expect(
      hasSomePrice({
        flag_intention: false,
        flag_rebate: false,
        quote_type: 3,
        return_point: SERVER_NIL,
        yield: SERVER_NIL
      })
    ).toBeFalsy();
  });
  it('是否真正含权', () => {
    expect(hasOption({ has_option: true } as FiccBondBasic)).toBeTruthy();
    expect(hasOption({ option_type: LocalOptionType.ETS } as FiccBondBasic)).toBeTruthy();
    expect(hasOption({ has_option: false } as FiccBondBasic)).toBeFalsy();
    expect(hasOption({ has_option: false, option_type: LocalOptionType.ASS } as FiccBondBasic)).toBeFalsy();
  });
  it('是否浮利', () => {
    expect(isFR({ is_fixed_rate: true })).toBeFalsy();
    expect(isFR({ is_fixed_rate: false })).toBeTruthy();
    expect(isFR({})).toBeFalsy();
    expect(isFR()).toBeFalsy();
  });
  it('是否已上市', () => {
    expect(isListed('')).toBeTruthy();
    expect(isListed('1642003200')).toBeTruthy();
    expect(isListed('-62135596800')).toBeFalsy();
  });
  it('omit intent', () => {
    expect(
      omitPriceIntent('bid', {
        // @ts-ignore
        clean_price: 'BID'
      })
    ).toEqual({});
    expect(
      omitPriceIntent('ofr', {
        // @ts-ignore
        clean_price: 'OFR'
      })
    ).toEqual({});
  });

  it('规范化价格数据类型', () => {
    expect(
      normalizePrice('bid', {
        quote_type: BondQuoteType.Yield,
        // @ts-ignore
        yield: 'BID',
        flag_rebate: false,
        volume: 0
      })
    ).toEqual({
      quote_type: BondQuoteType.Yield,
      flag_rebate: false,
      volume: SERVER_NIL
    });
  });
  it('是否为散量', () => {
    expect(isScattered(2001)).toBeTruthy();
    expect(isScattered(2000)).toBeFalsy();
    expect(isScattered(-1)).toBeFalsy();
    expect(isScattered(void 0)).toBeFalsy();
  });
});
