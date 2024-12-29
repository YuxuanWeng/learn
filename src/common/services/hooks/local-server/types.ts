import { LocalServerRealtimeScene } from '@fepkg/services/types/bds-enum';

export type LiveQueryConfig<Request> = {
  interval?: number;
  enabled?: boolean;
  params?: Request;
  onSuccess?: () => void;
};

export type LocalServerLiveQueryProps<Request, Response, CacheType> = {
  api: string;
  scene: LocalServerRealtimeScene;
  interval?: number;
  enabled?: boolean;
  params?: Request;
  select?: (data?: Response) => CacheType;
  onSuccess?: () => void;
};

export enum LocalServerApi {
  OptimalQuoteByKeyMarket = 'optimal-quote-get-by-key-market',
  QuoteById = 'quote-get-by-id',
  QuoteByKeyMarket = 'quote-get-by-key-market',
  DealRecordList = 'deal-record-list'
}
