import { ProductType } from '@fepkg/services/types/enum';
import { CommonRoute, WindowName } from 'app/types/window-v2';
import { MIN_HEIGHT, MIN_WIDTH } from '../Receipt/ReceiptDealLog/utils';

export const getDealDetailLogConfig = (productType: ProductType, dealId: string) => ({
  name: `${WindowName.DealDealLog}_${dealId}`,
  custom: { route: CommonRoute.DealDetailLog, routePathParams: [productType.toString(), dealId] },
  options: { width: MIN_WIDTH, height: MIN_HEIGHT, resizable: true, minWidth: MIN_WIDTH, minHeight: MIN_HEIGHT }
});
