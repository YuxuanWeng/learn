import { AccessCode } from '@fepkg/services/access-code';
import { ProductType } from '@fepkg/services/types/bdm-enum';

/** 本系统相关的业务产品 */
export const AccessProductTypeList = [ProductType.BNC, ProductType.BCO, ProductType.NCD, ProductType.NCDP];

export const ProductType2AccessCodeMap = {
  [ProductType.BNC]: AccessCode.CodeOmsBNC,
  [ProductType.BCO]: AccessCode.CodeOmsBCO,
  [ProductType.NCD]: AccessCode.CodeOmsNCD,
  [ProductType.NCDP]: AccessCode.CodeOmsNCDP
};
