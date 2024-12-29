import type { LocalRestartLocalServices } from '@fepkg/services/types/data-localization-manual/restart-local-services';
import { DataLocalizationAction } from 'app/types/DataLocalization';
import localRequest from '@/common/request/local-request';

export const restartLocalServices = (value: LocalRestartLocalServices.Request) => {
  return localRequest.invoke<LocalRestartLocalServices.Request, LocalRestartLocalServices.Response>({
    value,
    action: DataLocalizationAction.ServiceRestart
  });
};
