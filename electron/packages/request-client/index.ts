import { getResponseFulfilledInterceptor, getResponseRejectedInterceptor } from '@fepkg/request/interceptors';
import { getResponseTransformer, protoRoot } from '@fepkg/request/protobuf';
import { FromSystem, RequestConfig, RequestParams, RequestResponse } from '@fepkg/request/types';
import { handleRequestError } from '@fepkg/request/utils';
import { APIs } from '@fepkg/services/apis';
import type { ImQqGroupMsgAdd } from '@fepkg/services/types//im/qq-group-msg-add';
import type { AlgoAbaseMessageFlowQqChatStream } from '@fepkg/services/types/algo/message-flow-qq-chat-stream';
import type { CheckLogin } from '@fepkg/services/types/auth/check-login';
import type { BaseDataBaseSyncDataScan } from '@fepkg/services/types/base-data/base-sync-data-scan';
import type { BaseDataBondGetByKeyMarket } from '@fepkg/services/types/base-data/bond-get-by-key-market';
import type { BaseDataSyncDataChannelGet } from '@fepkg/services/types/base-data/sync-data-channel-get';
import type { BaseDataSyncDataInfoGet } from '@fepkg/services/types/base-data/sync-data-info-get';
import type { BaseDataSyncDataScan } from '@fepkg/services/types/base-data/sync-data-scan';
import type { BondQuoteSyncDataGet } from '@fepkg/services/types/bond-quote/sync-data-get';
import type { BaseQqSendMsgCallback } from '@fepkg/services/types/data-localization-manual/base/qq-send-msg-callback';
import type { DealNotifyUnreadGetAll } from '@fepkg/services/types/deal/notify-unread-get-all';
import type { TraderSearch } from '@fepkg/services/types/trader/search';
import type { UserList } from '@fepkg/services/types/user/list';
import type { AxiosInstance, AxiosRequestHeaders } from 'axios';
import axios from 'axios';
import { RequestClientConfig } from './types';

const defaultConfig: RequestConfig = {
  timeout: 15 * 1000,
  withCredentials: true,
  headers: {
    'Access-Control-Allow-Origin': '*',
    'FROM-SYSTEM': FromSystem.OMS
  }
};

// 用于pb数据类型解析
const baseDataType = protoRoot.lookupType('bdm_bds_bds_api_base_data_base_sync_data_scan_response');
const businessDataType = protoRoot.lookupType('bdm_bds_bds_api_base_data_sync_data_scan_response');

export class RequestClient {
  private instance: AxiosInstance;

  private token: string;

  constructor(config: RequestClientConfig) {
    this.token = config.token;

    const headers: AxiosRequestHeaders = {
      ...defaultConfig.headers,
      'BDM-AUTH-TOKEN': config.token,
      'CLIENT-VERSION': config.version,
      'CLIENT-PLATFORM': config.platform,
      'CLIENT-DEVICE-ID': config.deviceId
    };

    if (config.productType) {
      headers['FROM-PRODUCT-TYPE'] = config.productType;
    }

    this.instance = axios.create({
      ...defaultConfig,
      baseURL: config.baseURL,
      headers
    });

    this.instance.interceptors.request.use(c => {
      if (c.headers != null) {
        c.headers['BDM-AUTH-TOKEN'] = this.token;
      }

      return c;
    });

    this.instance.interceptors.response.use(
      getResponseFulfilledInterceptor(),
      getResponseRejectedInterceptor(() => {
        // TODO this.eventClient.emit afterLogout(false, code);
      })
    );
  }

  tokenUpdate(token: string) {
    this.token = token;
  }

  async request<R extends RequestResponse, P extends RequestParams = Record<string, unknown>>(
    url: string,
    data?: P,
    config?: RequestConfig
  ) {
    try {
      const resp = await this.instance.post<R>(url, data, config);
      return resp.data as RequestResponse<R>;
    } catch (error) {
      handleRequestError({
        error,
        config,
        onLogout: () => {
          // TODO this.eventClient.emit afterLogout(false, code);
        },
        onMessage: () => {
          // TODO this.eventClient.emit message?.error(msg);
        }
      });
      // logErr(this.logger);
      return Promise.reject(error);
    }
  }

  fetchSyncChannel(data: BaseDataSyncDataChannelGet.Request, config?: RequestConfig) {
    return this.request<BaseDataSyncDataChannelGet.Response>(APIs.baseData.syncDataChannelGet, data, config);
  }

  fetchSyncDataInfo(data: BaseDataSyncDataInfoGet.Request, config?: RequestConfig) {
    return this.request<BaseDataSyncDataInfoGet.Response>(APIs.baseData.syncDataInfoGet, data, config);
  }

  fetchBondQuoteSyncData(data: BondQuoteSyncDataGet.Request, config?: RequestConfig) {
    return this.request<BondQuoteSyncDataGet.Response>(APIs.bondQuote.syncData.get, data, config);
  }

  fetchSpotPricingHint(data: DealNotifyUnreadGetAll.Request, config?: RequestConfig) {
    return this.request<DealNotifyUnreadGetAll.Response>(APIs.deal.notifyUnreadGetAll, data, config);
  }

  fetchUserList(data: UserList.Request, config?: RequestConfig) {
    return this.request<UserList.Response>(APIs.user.list, data, config);
  }

  fetchTraderSearch(data: TraderSearch.Request, config?: RequestConfig) {
    return this.request<TraderSearch.Response>(APIs.trader.search, data, config);
  }

  fetchBasicData(data: BaseDataBaseSyncDataScan.Request, protobuf: boolean, config?: RequestConfig) {
    const api = protobuf ? APIs.baseData.baseSyncDataScanPb : APIs.baseData.baseSyncDataScan;

    const requestConfig: RequestConfig = {
      ...config,
      responseType: protobuf ? 'arraybuffer' : 'json',
      transformResponse: protobuf ? getResponseTransformer(baseDataType, true) : undefined
    };

    return this.request<BaseDataBaseSyncDataScan.Response>(api, data, requestConfig);
  }

  fetchBusinessData(data: BaseDataSyncDataScan.Request, protobuf: boolean, config?: RequestConfig) {
    const api = protobuf ? APIs.baseData.syncDataScanPb : APIs.baseData.syncDataScan;
    const requestConfig: RequestConfig = {
      ...config,
      responseType: protobuf ? 'arraybuffer' : 'json',
      transformResponse: protobuf ? getResponseTransformer(businessDataType, true) : undefined
    };
    return this.request<BaseDataSyncDataScan.Response>(api, data, requestConfig);
  }

  // 由于业务原因，私信暂时走algo api
  updateQQPrivateChat(data: AlgoAbaseMessageFlowQqChatStream.Request, config?: RequestConfig) {
    return this.request<AlgoAbaseMessageFlowQqChatStream.Response>(APIs.algo.messageFlowQQChatStream, data, config);
  }

  updateQQGroupChat(data: ImQqGroupMsgAdd.Request, config?: RequestConfig) {
    return this.request<ImQqGroupMsgAdd.Response>(APIs.im.groupMsgAdd, data, config);
  }

  sendQQChatMsgCallback(data: BaseQqSendMsgCallback.Request, config?: RequestConfig) {
    return this.request<BaseQqSendMsgCallback.Response>(APIs.base.qqSendCallback, data, config);
  }

  fetchUserInfo(config?: RequestConfig) {
    return this.request<CheckLogin.Response>(APIs.auth.checkLogin, {}, config);
  }

  fetchBondByKeyMarket(data: BaseDataBondGetByKeyMarket.Request, config?: RequestConfig) {
    return this.request<BaseDataBondGetByKeyMarket.Response>(APIs.baseData.keyMarketGet, data, config);
  }
}
