import { Reducer, useReducer } from 'react';
import { FiccBondBasic } from '@fepkg/services/types/common';
import { createContainer } from 'unstated-next';
import { useAccess } from '@/common/providers/AccessProvider';
import { OmsAccessCodeSuffix } from '@/common/types/access';
import { getOmsAccessCodeEnum } from '@/common/utils/access';
import { SpotDate } from '@/components/IDCSpot/types';
import { useProductParams } from '@/layouts/Home/hooks';
import { usePanelState } from '@/pages/Spot/Panel/Providers/PanelStateProvider';

export type HeadProviderProps = { idx?: number };

const HeadContainer = createContainer((initialState?: HeadProviderProps) => {
  const { access } = useAccess();
  const { activeBondTab, isSimplify, spotDateCache, bondFromDetail, activeBondTabId, updateSpotCache } =
    usePanelState();
  const { productType } = useProductParams();

  const isDetailPage = !!bondFromDetail;
  const idx = initialState?.idx;
  const initSpotDate = spotDateCache?.[activeBondTabId]?.[String(idx)];
  const initKeyMarket = idx !== undefined && !isDetailPage ? activeBondTab.bonds[idx] : bondFromDetail?.key_market;

  const [quickSpotDate, setQuickSpotDate] = useReducer<Reducer<SpotDate | undefined, SpotDate | undefined>>(
    (prev: SpotDate | undefined, next: SpotDate | undefined) => {
      if (!isSimplify) return prev;
      requestIdleCallback(() => {
        // 更新结算方式缓存
        if (idx !== undefined) updateSpotCache(idx, next);
      });
      return next;
    },
    initSpotDate || SpotDate.NonFRA
  );

  // 此Bond数据是Panel组件下全局共用的，目的是减少数据传递层级
  const [bond, setBond] = useReducer<Reducer<FiccBondBasic | undefined | null, FiccBondBasic | undefined | null>>(
    (_, next: FiccBondBasic | undefined | null) => next,
    bondFromDetail
  );

  const accessCache = {
    action: access?.has(getOmsAccessCodeEnum(productType, OmsAccessCodeSuffix.SpotPricingAction)),
    refer: access?.has(getOmsAccessCodeEnum(productType, OmsAccessCodeSuffix.SpotPricingRefer))
  };

  return {
    idx,
    accessCache,
    initKeyMarket,
    bond,
    isSimplify,
    isDetailPage,
    quickSpotDate,

    setBond,
    setQuickSpotDate
  };
});

export const HeadProvider = HeadContainer.Provider;
export const useHead = HeadContainer.useContainer;
