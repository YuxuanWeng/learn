import { ProductType } from '@fepkg/services/types/bdm-enum';
import { CommonRoute, WindowName } from 'app/types/window-v2';
import { OperationLogContext } from './types';

export const getQuoteLogDialogConfig = (productType: ProductType, context: OperationLogContext) => ({
  name: `${WindowName.QuoteOperationLog}_${context.keyMarket ?? context.quoteId}`,
  custom: { route: CommonRoute.QuoteOperationLog, routePathParams: [productType.toString()], context },
  options: {
    width: 1200,
    height: 720,
    resizable: true,
    minWidth: 1200,
    minHeight: 720
  }
});
