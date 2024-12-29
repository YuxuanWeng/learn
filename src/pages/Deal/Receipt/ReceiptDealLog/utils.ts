import { ProductType } from '@fepkg/services/types/enum';
import { CommonRoute, WindowName } from 'app/types/window-v2';

export const MIN_WIDTH = 1400 + 2;
export const MIN_HEIGHT = 720;

export const getReceiptDealLogConfig = (productType: ProductType, dealId: string) => ({
  name: `${WindowName.ReceiptDealLog}_${dealId}`,
  custom: { route: CommonRoute.ReceiptDealLog, routePathParams: [productType.toString(), dealId] },
  options: { width: MIN_WIDTH, height: MIN_HEIGHT, resizable: true, minWidth: MIN_WIDTH, minHeight: MIN_HEIGHT }
});
