import { getCP } from '@fepkg/business/utils/get-name';
import { Trader } from '@fepkg/services/types/bdm-common';
import { ProductType } from '@fepkg/services/types/bdm-enum';
import { InstWithTradersMinimal } from '@fepkg/services/types/bds-common';
import { intersection, intersectionBy, isEmpty, isEqual, keyBy } from 'lodash-es';
import { InstTraderMap, TraderTiny, TraderTinyWithInst } from './types';

/** 将模糊搜索到的交易员列表(包含所属机构)，构造成机构列表+交易员 */
export const transformInstTraderData = (
  traders?: Trader[],
  defaultTraders?: TraderTiny[],
  productType?: ProductType
) => {
  const instMap: InstTraderMap = {};
  if (!traders?.length) return {};

  const defaultTraderIds = defaultTraders?.map(v => v.trader_id);

  for (const v of traders) {
    const key = v.inst_info?.inst_id;
    if (key) {
      const checked = defaultTraderIds?.includes(v.trader_id) ?? false;
      if (!instMap[key]) {
        instMap[key] = { inst_id: key, cp: getCP({ trader: v, productType }), traders: [{ ...v, checked }] };
      } else {
        instMap[key].traders.push({ ...v, checked });
      }
    }
  }
  return instMap;
};

export const transformInstWithTraderData = (instList?: InstWithTradersMinimal[], defaultTraders?: TraderTiny[]) => {
  const instMap: InstTraderMap = {};
  if (!instList?.length) return {};
  const defaultTraderIds = defaultTraders?.map(v => v.trader_id);
  for (const v of instList) {
    const key = v.inst_id;
    if (key) {
      instMap[key] = {
        inst_id: key,
        inst_name: v.inst_name,
        biz_short_name: v.biz_short_name,
        traders:
          v.traders?.map(trader => {
            const checked = defaultTraderIds?.includes(trader.trader_id) ?? false;
            return { trader_id: trader.trader_id, name_zh: trader.trader_name, checked };
          }) ?? []
      };
    }
  }
  return instMap;
};

/** 构造一个用于渲染<已选>的数据结构 */
export const buildRenderData = (traders: TraderTinyWithInst[]) => {
  return traders.map(v => ({ id: v.trader_id, name: v.cp ?? '' }));
};

/** 与原始数据取交集 */
export const intersectionInstTrader = (prev?: InstTraderMap, curr?: InstTraderMap) => {
  if (isEmpty(prev)) return curr ?? {};
  if (isEmpty(curr)) return prev ?? {};
  if (isEqual(prev, curr)) return curr ?? {};

  const res: InstTraderMap = {};

  // 找到交集的instId
  const intersectionInstIds = intersection(Object.keys(prev), Object.keys(curr));
  if (!intersectionInstIds.length) return res;

  // 找到交易员的交集
  const buildList = Object.values(prev)
    .filter(v => intersectionInstIds.includes(v.inst_id))
    .map(v => ({ ...v, traders: intersectionBy(v.traders, curr[v.inst_id].traders, 'trader_id') }));

  return keyBy(buildList, 'inst_id');
};
