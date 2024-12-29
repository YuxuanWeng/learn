import { LocalServerRealtimeScene, OptimalQuoteSettlementType } from '@fepkg/services/types/bds-enum';
import { LocalServerApi } from '@/common/services/hooks/local-server/types';
import BitOper from '@/common/utils/bit';
import { SpotDate } from '@/components/IDCSpot/types';

export const getLocalServerLiveQueryKey = <Request>(api: string, params?: Request, interval?: number) => {
  const queryKey: unknown[] = [api];
  if (params) queryKey.push(params);
  if (interval != undefined) queryKey.push(interval);

  return queryKey as [string, Request | undefined, number | undefined];
};

export const LocalServerApiMapScene = {
  [LocalServerApi.OptimalQuoteByKeyMarket]: LocalServerRealtimeScene.LocalServerRealtimeSceneOptimalQuote,
  [LocalServerApi.QuoteByKeyMarket]: LocalServerRealtimeScene.LocalServerRealtimeSceneGetQuoteByKeyMarket,
  [LocalServerApi.QuoteById]: LocalServerRealtimeScene.LocalServerRealtimeSceneGetQuoteById,
  [LocalServerApi.DealRecordList]: LocalServerRealtimeScene.LocalServerRealtimeSceneDealInfo
};

// 类型为 0 问题
// @ts-ignore
export const SpotDateMapSettlementType: Record<SpotDate, OptimalQuoteSettlementType[]> = {
  [BitOper.combine(SpotDate.Plus1, SpotDate.Tomorrow0)]: [
    OptimalQuoteSettlementType.OptimalQuoteSettlementTypeTodayPlus1,
    OptimalQuoteSettlementType.OptimalQuoteSettlementTypeTomorrowPlus0
  ],
  [SpotDate.Plus0]: [OptimalQuoteSettlementType.OptimalQuoteSettlementTypeTodayPlus0],
  [SpotDate.NonFRA]: [
    OptimalQuoteSettlementType.OptimalQuoteSettlementTypeTodayPlus0,
    OptimalQuoteSettlementType.OptimalQuoteSettlementTypeTodayPlus1,
    OptimalQuoteSettlementType.OptimalQuoteSettlementTypeTomorrowPlus0
  ],
  [SpotDate.FRA]: [OptimalQuoteSettlementType.OptimalQuoteSettlementTypeForward]
};
