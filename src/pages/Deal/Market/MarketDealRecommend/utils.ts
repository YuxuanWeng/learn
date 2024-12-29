import { ProductType } from '@fepkg/services/types/bdm-enum';
import { CommonRoute, WindowName } from 'app/types/window-v2';
import { omit } from 'lodash-es';
import { LSKeys, getLSKey } from '@/common/constants/ls-keys';
import { DefaultPageSizeValue, LineHeight, PaddingY, WindowWidth } from './constants';
import { MarketRecommendDialogContext, MarketRecommendSettingDialogContext } from './types';

export const getDealRecommendDialogConfig = (productType: ProductType, context: MarketRecommendDialogContext) => {
  const pageSize = localStorage.getItem(getLSKey(LSKeys.MarketDealRecommendPageSize, productType));
  const isTop = localStorage.getItem(getLSKey(LSKeys.MarketDealRecommendIsTop, productType));

  return {
    name: WindowName.MarketRecommend,
    custom: {
      route: CommonRoute.MarketRecommend,
      routePathParams: [productType.toString()],
      context: omit(context, 'onSuccess', 'onCancel'),
      isTop: isTop ? isTop === 'true' : false
    },
    options: {
      width: WindowWidth,
      height: Math.min((pageSize ? Number(pageSize) : DefaultPageSizeValue) * LineHeight + PaddingY, 500),
      resizable: false,
      minHeight: LineHeight * 0.5,
      minWidth: WindowWidth * 0.5
    }
  };
};

export const getDealRecommendSettingDialogConfig = (
  productType: ProductType,
  context?: MarketRecommendSettingDialogContext
) => ({
  name: WindowName.MarketRecommendSetting,
  custom: {
    route: CommonRoute.MarketRecommendSetting,
    routePathParams: [productType.toString()],
    context: omit(context, 'onSuccess', 'onCancel'),
    isTop: true
  },
  options: {
    width: 360 + 2,
    height: 256 + 2,
    resizable: false,
    modal: true
  }
});
