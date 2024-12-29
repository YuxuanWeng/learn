import type { LocalUserSearch } from '@fepkg/services/types/data-localization-manual/user/search';
import { DataLocalizationAction } from 'app/types/DataLocalization';
import { BaseRequestHandler } from '../base';

export class UserSearchRequestHandler extends BaseRequestHandler<LocalUserSearch.Request, LocalUserSearch.Response> {
  protected action = DataLocalizationAction.UserSearch;

  protected queryFn = this.dataController.userSearch.bind(this.dataController);
}
