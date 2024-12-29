import { useLayoutEffect, useMemo, useState } from 'react';
import { SpotMainEnterType } from '@fepkg/business/constants/log-map';
import { useLocalStorage } from '@fepkg/business/hooks/useLocalStorage';
import { isTextInputElement } from '@fepkg/common/utils/element';
import { message } from '@fepkg/components/Message';
import { TabItem } from '@fepkg/components/Tabs';
import { FiccBondBasic } from '@fepkg/services/types/bds-common';
import { useMemoizedFn } from 'ahooks';
import { clone, cloneDeep, throttle } from 'lodash-es';
import { createContainer } from 'unstated-next';
import { LSKeys, getLSKey } from '@/common/constants/ls-keys';
import { useAccess } from '@/common/providers/AccessProvider';
import { OmsAccessCodeSuffix } from '@/common/types/access';
import { getOmsAccessCodeEnum } from '@/common/utils/access';
import { trackPoint } from '@/common/utils/logger/point';
import type { BondsCache, SpotDateStorage } from '@/components/IDCBoard/types';
import { SpotDate } from '@/components/IDCSpot/types';
import { useProductParams } from '@/layouts/Home/hooks';
import { miscStorage } from '@/localdb/miscStorage';
import { BondTabs } from '../../types';
import { useHotkeys } from '../hooks/useHotkey';

/** 默认债券页签列表 */
const DEFAULT_BOND_TABS = {
  [BondTabs.BondTab1]: { key: BondTabs.BondTab1, label: '债券一', bonds: {}, index: 1 },
  [BondTabs.BondTab2]: { key: BondTabs.BondTab2, label: '债券二', bonds: {}, index: 2 },
  [BondTabs.BondTab3]: { key: BondTabs.BondTab3, label: '债券三', bonds: {}, index: 3 }
};

const DEFAULT_DATE_CACHE = { [BondTabs.BondTab1]: {}, [BondTabs.BondTab2]: {}, [BondTabs.BondTab3]: {} };

const MAX_TAB_NAME_LENGTH = 10;

type CacheValue = { key: BondTabs; label: string; bonds: BondsCache; index: number };

type BondTabCache = { [key in BondTabs]: CacheValue };
type BondDateCache = SpotDateStorage;

type InitialState = { detailBond?: FiccBondBasic | null };

export const PanelStateContainer = createContainer((initialState?: InitialState) => {
  const { access } = useAccess();
  const { productType } = useProductParams();

  // 详情页面的bond
  const bondFromDetail = initialState?.detailBond;
  // 是否为精简模式
  const isSimplify = bondFromDetail ? false : miscStorage.isTradeBoardSimple === true;

  /** 缓存的债券 */
  const bondCacheKey = getLSKey(isSimplify ? LSKeys.BoardBondsStoSimple : LSKeys.BoardBondsSto, productType);
  const [bondsCache, setBondsCache] = useLocalStorage<BondTabCache>(bondCacheKey, DEFAULT_BOND_TABS);

  /** 缓存的时间 */
  const dateCacheKey = getLSKey(LSKeys.BoardSpotDateStoSimple, productType);
  const [dateCache, setDateCache] = useLocalStorage<BondDateCache>(dateCacheKey, DEFAULT_DATE_CACHE);

  /** 当前选中的tab */
  const [activeBondTabId, setActiveBondTabId] = useState(BondTabs.BondTab1);

  const activeBondTab = bondsCache[activeBondTabId];

  useLayoutEffect(() => {
    trackPoint(isSimplify ? SpotMainEnterType.SimpleMode : SpotMainEnterType.FullMode);
  }, [isSimplify]);

  /** 更新债券的缓存信息 */
  const updateCache = (idx: number, keyMarket?: string) => {
    if (idx < 0) return;

    const cloneCache = cloneDeep(bondsCache);
    if (cloneCache[activeBondTabId].bonds[idx] === keyMarket) return;

    // eslint-disable-next-line guard-for-in
    for (const key in cloneCache) {
      const { bonds } = cloneCache[key];
      for (const i in bonds) {
        // 如果在其他标签页已经缓存了当前的bond key，则将其顶掉
        if (bonds[i] === keyMarket) delete bonds[i];
      }
    }
    cloneCache[activeBondTabId].bonds[idx] = keyMarket;

    setBondsCache(cloneCache);
  };

  /** 更新债券的缓存信息 */
  const updateSpotCache = (idx: number, spotDate?: SpotDate) => {
    // 相同位置缓存与当前要设置的值相同时，直接return
    if (idx < 0) return;

    try {
      if (spotDate === dateCache[activeBondTabId][idx]) return;
    } catch {
      console.log('说明数组越界，没有找到相同的值，正常设置');
    }

    setDateCache(sto => {
      const newSto = cloneDeep(sto);
      if (!newSto[activeBondTabId]) newSto[idx] = {};
      newSto[activeBondTabId][idx] = spotDate;
      return newSto;
    });
  };

  const switchMarketCallback = useMemoizedFn(() => {
    // 焦点在input中就不触发切换tab的操作
    if (isTextInputElement(document.activeElement)) return;
    const values = Object.values(bondsCache);

    const curIdx = values.findIndex(i => i.key === activeBondTabId);
    const nextIdx = curIdx + 1 > values.length - 1 ? 0 : curIdx + 1;

    setActiveBondTabId(values[nextIdx].key);

    // 避免切换tab时焦点自动聚焦到页面的input中
    requestAnimationFrame(() => document.body.focus());
  });

  const debounceSwitch = useMemo(
    () =>
      throttle(() => switchMarketCallback(), 300, {
        leading: true,
        trailing: false
      }),
    [switchMarketCallback]
  );

  const memorizeSwitchFn = useMemoizedFn(() => {
    debounceSwitch();
  });

  /** 修改Tab名称 */
  const handleBondTabNameChange = (tab: TabItem<BondTabs>): boolean => {
    if (!tab.label) {
      message.error('页签名称不能为空');
      return false;
    }

    if (tab.label.length > MAX_TAB_NAME_LENGTH) {
      message.error(`页签名称最多${MAX_TAB_NAME_LENGTH}字`);
      return false;
    }
    const cloneCache = clone(bondsCache);
    cloneCache[tab.key].label = tab.label;
    setBondsCache(cloneCache);
    return true;
  };

  useHotkeys(memorizeSwitchFn);

  /** 报价面板展示列数: 根据是否是精简模式有所区别 */
  const column = isSimplify ? 4 : 2;

  const colWidth = isSimplify ? 300 : 616;
  const width = `${column * colWidth}px`;

  const accessCache = {
    spotPricing: access?.has(getOmsAccessCodeEnum(productType, OmsAccessCodeSuffix.SpotPricingPage)),
    action: access?.has(getOmsAccessCodeEnum(productType, OmsAccessCodeSuffix.SpotPricingAction)),
    refer: access?.has(getOmsAccessCodeEnum(productType, OmsAccessCodeSuffix.SpotPricingRefer)),
    recordEdit: access?.has(getOmsAccessCodeEnum(productType, OmsAccessCodeSuffix.SpotPricingRecordEdit)),
    recordSend: access?.has(getOmsAccessCodeEnum(productType, OmsAccessCodeSuffix.SpotPricingRecordSend)),
    recordLog: access?.has(getOmsAccessCodeEnum(productType, OmsAccessCodeSuffix.SpotPricingRecordLog)),
    history: access?.has(getOmsAccessCodeEnum(productType, OmsAccessCodeSuffix.SpotPricingHistPage)),
    dealDetail: access?.has(getOmsAccessCodeEnum(productType, OmsAccessCodeSuffix.DealDetailPage))
  };

  return {
    bondsCache,

    accessCache,
    bondFromDetail,

    /** 展示的列数 */
    column,
    width,
    isSimplify,

    spotDateCache: dateCache,

    handleBondTabNameChange,

    /** 当前活跃的BondTab */
    activeBondTab,
    activeBondTabId,
    setActiveBondTabId,

    switchMarketCallback,
    updateCache,
    updateSpotCache
  };
});

/** 报价面板上下文 */
export const PanelStateProvider = PanelStateContainer.Provider;
export const usePanelState = PanelStateContainer.useContainer;
