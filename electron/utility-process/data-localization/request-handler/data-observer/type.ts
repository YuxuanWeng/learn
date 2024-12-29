import { DataController } from 'app/packages/data-controller';
import { EventClient } from 'app/packages/event-client';
import { PostToRenderFn } from '../types';

export interface ObserverClassBaseMethods {
  getObserverMapById(id: unknown): unknown;
  setObserverMapById(id: unknown, value?: unknown): void;
  removeObserverMap(id: unknown): void;
}

export interface DataObserverConfig {
  eventClient: EventClient;
  dataController: DataController;
  getPostToRenderFn: <T>(portId: number) => PostToRenderFn<T>;
}
