import { useParams } from 'react-router-dom';
import { ProductType } from '@fepkg/services/types/enum';
import { useActiveProductType } from './useActiveProductType';

/** 从路由中获取当前的产品信息 */
export const useProductParams = () => {
  const params = useParams();
  const routeProductType: ProductType = Number(params?.productType ?? ProductType.BNC);
  const { activeProductType } = useActiveProductType() ?? {};

  const panelId = params?.panelId ?? routeProductType.toString();
  const productType = activeProductType ?? routeProductType;
  return {
    productType,
    panelId
  };
};
