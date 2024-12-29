import { CentrifugeClient } from '@fepkg/centrifuge-client';
import { ProductType, SyncDataType } from '@fepkg/services/types/enum';
import { DatabaseClient } from '../database-client';
import { EventClient } from '../event-client';
import { RequestClient } from '../request-client';

export type AbstractInitializeServiceConfig = {
  eventClient: EventClient;
  requestClient: RequestClient;
  databaseClient: DatabaseClient;
  syncDataTypeList: SyncDataType[];
  userProductType: ProductType[];
};

export type AbstractRealtimeServiceConfig = AbstractInitializeServiceConfig & {
  centrifugeClient: CentrifugeClient;
};

export type InitializeServiceConfig = Omit<AbstractInitializeServiceConfig, 'syncDataTypeList'>;

export type RealtimeServiceConfig = Omit<AbstractRealtimeServiceConfig, 'syncDataTypeList'>;
