import { ProductType } from '@fepkg/services/types/bdm-enum';
import { CommonRoute, WindowName } from 'app/types/window-v2';
import { DealLogContext } from './types';

export const getDealLogDialogConfig = (productType: ProductType, context: DealLogContext) => ({
  name: `${WindowName.MarketOperationLog}_${context.marketDealId}`,
  custom: { route: CommonRoute.MarketOperationLog, routePathParams: [productType.toString()], context },
  options: { width: 1200, height: 720, resizable: true, minWidth: 1200, minHeight: 720 }
});
