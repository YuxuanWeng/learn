import { CentrifugeClient, Status } from '@fepkg/centrifuge-client';
import { ProductType, SyncDataType } from '@fepkg/services/types/enum';
import { DatabaseClient } from '../database-client';
import { EventClient } from '../event-client';
import { RequestClient } from '../request-client';

export type DataInitClientConfig = {
  syncDataType: SyncDataType;
  requestClient: RequestClient;
  eventClient: EventClient;
  databaseClient: DatabaseClient;
  userProductType: ProductType[];
};

export type InitState = {
  /** 已接收的数量 */
  received: number;
  /** 同步状态 */
  status: Status;
  /** 锁，是否正在拉取数据 */
  isFetching: boolean;
  /** 请求下一页使用 */
  search_after: string | undefined;
  /** 初始化轮询timer */
  timer?: NodeJS.Timeout;
  /** 初始化轮询的超时次数 */
  fetchFailedCount: number;
  /** 初始化第一条报价ID */
  startId?: string;
  /** 初始化最后一条报价ID */
  endId?: string;
  /** 初始化时间 */
  startFetchDataTime?: number;
  /** 是否是第一次拉取初始化数据 */
  isFirstFetch: boolean;
};

export type DataSyncClientConfig = DataInitClientConfig & {
  centrifugeClient: CentrifugeClient;
};

export type QuoteRealtimeMessage = { quote_id: string; bond_key_market: string };

export type BondDetailRealtimeMessage = { key_market: string; ficc_id: string };

export type TraderRealtimeMessage = { trader_id: string };

export type InstRealtimeMessage = { inst_id: string };

export type UserRealtimeMessage = { user_id: string };

export type QuoteDraftMessageRealtimeMessage = { message_id: string };

export type QuoteDraftRealtimeMessage = { detail_id: string; message_id: string };

export type DealRealtimeMessage = { deal_id: string };
