import { ReactNode, createContext, useContext, useMemo, useRef } from 'react';
import { AccessCode } from '@fepkg/services/access-code';
import { ProductType } from '@fepkg/services/types/bdm-enum';
import { User } from '@fepkg/services/types/common';
import { useDtmLiveAccessQuery } from '@/hooks/useDtmLiveAccessQuery';
import { getUserProductList } from '@/utils/product';

type AuthContextType = {
  user?: User;
  access?: Set<AccessCode>;
  // 拥有的与本系统有关的产品权限
  productTypeList?: ProductType[];
};

export const AuthContext = createContext<AuthContextType>({});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const { access, user } = useDtmLiveAccessQuery();
  const preProductList = useRef<ProductType[]>();

  const value = useMemo(() => {
    // 拥有的与本系统有关的产品权限，后台岗位拥有所有业务产品权限
    const productTypeList = getUserProductList(user);
    if (!preProductList.current) {
      preProductList.current = productTypeList;
    }
    return { user, access, productTypeList };
  }, [access, user]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
