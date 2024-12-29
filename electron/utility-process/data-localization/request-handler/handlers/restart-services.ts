import type { LocalRestartLocalServices } from '@fepkg/services/types/data-localization-manual/restart-local-services';
import { DataLocalizationAction } from 'app/types/DataLocalization';
import { BaseRequestHandler } from '../base';

export class RestartServicesRequestHandler extends BaseRequestHandler<
  LocalRestartLocalServices.Request,
  LocalRestartLocalServices.Response
> {
  protected action = DataLocalizationAction.ServiceRestart;

  protected queryFn = this.dataController.restartServices.bind(this.dataController);
}
