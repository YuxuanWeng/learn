import type { LocalInstSearch } from '@fepkg/services/types/data-localization-manual/inst/search';
import { DataLocalizationAction } from 'app/types/DataLocalization';
import { BaseRequestHandler } from '../base';

export class InstSearchRequestHandler extends BaseRequestHandler<LocalInstSearch.Request, LocalInstSearch.Response> {
  protected action = DataLocalizationAction.InstSearch;

  protected queryFn = this.dataController.instSearch.bind(this.dataController);
}
