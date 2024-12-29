import { LocalServerDealRecordList } from '@fepkg/services/types/local-server/deal-record-list';
import { LiveQueryConfig, LocalServerApi } from '../types';
import { useLocalServerLiveQuery } from '../useLocalServerLiveQuery';
import { LocalServerApiMapScene } from '../utils';

const api = LocalServerApi.DealRecordList;

export const useDealRecordListQuery = ({
  params,
  interval,
  enabled = true,
  onSuccess
}: LiveQueryConfig<LocalServerDealRecordList.Request>) => {
  const enable = enabled && !!params?.broker_id_list?.length;

  return useLocalServerLiveQuery<LocalServerDealRecordList.Request, LocalServerDealRecordList.Response>({
    api,
    scene: LocalServerApiMapScene[api],
    params,
    interval,
    enabled: enable,
    onSuccess
  });
};
