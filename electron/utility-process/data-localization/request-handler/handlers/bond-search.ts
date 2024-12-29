import type { LocalBondSearch } from '@fepkg/services/types/data-localization-manual/bond/search';
import { DataLocalizationAction } from 'app/types/DataLocalization';
import { BaseRequestHandler } from '../base';

export class BondSearchRequestHandler extends BaseRequestHandler<LocalBondSearch.Request, LocalBondSearch.Response> {
  protected action = DataLocalizationAction.BondSearch;

  protected queryFn = this.dataController.bondSearch.bind(this.dataController);
}
