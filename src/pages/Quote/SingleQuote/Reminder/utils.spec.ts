import { describe, expect, it } from 'vitest';
import { FiccBondBasic } from '@fepkg/services/types/common';
import { BondQuoteType, ProductType, Side } from '@fepkg/services/types/enum';
import { QuoteParamsType } from '../QuoteOper/QuoteOperProvider';
import { DblSideQuotePrice } from '../hooks/useOptimalPriceQuery';
import { checkSideDeviation, checkSideInverted } from './utils';

type DeviationCase = { price: Partial<QuoteParamsType>; result: boolean };

/** 收益率估值为 2 时的 case 列表 */
const yieldBe2DeviationCaseList: DeviationCase[] = [
  { price: { yield: 2.3 }, result: true },
  { price: { yield: 2.31 }, result: true },
  { price: { yield: 2.29 }, result: false },
  { price: { yield: 1.7 }, result: true },
  { price: { yield: 1.69 }, result: true },
  { price: { yield: 1.71 }, result: false }
];

/** 收益率估值为 3 时的 case 列表 */
const yieldBe3DeviationCaseList: DeviationCase[] = [
  { price: { yield: 3.2 }, result: true },
  { price: { yield: 3.21 }, result: true },
  { price: { yield: 3.19 }, result: false },
  { price: { yield: 2.8 }, result: true },
  { price: { yield: 1.79 }, result: true },
  { price: { yield: 2.81 }, result: false },

  { price: { yield: 3.3, return_point: 0.01, flag_rebate: true }, result: false },
  { price: { yield: 3.3, flag_rebate: true }, result: false },
  { price: { return_point: 0.34, flag_rebate: true }, result: false }
  // 平价返
  // 意向价
];

/** 收益率估值为 4 时的 case 列表 */
const yieldBe4DeviationCaseList: DeviationCase[] = [
  { price: { yield: 4.3 }, result: true },
  { price: { yield: 4.31 }, result: true },
  { price: { yield: 4.29 }, result: false },
  { price: { yield: 3.7 }, result: true },
  { price: { yield: 3.69 }, result: true },
  { price: { yield: 3.71 }, result: false }
];

/** 收益率估值为 6 时的 case 列表 */
const yieldBe6DeviationCaseList: DeviationCase[] = [
  { price: { yield: 7 }, result: true },
  { price: { yield: 7.1 }, result: true },
  { price: { yield: 6.99 }, result: false },
  { price: { yield: 5 }, result: true },
  { price: { yield: 4.99 }, result: true },
  { price: { yield: 5.1 }, result: false }
];

/** 收益率估值为 8 时的 case 列表 */
const yieldBe8DeviationCaseList: DeviationCase[] = [
  { price: { yield: 10 }, result: true },
  { price: { yield: 10.1 }, result: true },
  { price: { yield: 9.99 }, result: false },
  { price: { yield: 6 }, result: true },
  { price: { yield: 5.99 }, result: true },
  { price: { yield: 6.1 }, result: false }
];

const cleanPrice100DeviationCaseList: DeviationCase[] = [
  { price: { clean_price: 101 }, result: true },
  { price: { clean_price: 101.1 }, result: true },
  { price: { clean_price: 99.99 }, result: false }
];

describe.skip('检查单个方向报价是否估值偏离', () => {
  const bond = {} as FiccBondBasic;
  const inputPrice = {} as QuoteParamsType;

  [true, false].forEach(hasOption => {
    const label = !hasOption ? '非含权' : '含权';
    bond.has_option = hasOption;

    describe(`信用债(${label})`, () => {
      bond.product_type = ProductType.BCO;

      describe('收益率', () => {
        inputPrice.quote_type = BondQuoteType.Yield;

        (
          [
            [2, yieldBe2DeviationCaseList],
            [3, yieldBe3DeviationCaseList],
            [4, yieldBe4DeviationCaseList],
            [6, yieldBe6DeviationCaseList],
            [8, yieldBe8DeviationCaseList]
          ] as const
        ).forEach(([val, list]) => {
          describe(`估值为 ${val}`, () => {
            bond.val_yield_mat = val;
            bond.val_yield_exe = val;

            list.forEach(({ price, result }) => {
              let label = `价格为 ${price?.yield ?? '--'}`;
              if (price.flag_rebate) label += `, 返点为 ${price?.return_point ?? '--'}`;

              it(label, () => {
                inputPrice.yield = price.yield;
                inputPrice.return_point = price?.return_point;
                inputPrice.flag_rebate = price?.flag_rebate;
                expect(checkSideDeviation(ProductType.BNC, bond, inputPrice)).toBe(result);
              });
            });
          });
        });
      });

      describe('净价', () => {
        inputPrice.quote_type = BondQuoteType.CleanPrice;

        describe('估值为 100', () => {
          const val = 100;
          bond.val_clean_price_mat = val;
          bond.val_clean_price_exe = val;

          cleanPrice100DeviationCaseList.forEach(({ price, result }) => {
            it(`价格为 ${price.clean_price}`, () => {
              inputPrice.clean_price = price.clean_price;
              expect(checkSideDeviation(ProductType.BNC, bond, inputPrice)).toBe(result);
            });
          });
        });
      });
    });
  });
});

describe('检查单个方向报价是否倒挂', () => {
  describe('ofr 倒挂，对价是 Y', () => {
    it('bid 收益率最优，ofr 收益率最优，单边报价且 ofr >= bid 最优，倒挂', () => {
      const dblOptimalPrice: DblSideQuotePrice = {
        [Side.SideBid]: { yield: 2.34, clean_price: 102.7833 },
        [Side.SideOfr]: { yield: 2.34, clean_price: 102.7833 }
      };
      const dblPrice: DblSideQuotePrice = {
        [Side.SideOfr]: { yield: 2.35, clean_price: 102.7762 }
      };

      const res = checkSideInverted(Side.SideOfr, dblOptimalPrice, dblPrice, dblPrice[Side.SideOfr]?.clean_price);
      expect(res[Side.SideOfr].inverted).toBe(true);
    });
  });

  describe('bid 倒挂，对价是 X', () => {
    it('bid 收益率最优，ofr 收益率最优，单边报价且 bid <= ofr 最优，倒挂', () => {
      const dblOptimalPrice = {
        [Side.SideBid]: { quote_type: BondQuoteType.Yield, yield: 2.34, clean_price: 102.7833 },
        [Side.SideOfr]: { quote_type: BondQuoteType.Yield, yield: 2.34, clean_price: 102.7833 }
      } as DblSideQuotePrice;
      const dblPrice: DblSideQuotePrice = {
        [Side.SideBid]: { quote_type: BondQuoteType.Yield, yield: 2.33, clean_price: 102.7904 }
      };

      const res = checkSideInverted(Side.SideBid, dblOptimalPrice, dblPrice, dblPrice[Side.SideBid]?.clean_price);
      expect(res[Side.SideBid].inverted).toBe(true);
    });
  });
});

// describe('同时检查两个方向报价是否倒挂', () => {});
