import { RequestConfig } from '@fepkg/request/types';
import { APIs } from '@fepkg/services/apis';
import { LocalTraderGetByIdList } from '@fepkg/services/types/data-localization-manual/trader/get-by-id-list';
import { LocalServerTraderGetById } from '@fepkg/services/types/local-server/trader-get-by-id';
import { DataLocalizationAction } from 'app/types/DataLocalization';
import request from '@/common/request';
import localRequest from '@/common/request/local-request';

export const fetchLocalTraderByIdList = (params: LocalTraderGetByIdList.Request) => {
  return localRequest.invoke<LocalTraderGetByIdList.Request, LocalTraderGetByIdList.Response>({
    value: params,
    action: DataLocalizationAction.TraderGetByIdList
  });
};

export const fetchTraderByIdList = async (params: LocalServerTraderGetById.Request, config?: RequestConfig) => {
  const res = await request.post<LocalServerTraderGetById.Response, LocalServerTraderGetById.Request>(
    APIs.trader.getById,
    { ...params },
    config
  );

  // TODO: 前端本地化下线后数据结构改回LocalTraderGetByIdList.Response
  return {
    base_response: res.base_response,
    trader_sync_list: res.trader_list ?? []
  } as LocalTraderGetByIdList.Response;
};
