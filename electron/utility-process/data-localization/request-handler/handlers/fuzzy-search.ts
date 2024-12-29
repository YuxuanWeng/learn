import type { LocalFuzzySearch } from '@fepkg/services/types/data-localization-manual/fuzzy-search';
import { DataLocalizationAction } from 'app/types/DataLocalization';
import { BaseRequestHandler } from '../base';

export class FuzzySearchRequestHandler extends BaseRequestHandler<LocalFuzzySearch.Request, LocalFuzzySearch.Response> {
  protected action = DataLocalizationAction.FuzzySearch;

  protected queryFn = this.dataController.fuzzySearch.bind(this.dataController);
}
