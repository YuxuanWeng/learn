import { SearchOption } from '@fepkg/components/Search';
import { TraderWithPref } from './types';

export const optionFilter = (original: TraderWithPref, traderKeyword: string) => {
  const { trader_id, name_zh, key } = original;
  if (!name_zh.includes(traderKeyword)) {
    // key 不参与搜索
    if (key?.toString().includes(traderKeyword)) return false;
    // trader_id 不参与搜索
    if (trader_id.includes(traderKeyword)) return false;
  }
  return true;
};

export const transform2TraderOpt = (trader?: TraderWithPref): SearchOption<TraderWithPref> | null => {
  if (!trader) return null;
  return {
    label: trader.name_zh,
    value: trader.trader_id,
    original: trader,
    disabled: false
  };
};
