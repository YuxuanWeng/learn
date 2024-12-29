import type { LocalInstTraderList } from '@fepkg/services/types/data-localization-manual/inst/trader-list';
import { DataLocalizationAction } from 'app/types/DataLocalization';
import { BaseRequestHandler } from '../base';

export class InstTraderListRequestHandler extends BaseRequestHandler<
  LocalInstTraderList.Request,
  LocalInstTraderList.Response
> {
  protected action = DataLocalizationAction.InstTraderList;

  protected queryFn = this.dataController.instTraderList.bind(this.dataController);
}
