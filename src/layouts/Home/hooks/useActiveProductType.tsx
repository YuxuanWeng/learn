import { ReactNode, createContext, useContext, useState } from 'react';
import { useParams } from 'react-router-dom';
import { ProductType } from '@fepkg/services/types/enum';
import { useMemoizedFn } from 'ahooks';
import { useAccess } from '@/common/providers/AccessProvider';
import { initUserHotkeys } from '@/common/utils/hotkey/initUserHotkeys';
import { miscStorage } from '@/localdb/miscStorage';

const useActiveProductTypeValue = () => {
  const params = useParams();
  const { access } = useAccess();

  const routeProductType: ProductType = Number(params?.productType ?? ProductType.BNC);
  const [activeProductType, setActiveProductType] = useState(routeProductType);

  const changeActiveProductType = useMemoizedFn((productType: ProductType) => {
    initUserHotkeys(access, productType);
    setActiveProductType(productType);
    miscStorage.productType = productType;
  });

  return { activeProductType, changeActiveProductType };
};

const ActiveProductTypeContext = createContext<ReturnType<typeof useActiveProductTypeValue> | null>(null);

export const ActiveProductTypeProvider = ({ children }: { children: ReactNode }) => {
  const value = useActiveProductTypeValue();
  return <ActiveProductTypeContext.Provider value={value}>{children}</ActiveProductTypeContext.Provider>;
};

export const useActiveProductType = () => useContext(ActiveProductTypeContext);
