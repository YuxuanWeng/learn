import { DataController } from 'app/packages/data-controller';
import { EventClient } from 'app/packages/event-client';
import { DataLocalizationAction } from 'app/types/DataLocalization';

export type PostToRenderFn<T> = (action: DataLocalizationAction, local_request_trace_id: string, value: T) => void;

export interface RequestHandlerConfig {
  dataController: DataController;
  eventClient: EventClient;
  getPostToRenderFn: <T>(portId: number) => PostToRenderFn<T>;
}
