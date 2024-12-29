import { useRef, useState } from 'react';
import { useLocalStorage } from '@fepkg/business/hooks/useLocalStorage';
import { ProductType } from '@fepkg/services/types/enum';
import { createContainer } from 'unstated-next';
import { LSKeys, getLSKey } from '@/common/constants/ls-keys';
import { useAccess } from '@/common/providers/AccessProvider';
import { OmsAccessCodeSuffix } from '@/common/types/access';
import { getOmsAccessCodeEnum } from '@/common/utils/access';
import { useProductParams } from '@/layouts/Home/hooks';
import { useProductPanelLoader } from '@/pages/ProductPanel/providers/MainGroupProvider/preload';
import { ProductPanelTableKey } from '../types';

export const ProductPanelContainer = createContainer(() => {
  const { access } = useAccess();
  const { productType } = useProductParams();
  const { cacheProductType } = useProductPanelLoader();

  const sidebarRef = useRef<HTMLDivElement>(null);

  const [activeTableKey, setActiveTableKey] = useState(ProductPanelTableKey.Basic);

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [filterOpen, setFilterOpen] = useState(true);

  const groupOpenKey = getLSKey(LSKeys.MainGroupUnfold, cacheProductType);
  const [groupOpen, setGroupOpen] = useLocalStorage<boolean>(groupOpenKey, true);

  const groupStoreKey = getLSKey(LSKeys.MainGroup, cacheProductType);

  const accessCache = {
    quote: access.has(getOmsAccessCodeEnum(productType, OmsAccessCodeSuffix.MktQuote)),
    colQuote: access.has(getOmsAccessCodeEnum(productType, OmsAccessCodeSuffix.CollaborationMenu)),
    deal: access.has(getOmsAccessCodeEnum(productType, OmsAccessCodeSuffix.MktDeal)),
    detail: access.has(getOmsAccessCodeEnum(productType, OmsAccessCodeSuffix.MktBond)),
    log: access.has(getOmsAccessCodeEnum(productType, OmsAccessCodeSuffix.MktLog)),
    report: access.has(getOmsAccessCodeEnum(ProductType.NCDP, OmsAccessCodeSuffix.Report))
  };

  const toggleSidebarOpen = () => setSidebarOpen(prev => !prev);

  const toggleFilterOpen = () => setFilterOpen(prev => !prev);

  const toggleGroupOpen = () => setGroupOpen(prev => !prev);

  const isNCDP = productType === ProductType.NCDP;

  return {
    accessCache,

    sidebarRef,
    activeTableKey,
    setActiveTableKey,

    // 若报价和成交权限均无，则不展示右侧操作栏
    sidebarOpen: !accessCache.quote && !accessCache.deal ? true : sidebarOpen,
    toggleSidebarOpen,

    filterOpen,
    toggleFilterOpen,

    groupOpen,
    toggleGroupOpen,

    groupStoreKey,

    isNCDP
  };
});

export const ProductPanelProvider = ProductPanelContainer.Provider;
export const useProductPanel = ProductPanelContainer.useContainer;
