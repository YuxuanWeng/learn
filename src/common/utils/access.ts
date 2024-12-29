import { isNCD } from '@fepkg/business/utils/product';
import { AccessCode } from '@fepkg/services/access-code';
import { ProductType } from '@fepkg/services/types/enum';
import { OmsAccessCodeSuffix } from '@/common/types/access';
import { miscStorage } from '@/localdb/miscStorage';

export const getNCDAccess = () => {
  const availableProductTypeList = miscStorage.availableProductTypeList ?? [];

  const access = { ncdP: false, ncd: false };

  for (const productType of availableProductTypeList) {
    if (productType === ProductType.NCDP) access.ncdP = true;
    else if (productType === ProductType.NCD) access.ncd = true;
  }

  return access;
};

export const getDefaultProductType = (productType?: ProductType, availableProductTypeList?: ProductType[]) => {
  if (!availableProductTypeList?.length) {
    return void 0;
  }
  /** ProductType.NCD, ProductType.NCDP 拥有其中一个都可以进入存单台 */
  if (productType && isNCD(productType)) {
    const hasNCD = availableProductTypeList?.some(p => ProductType.NCD === p);
    if (hasNCD) return ProductType.NCD;
    const hasNCDP = availableProductTypeList?.some(p => ProductType.NCDP === p);
    if (hasNCDP) return ProductType.NCDP;
  }
  /** 除存单台，进入用户上一次进入的台子 */
  if (availableProductTypeList?.some(p => productType === p)) {
    return productType;
  }
  /** 如果有利率权限，优先使用 ProductType.BNC */
  if (availableProductTypeList?.some(p => p === ProductType.BNC)) {
    return ProductType.BNC;
  }
  /** 否则，取用户信息-product_list首个product的type */
  return availableProductTypeList?.at(0);
};

/**
 * 获取OMS系统中不同台子的相同权限
 * @param productType 台子类型
 * @param enumName 权限名称（CodeOms***后的部分，OMS系统级权限可不传）
 */
export const getOmsAccessCodeEnum = (productType: ProductType, enumName: OmsAccessCodeSuffix): AccessCode => {
  const a = `CodeOms${ProductType[productType]}${enumName ?? ''}`;
  if (a in AccessCode) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return AccessCode[a];
  }
  return AccessCode.DefaultCodeEnum;
};
