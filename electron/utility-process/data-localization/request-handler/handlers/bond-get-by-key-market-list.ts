import type { LocalBondGetByKeyMarketList } from '@fepkg/services/types/data-localization-manual/bond/get-by-key-market-list';
import { DataLocalizationAction } from 'app/types/DataLocalization';
import { BaseRequestHandler } from '../base';

export class BondGetByKeyMarketListRequestHandler extends BaseRequestHandler<
  LocalBondGetByKeyMarketList.Request,
  LocalBondGetByKeyMarketList.Response
> {
  protected action = DataLocalizationAction.BondGetByKeyMarketList;

  protected queryFn = this.dataController.bondGetByKeyMarketList.bind(this.dataController);
}
