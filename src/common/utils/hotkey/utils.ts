import { checkNCDJustNCDP, isNCD } from '@fepkg/business/utils/product';
import { AccessCode } from '@fepkg/services/access-code';
import { ProductType } from '@fepkg/services/types/bdm-enum';
import { UserHotkeyFunction } from '@fepkg/services/types/bds-enum';
import { OmsAccessCodeSuffix } from '@/common/types/access';
import { getOmsAccessCodeEnum } from '../access';
import { NCDP_HOTKEY_KEY_LIST } from './constants';

export const getHotkeyWithNumPad = (hotkey: string, combineSymbol: string) => {
  return hotkey
    .split(combineSymbol)
    .map(i => {
      if (/^\d$/.test(i)) return `num_${i}`;
      return i;
    })
    .join(combineSymbol);
};

export const checkHotkeyByProductType = (
  key: UserHotkeyFunction,
  access: Set<AccessCode>,
  productType = ProductType.ProductTypeNone
) => {
  // 是否有权限
  let hasAccess = true;
  // 业务属性是否展示
  let isShow = true;

  const isNCDAndJustNCDP = checkNCDJustNCDP(productType);
  if (isNCDAndJustNCDP) {
    isShow = NCDP_HOTKEY_KEY_LIST.includes(String(key));
  }

  // 当没有二级行情权限，但有一级行情权限时，也展示「清空条件」
  if (isNCD(productType) && key === UserHotkeyFunction.UserHotkeyShowAll) {
    hasAccess =
      access.has(getOmsAccessCodeEnum(ProductType.NCD, OmsAccessCodeSuffix.MktPage)) ||
      access.has(getOmsAccessCodeEnum(ProductType.NCDP, OmsAccessCodeSuffix.MktPage));
  } else if (key === UserHotkeyFunction.UserHotkeyShowAll) {
    hasAccess = access.has(getOmsAccessCodeEnum(productType, OmsAccessCodeSuffix.MktPage));
  }

  if (key === UserHotkeyFunction.UserHotkeyBondCalculator) {
    hasAccess = access.has(getOmsAccessCodeEnum(productType, OmsAccessCodeSuffix.CalMenu));
  }
  return hasAccess && isShow;
};
