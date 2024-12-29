import { describe, expect, it, vi } from 'vitest';
import { getSettlement } from '@fepkg/business/utils/liq-speed';
import { DealType, LiquidationSpeedTag } from '@fepkg/services/types/enum';
import { BuySold } from '@/components/IDCHistory/types';
import { getBuySold } from '.';
import { baseDeal, farDate, myIds, other, theDayAfterFarDate, today, tomorrow } from './test_constants';

const getDateValueOf = (val: string) => new Date(val).valueOf().toString();
const tknDeal = { ...baseDeal, deal_type: DealType.TKN };

describe('交易日和交割日转换为清算速度', () => {
  beforeAll(() => {
    vi.setSystemTime(new Date(today));
  });
  const defaultLiquidation = { tag: void 0, offset: 0, date: void 0 };
  it('交易日和交割日都是今天', () => {
    const tradedDate = getDateValueOf(today);
    const deliveryDate = getDateValueOf(today);
    const settlement = getSettlement(tradedDate, deliveryDate);
    expect(settlement).toStrictEqual({ ...defaultLiquidation, tag: LiquidationSpeedTag.Today });
  });
  it('交易日是今天交割日是明天', () => {
    const tradedDate = getDateValueOf(today);
    const deliveryDate = getDateValueOf(tomorrow);
    const settlement = getSettlement(tradedDate, deliveryDate);
    expect(settlement).toStrictEqual({ ...defaultLiquidation, tag: LiquidationSpeedTag.Today, offset: 1 });
  });
  it('交易日和交割日都是明天', () => {
    const tradedDate = getDateValueOf(tomorrow);
    const deliveryDate = getDateValueOf(tomorrow);
    const settlement = getSettlement(tradedDate, deliveryDate);
    expect(settlement).toStrictEqual({ ...defaultLiquidation, tag: LiquidationSpeedTag.Tomorrow });
    const settlementDate = getSettlement(tradedDate, deliveryDate, false);
    expect(settlementDate).toStrictEqual({
      ...defaultLiquidation,
      date: tradedDate
    });
  });
  it('交易日和交割日都是远期，并且是同一天', () => {
    const tradedDate = getDateValueOf(farDate);
    const deliveryDate = getDateValueOf(farDate);
    const settlement = getSettlement(tradedDate, deliveryDate);
    expect(settlement).toStrictEqual({ ...defaultLiquidation, date: tradedDate });
  });
  it('交易日和交割日都是远期，且不是同一天', () => {
    const tradedDate = getDateValueOf(farDate);
    const deliveryDate = getDateValueOf(theDayAfterFarDate);
    const settlement = getSettlement(tradedDate, deliveryDate);
    expect(settlement).toStrictEqual({ ...defaultLiquidation, date: tradedDate, offset: 1 });
  });
});

describe('判断我是买方还是卖方', () => {
  it('GVN方向', () => {
    expect(getBuySold(baseDeal, myIds)).toBe(BuySold.All);
    expect(getBuySold({ ...baseDeal, spot_pricinger: { broker: other } }, myIds)).toBe(BuySold.Buy);
    expect(getBuySold({ ...baseDeal, spot_pricingee: { broker: other } }, myIds)).toBe(BuySold.Sold);
  });
  it('TKN方向', () => {
    expect(getBuySold(tknDeal, myIds)).toBe(BuySold.All);
    expect(getBuySold({ ...tknDeal, spot_pricinger: { broker: other } }, myIds)).toBe(BuySold.Sold);
    expect(getBuySold({ ...tknDeal, spot_pricingee: { broker: other } }, myIds)).toBe(BuySold.Buy);
  });
});

// describe('获取复制成交文本', () => {
//   beforeAll(() => {
//     vi.setSystemTime(new Date(today));
//   });
//   it('GVN方向', () => {
//     const baseCopy = getDialoguesText(baseDeal, true);
//     expect(baseCopy).toBe('13.4Y  192380.SZ  贵州2143  市政基建  1.00到期  1000  +1  九江银行 出给 上海银行  发给信息');
//     const tknBaseCopy = getDialoguesText(tknDeal, true);
//     expect(tknBaseCopy).toBe(
//       '13.4Y  192380.SZ  贵州2143  市政基建  1.00到期  1000  +1  上海银行 出给 九江银行  发给信息'
//     );
//     const bridgeCopy = getDialoguesText({ ...baseDeal, flag_bridge: true }, true);
//     expect(bridgeCopy).toContain('bid发给信息');
//     const ofrBridgeCopy = getDialoguesText({ ...baseDeal, flag_bridge: true });
//     expect(ofrBridgeCopy).toContain('ofr发给信息');
//     const staggerCopy = getDialoguesText(
//       { ...baseDeal, bid_traded_date: getDateValueOf(farDate), bid_delivery_date: getDateValueOf(theDayAfterFarDate) },
//       true
//     );
//     expect(staggerCopy).toContain('05.22+1');
//     expect(staggerCopy).toContain('(05.22 远)');
//     const ofrStaggerCopy = getDialoguesText({ ...baseDeal, bid_traded_date: getDateValueOf(tomorrow) });
//     expect(ofrStaggerCopy).toContain('+1');
//     expect(ofrStaggerCopy).not.toContain('远');
//   });
// });
