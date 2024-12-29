import type { LocalServicesStatus } from '@fepkg/services/types/data-localization-manual/available-service';
import { DataLocalizationAction } from 'app/types/DataLocalization';
import localRequest from '@/common/request/local-request';

export const fetchLocalServicesStatus = (value: LocalServicesStatus.Request = {}) => {
  return localRequest.invoke<LocalServicesStatus.Request, LocalServicesStatus.Response>({
    value,
    action: DataLocalizationAction.LocalServicesStatus
  });
};
