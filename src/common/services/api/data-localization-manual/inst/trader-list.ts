import type { LocalInstTraderList } from '@fepkg/services/types/data-localization-manual/inst/trader-list';
import { DataLocalizationAction } from 'app/types/DataLocalization';
import localRequest from '@/common/request/local-request';

export const fetchLocalInstTraderList = (params: LocalInstTraderList.Request) => {
  return localRequest.invoke<LocalInstTraderList.Request, LocalInstTraderList.Response>({
    value: params,
    action: DataLocalizationAction.InstTraderList
  });
};
