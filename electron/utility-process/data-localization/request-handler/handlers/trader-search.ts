import type { LocalTraderSearch } from '@fepkg/services/types/data-localization-manual/trader/search';
import { DataLocalizationAction } from 'app/types/DataLocalization';
import { BaseRequestHandler } from '../base';

export class TraderSearchRequestHandler extends BaseRequestHandler<
  LocalTraderSearch.Request,
  LocalTraderSearch.Response
> {
  protected action = DataLocalizationAction.TraderSearch;

  protected queryFn = this.dataController.traderSearch.bind(this.dataController);
}
