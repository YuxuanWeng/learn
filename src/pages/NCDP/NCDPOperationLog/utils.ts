import { MIN_HEIGHT, MIN_WIDTH } from '@fepkg/business/components/LogTable/constant';
import { CommonRoute, WindowName } from 'app/types/window-v2';

export const getNCDPLogConfig = (ncdpId: string, productType: string, referred: string) => ({
  name: `${WindowName.NCDPOperationLog}_${ncdpId}`,
  custom: { route: CommonRoute.NCDPOperationLog, routePathParams: [productType, ncdpId, referred] },
  options: { width: MIN_WIDTH, height: MIN_HEIGHT, resizable: true, minWidth: MIN_WIDTH, minHeight: MIN_HEIGHT }
});
