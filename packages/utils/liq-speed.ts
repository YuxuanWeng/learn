import { formatDate, normalizeTimestamp } from '@fepkg/common/utils/date';
import { LiquidationSpeed } from '@fepkg/services/types/bds-common';
import { LiquidationSpeedTag } from '@fepkg/services/types/bds-enum';
import { uniqWith } from 'lodash-es';
import moment from 'moment';

/** 结算方式去重 */
export const uniqLiquidationList = (liquidation_speed_list?: LiquidationSpeed[]) =>
  liquidation_speed_list?.length
    ? uniqWith(liquidation_speed_list, (a, b) => {
        return (
          ('tag' in a && 'tag' in b && a.tag === b.tag && a.offset === b.offset) ||
          ('date' in a && 'date' in b && a.date === b.date && a.offset === b.offset)
        );
      })
    : [];

/** 将结算方式中可能的具体日期统一转化为`今天/明天` tag 的形式 */
export const liquidationDateToTag = (liquidation_speed_list: LiquidationSpeed[]) => {
  if (!Array.isArray(liquidation_speed_list)) return liquidation_speed_list;
  const arr = [...liquidation_speed_list];
  const res = arr.map(liq => {
    if (!liq.date) return liq;

    const result = { ...liq };

    const date = formatDate(normalizeTimestamp(liq.date));
    if (date === formatDate(moment())) {
      return {
        tag: LiquidationSpeedTag.Today,
        offset: result.offset
      };
    } else if (date === formatDate(moment().add(1, 'days'))) {
      return {
        tag: LiquidationSpeedTag.Tomorrow,
        offset: result.offset
      };
    }

    return result;
  });
  return uniqLiquidationList(res);
};

/**
 * 结算方式是否为远期
 * @description 【非远期】：报价的交割方式包括“+0”、“+1”、“明天+0”中的任意一个（包括以周几或日期表示），则视为非远期
 */
export const isFRALiquidation = (liq?: LiquidationSpeed): boolean => {
  if (!liq) return true;
  const { tag, offset } = liquidationDateToTag([liq])[0];
  if (tag === LiquidationSpeedTag.Default || tag === LiquidationSpeedTag.Today) return false;
  if (tag === LiquidationSpeedTag.Tomorrow && offset === 0) return false;
  return true;
};

/**
 * 结算方式是否为+1/明天+0/默认
 * @description “默认”视为此类
 */
export const isDefaultOrToday1Tomorrow0Liquidation = (liq: LiquidationSpeed) =>
  liq.tag === LiquidationSpeedTag.Default ||
  (liq.tag === LiquidationSpeedTag.Today && liq.offset === 1) ||
  (liq.tag === LiquidationSpeedTag.Tomorrow && liq.offset === 0);
