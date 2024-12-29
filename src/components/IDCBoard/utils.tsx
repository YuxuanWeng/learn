import { FRTypeShortMap } from '@fepkg/business/constants/map';
import { number2LimitedString } from '@fepkg/common/utils';
import { normalizeTimestamp } from '@fepkg/common/utils/date';
import { TextBadge } from '@fepkg/components/Tags';
import type { DealQuote, FiccBondBasic, LiquidationSpeed } from '@fepkg/services/types/common';
import { BondCategory, BondQuoteType, LiquidationSpeedTag, ProductType, Side } from '@fepkg/services/types/enum';
import { CommonRoute, WindowName } from 'app/types/window-v2';
import { cloneDeep, flatten, isNumber, omit } from 'lodash-es';
import {
  isDefaultOrToday1Tomorrow0Liquidation,
  isFRALiquidation,
  liquidationDateToTag,
  uniqLiquidationList
} from '@packages/utils/liq-speed';
import { QuoteOptimalListMap } from '@/common/services/hooks/useLiveQuery/BondQuote';
import BitOper from '@/common/utils/bit';
import { isNumberNil } from '@/common/utils/quote';
import { SpotDate } from '../IDCSpot/types';
import { IQuoteDialogOption } from '../Quote/types';
import type { IGrid } from './types';

// 限x位整数、4位小数（第3、4位小数的尾0不显示）
export const formatPrice = (price: number, decimalLimit = 4, noZeroAfterDecimalIndex = 2) =>
  isNumber(price) && !isNumberNil(price)
    ? number2LimitedString(price, -1, decimalLimit, {
        tailZero: true,
        noZeroAfterDecimalIndex
      })
    : '';

/**
 * 是否为地方债
 */
export const isLGB = (bond?: FiccBondBasic) => bond?.bond_category === BondCategory.LGB;

/**
 * 是否已过期
 */
export const isBondExpire = (bond: FiccBondBasic) => {
  const momentDate = normalizeTimestamp(bond.maturity_date ?? '');
  if (!momentDate) return true;
  return momentDate < Date.now();
};

export const renderBondNodes = (bond?: FiccBondBasic | null, showMaturity = true, showFr = true) => {
  if (!bond) return null;
  const frType = bond?.fr_type != undefined ? FRTypeShortMap[bond?.fr_type] : '';
  const showFrTypeBadge = showFr && !!frType;

  /** 地方债先展示<简称>，后展示<代码> */
  const firstContent = isLGB(bond) ? bond?.short_name : bond?.display_code ?? bond?.bond_code;
  const secondContent = isLGB(bond) ? bond?.display_code ?? bond?.bond_code : bond?.short_name;
  return (
    <div className="flex gap-2 items-baseline">
      {showFrTypeBadge && (
        <TextBadge
          type="BOND"
          text={frType}
          className="mr-2"
        />
      )}

      <span className="text-md font-bold text-gray-000">{firstContent}</span>
      <span className="text-xs font-normal text-gray-200">{secondContent}</span>
      {showMaturity && <span className="text-xs font-normal text-gray-200">{bond?.time_to_maturity}</span>}
    </div>
  );
};

export function quotes2GridData(
  list: DealQuote[],
  side: Side,
  isOptimal = false,
  bond?: FiccBondBasic | null
): IGrid[] {
  const resultList = list;
  if (!bond || !resultList?.length) return [{ quote: { side }, isEmpty: true }];
  return resultList.map(item => ({
    isOptimal,
    bond,
    quote: item
  }));
}

// 类型为 0 问题
// @ts-ignore
const SpotDateFilterMap: Record<SpotDate, (liq: LiquidationSpeed) => boolean> = {
  [BitOper.combine(SpotDate.Plus1, SpotDate.Tomorrow0)]: isDefaultOrToday1Tomorrow0Liquidation,
  [SpotDate.Plus0]: liq => liq.tag === LiquidationSpeedTag.Today && liq.offset === 0,
  [SpotDate.NonFRA]: liq => !isFRALiquidation(liq),
  [SpotDate.FRA]: isFRALiquidation
};

const seprateGridByLiq = (grid: IGrid): IGrid[] => {
  if (!grid.quote?.deal_liquidation_speed_list?.length) return [grid];
  return uniqLiquidationList(grid.quote.deal_liquidation_speed_list).map(liq => ({
    ...grid,
    quote: {
      ...grid.quote,
      deal_liquidation_speed_list: [liq]
    }
  }));
};
const limitGridLiqListBySpotDate = (grid: IGrid, spotDate: SpotDate): IGrid => ({
  ...grid,
  quote: grid.quote
    ? {
        ...grid.quote,
        deal_liquidation_speed_list: grid.quote.deal_liquidation_speed_list?.filter(SpotDateFilterMap[spotDate])
      }
    : void 0
});

const classifyGridBySpotDate = (grid: IGrid, spotDate: SpotDate) => {
  let liqList = grid.quote?.deal_liquidation_speed_list;
  if (!liqList?.length)
    liqList = [
      {
        tag: LiquidationSpeedTag.Default,
        offset: 0
      }
    ];
  liqList = liquidationDateToTag(liqList);
  return liqList.some(SpotDateFilterMap[spotDate]);
};

export function filterGridsBySpotDate(
  gridList: IGrid[],
  spotDate?: SpotDate,
  isSimplifyMode?: boolean,
  skipFlatten?: boolean
) {
  if (!spotDate) return gridList;
  const filteredList: IGrid[] = gridList.filter(grid => classifyGridBySpotDate(grid, spotDate));
  if (isSimplifyMode) {
    // 精简模式下首页小格子做下结算方式的筛选，即期模式只展示即期标签，远期模式下只展示远期的标签
    const filteredLiqList = filteredList.map(grid => {
      const newGrid = cloneDeep(grid);
      if (!newGrid.quote) return newGrid;
      newGrid.quote.deal_liquidation_speed_list = (grid.quote?.deal_liquidation_speed_list || []).filter(liqSpeed => {
        if (spotDate === SpotDate.FRA) {
          return isFRALiquidation(liqSpeed);
        }
        return !isFRALiquidation(liqSpeed);
      });
      return newGrid;
    });
    return filteredLiqList;
  }
  let resultList = filteredList.map(grid => limitGridLiqListBySpotDate(grid, spotDate));
  if (spotDate === SpotDate.FRA && !skipFlatten) {
    resultList = flatten(resultList.map(seprateGridByLiq));
  }
  return resultList;
}

/**
 * 按价格档位规则排序
 *
 * @see 基本报价版面 - [需求同步群] 02-01
 * ```
 * 180211，有四笔bid报价
 * A：净价100.3201，1000
 * B：收益率3.1，2000
 * C：收益率3.0，3000
 * D：收益率3.0，4000
 * （3.1计算器得出净价100.3201，3.0计算器得出100.374）
 * 根据最优价排序规则，基本报价展示如下：
 * 3.1   3.0
 *  A     C
 *  B     D
 * （其中，A报价量旁边标注净价）
 *
 * 假设次优价都是以净价报价（即B也是100.3201），价格档位显示为100.3201。
 * 100.3201   3.0
 *      A          C
 *      B          D
 * ```
 *
 * @see https://shihetech.feishu.cn/docx/doxcnxqYUYMmwSglYtz1cFMIQ9b
 * ```
 * - 在同一价格档位中，若出现报价方式不一致的极端情况，则以【收益率+返点】>【收益率】>【净价】的顺序优先显示。
```
 *
 * 归纳：
 *
 * 1. 同列报价方式一致，按该方式显示档位报价，不额外显示每格隐藏
 * 2. 不然则按优先级，从某格中找出档位报价，其余格额外显示自身报价
*/
export function sortOptimal(a: Partial<DealQuote>, b: Partial<DealQuote>) {
  if (a?.quote_type === BondQuoteType.Yield) {
    if (a.flag_rebate) return -1;
    if (b?.quote_type === BondQuoteType.CleanPrice) return -1;
    if (b?.quote_type === BondQuoteType.Yield && b?.flag_rebate) return 1;
    return 0;
  }
  if (a?.quote_type === BondQuoteType.CleanPrice && b?.quote_type === BondQuoteType.CleanPrice) {
    return 0;
  }
  return 1;
}

export function isOptimalDataEmpty(data?: QuoteOptimalListMap) {
  return (
    !data ||
    !(
      data.bidOptimalQuoteList?.length ||
      data.bidSubOptimalQuoteList?.length ||
      data.ofrOptimalQuoteList?.length ||
      data.ofrSubOptimalQuoteList?.length
    )
  );
}

export const isIDCQuoteSameType = <T extends { quote_type?: BondQuoteType }>(a?: T, b?: T) => {
  if (!a) return false;
  if (!b) return false;
  return b.quote_type === a.quote_type;
};

export interface IBondDetailDialog extends IQuoteDialogOption {
  bond?: FiccBondBasic | null;
  data?: QuoteOptimalListMap;
}

const BORDER_WIDTH = 4;

export const getBondDetailDialogConfig = (productType: ProductType, option: IBondDetailDialog) => ({
  name: `${WindowName.IdcBondDetail}-${option.bond?.key_market}`,
  custom: {
    route: CommonRoute.SpotBondDetail,
    routePathParams: [productType.toString()],
    context: omit(option, 'onSuccess', 'onCancel')
  },
  options: {
    width: 1584 + BORDER_WIDTH,
    height: 880 + BORDER_WIDTH,
    resizable: true,
    minWidth: 640 + BORDER_WIDTH,
    minHeight: 514 + BORDER_WIDTH,
    maxWidth: 1582 + BORDER_WIDTH,
    maxHeight: 880 + BORDER_WIDTH
  }
});
