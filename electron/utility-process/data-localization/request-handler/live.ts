import { DataLocalizationRequest } from 'app/types/DataLocalization';
import { BaseRequestHandler } from './base';
import { BaseObserver } from './data-observer/base';

export abstract class LiveRequestHandler<Request, Response> extends BaseRequestHandler<Request, Response> {
  protected abstract dataObserver: BaseObserver<Request, Response>;

  abstract removeAllObservers(): void;

  abstract liveExecute(portId: number, data: DataLocalizationRequest<Request>, portIds: number[]): void;
}
