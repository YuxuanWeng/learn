import { useParams } from 'react-router-dom';
import { ProductType } from '@fepkg/services/types/enum';

/** 从路由中获取当前的产品信息 */
export const useProductParams = () => {
  const params = useParams();

  const productType = Number(params?.productType ?? ProductType.BNC) as ProductType;
  // const panelId = params?.panelId ?? productType.toString();

  return { productType };
};
