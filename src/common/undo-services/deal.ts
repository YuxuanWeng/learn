import { RequestConfig } from '@fepkg/request/types';
import { MarketDeal } from '@fepkg/services/types/common';
import { ProductType } from '@fepkg/services/types/enum';
import type { MarketDealMulCreate } from '@fepkg/services/types/market-deal/mul-create';
import type { MarketDealMulUpdate } from '@fepkg/services/types/market-deal/mul-update';
import type { MarketDealMulUpdateByIds } from '@fepkg/services/types/market-deal/mul-update-by-ids';
import { cloneDeep, isEqual, omit } from 'lodash-es';
import { mulCreateMarketDeal } from '../services/api/market-deal/mul-create';
import { mulUpdateMarketDeal } from '../services/api/market-deal/mul-update';
import { mulUpdateMarketDealByIds } from '../services/api/market-deal/mul-update-by-ids';
import { trackSpecialSlow } from '../utils/logger/special';
import { createMarketUndoSnapshot, updateMarketUndoSnapshot } from '../utils/undo';
import { QuoteUndoRequestConfig } from './quote';
import { OperationType } from './types';

export type DealUndoRequestConfig = RequestConfig & {
  isUndo?: boolean;
  type?: OperationType;
  origin?: MarketDeal[];
  productType?: ProductType;
};

// 统一规避短时多次点击 Gvn/Tkn 按钮(包括快捷键触发等)的问题
// 基于稳定性/复杂度的考虑，先单独限制这一个请求接口
const mulCreateMarketDealCache: {
  timestamp: number;
  params?: MarketDealMulCreate.Request;
} = {
  timestamp: 0,
  params: void 0
};
const omitDealTime = (params?: MarketDealMulCreate.Request) =>
  params
    ? {
        ...params,
        market_deal_create_list: params.market_deal_create_list?.map(item => omit(item, 'deal_time'))
      }
    : void 0;
/** 批量成交报价 */
export const mulCreateMarketDealWithUndo = async (
  params: MarketDealMulCreate.Request,
  config?: QuoteUndoRequestConfig
) => {
  const now = Date.now();
  const isFresh = now - mulCreateMarketDealCache.timestamp < 1000;
  const isSame = isEqual(omitDealTime(params), omitDealTime(mulCreateMarketDealCache.params));
  if (isSame && isFresh) throw new Error('短期重复请求');
  mulCreateMarketDealCache.params = cloneDeep(params);
  mulCreateMarketDealCache.timestamp = now;

  const response = await mulCreateMarketDeal(params, config);
  try {
    if (config?.productType && config?.origin) {
      const ids = response.created_market_deal_id_list ?? [];
      const errorIds = response?.err_record_list?.map(e => e.line_no) ?? [];
      const origins = config?.origin?.filter((_, i) => !errorIds.includes(i)) ?? [];
      const data = ids.map((v, i) => ({
        ...origins[i],
        deal_id: v
      }));
      const tag = origins.length === 1 ? origins[0]?.bond_basic_info?.short_name : undefined;
      await createMarketUndoSnapshot(data, config?.type || OperationType.Deal, config?.productType, tag ?? config?.tag);
    }
  } catch (ex) {
    trackSpecialSlow('undo-update-error-with-mul-create-deal', ex);
  }
  return response;
};

/** 批量内部外部修改 */
export const mulUpdateMarketDealByIdsWithUndo = async (
  params: MarketDealMulUpdateByIds.Request,
  config?: DealUndoRequestConfig
) => {
  await mulUpdateMarketDealByIds(params, config);
  if (!config?.origin || !config?.productType) return;
  try {
    const tag = config.origin.length === 1 ? config.origin[0].bond_basic_info?.short_name : undefined;
    await updateMarketUndoSnapshot(config.origin, config.type ?? OperationType.Update, config.productType, tag);
  } catch (ex) {
    trackSpecialSlow('undo-update-error-with-mul-update-deal-by-ids', ex);
  }
};

/** 批量更改成交信息 */
export const mulUpdateMarketDealWithUndo = async (
  params: MarketDealMulUpdate.Request,
  config?: DealUndoRequestConfig
) => {
  await mulUpdateMarketDeal(params, config);
  if (!config?.origin || !config?.productType) return;
  try {
    const tag = config.origin.length === 1 ? config.origin[0].bond_basic_info?.short_name : undefined;
    await updateMarketUndoSnapshot(config.origin, config.type ?? OperationType.Edit, config.productType, tag);
  } catch (ex) {
    trackSpecialSlow('undo-update-error-with-mul-update-deal', ex);
  }
};
