import { checkNCDJustNCDP } from '@fepkg/business/utils/product';
import { ProductType } from '@fepkg/services/types/bdm-enum';
import { isProd } from '@/common/utils';
import { ScrollMenuIDType } from '@/components/ScrollMenu/types';

const NCDP_MENU_SET = new Set([ScrollMenuIDType.AccountSafe, ScrollMenuIDType.ShortCut, ScrollMenuIDType.SystemManage]);

export const checkMenuOptionsByProductType = (menuId: ScrollMenuIDType, productType: ProductType) => {
  // TODO: 2.13时删除
  if (isProd() && menuId === ScrollMenuIDType.TradeSettings) {
    return productType === ProductType.BNC;
  }

  // 存单台子，无二级台子权限时，只上账户与安全、快捷键、系统设置
  if (checkNCDJustNCDP(productType)) {
    return NCDP_MENU_SET.has(menuId);
  }
  return true;
};
