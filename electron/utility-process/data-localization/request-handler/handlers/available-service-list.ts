import type { LocalServicesStatus } from '@fepkg/services/types/data-localization-manual/available-service';
import { DataLocalizationAction } from 'app/types/DataLocalization';
import { BaseRequestHandler } from '../base';

export class AvailableServicesRequestHandler extends BaseRequestHandler<
  LocalServicesStatus.Request,
  LocalServicesStatus.Response
> {
  protected action = DataLocalizationAction.LocalServicesStatus;

  protected queryFn = this.dataController.getLocalServicesStatus.bind(this.dataController);
}
