import type { LocalTraderGetByIdList } from '@fepkg/services/types/data-localization-manual/trader/get-by-id-list';
import { DataLocalizationAction } from 'app/types/DataLocalization';
import { BaseRequestHandler } from '../base';

export class TraderGetByIdListRequestHandler extends BaseRequestHandler<
  LocalTraderGetByIdList.Request,
  LocalTraderGetByIdList.Response
> {
  protected action = DataLocalizationAction.TraderGetByIdList;

  protected queryFn = this.dataController.traderGetByIdList.bind(this.dataController);
}
