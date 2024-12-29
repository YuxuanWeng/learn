import { BaseResponse } from '@fepkg/services/types/common';
import { EventMessage } from 'app/packages/event-client/types';
import { DataLocalizationRequest } from './Request';

export type NotifiedObserverIdList<T> = [string, T];

export enum DataUpdateEventMessageTypeEnum {
  QuoteDraftMessageIncrement = 'QuoteDraftMessageIncrement',
  Replacement = 'Replacement'
}
export type DataUpdateEventMessageResponse<T = Record<string, unknown>> = EventMessage & {
  type?: DataUpdateEventMessageTypeEnum;
  /** 成功 update 的债券 key market 列表，若为 [] 则代表全库更新 */
  notified_list?: NotifiedObserverIdList<T>[];
};

export type DataLocalizationResponseCommon<T = Record<string, unknown>> = T & {
  base_response?: BaseResponse;
};

export type DataLocalizationResponse<T = Record<string, unknown>> = {
  action: string;
  local_request_trace_id: string;
  local_request_response_time?: number;
  value?: DataLocalizationResponseCommon<T>;
};

/** 数据处理流程 UtilityProcess 相关消息事件类型 */
export interface DataLocalizationUtilityProcessEvent extends Electron.MessageEvent {
  data: DataLocalizationRequest;
}
