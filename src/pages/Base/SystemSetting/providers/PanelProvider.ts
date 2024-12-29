import { useMemo } from 'react';
import { checkNCDJustNCDP, isNCD } from '@fepkg/business/utils/product';
import { ProductType } from '@fepkg/services/types/bdm-enum';
import { createContainer } from 'unstated-next';
import { useAccess } from '@/common/providers/AccessProvider';
import { OmsAccessCodeSuffix } from '@/common/types/access';
import { getOmsAccessCodeEnum } from '@/common/utils/access';
import { useActiveProductType } from '@/layouts/Home/hooks/useActiveProductType';
import { SettingMenuItem } from '../types';
import { checkMenuOptionsByProductType } from '../utils';

export type SystemMenuState = {
  activeKey?: string;
  options: SettingMenuItem[];
};

export const SystemSettingPanelContainer = createContainer((defaultOptions?: SettingMenuItem[]) => {
  const { activeProductType = ProductType.ProductTypeNone } = useActiveProductType() ?? {};
  const { access } = useAccess();

  /** 用户设置productType，非存单台子使用activeProductType，存单台子有二级权限则视为二级，只有一级权限时才用一级 */
  const productType = useMemo(() => {
    if (!isNCD(activeProductType)) return activeProductType;
    return checkNCDJustNCDP(activeProductType) ? ProductType.NCDP : ProductType.NCD;
  }, [activeProductType]);

  const menuState = useMemo(() => {
    const options =
      defaultOptions?.filter(item => {
        // 按各个台子业务要求过滤
        const isShow = checkMenuOptionsByProductType(item.id, productType);
        // 过滤无权限的
        const hasAccess = item.accessCodes.some(code => access.has(getOmsAccessCodeEnum(productType, code)));

        return isShow && hasAccess;
      }) ?? [];

    return {
      activeKey: undefined,
      options
    };
  }, [access, defaultOptions, productType]);

  const accessCache = {
    market: access?.has(getOmsAccessCodeEnum(productType, OmsAccessCodeSuffix.MktPage)),
    spotPricing: access?.has(getOmsAccessCodeEnum(productType, OmsAccessCodeSuffix.SpotPricingMenu)),
    quote: access?.has(getOmsAccessCodeEnum(productType, OmsAccessCodeSuffix.MktQuote)),
    calc: access?.has(getOmsAccessCodeEnum(productType, OmsAccessCodeSuffix.CalMenu)),
    assign: access?.has(getOmsAccessCodeEnum(productType, OmsAccessCodeSuffix.SettingAssign))
  };

  return {
    menuState,
    productType,

    accessCache
  };
});

export const SystemSettingPanelProvider = SystemSettingPanelContainer.Provider;
export const useSystemSettingPanel = SystemSettingPanelContainer.useContainer;
