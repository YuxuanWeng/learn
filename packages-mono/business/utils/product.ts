import { ProductType } from '@fepkg/services/types/bdm-enum';
import { miscStorage } from '@/localdb/miscStorage';

/**
 * 根据传入的产品类型返回是否存单台，如果当前产品是NCD或者NCDP则认为是存单台
 * @param productType 产品类型
 * @returns 返回是否存单台
 */
export const isNCD = (productType: ProductType): boolean => {
  return productType === ProductType.NCD || productType === ProductType.NCDP;
};

/**
 * 根据传入的产品类型返回是否处于存单台但没有二级权限
 * @param productType 产品类型
 * @returns 返回是否处于存单台但没有二级权限
 */
export const checkNCDJustNCDP = (productType = ProductType.ProductTypeNone): boolean => {
  return isNCD(productType) && !miscStorage.availableProductTypeList?.includes(ProductType.NCD);
};
