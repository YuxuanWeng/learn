import { StatusCode } from '@fepkg/request/types';
import { context } from '@opentelemetry/api';
import { DataController } from 'app/packages/data-controller';
import { DataLocalizationAction, DataLocalizationRequest } from 'app/types/DataLocalization';
import { logError, logger } from '../utils';
import { PostToRenderFn, RequestHandlerConfig } from './types';

export abstract class BaseRequestHandler<Request, Response> {
  protected dataController: DataController;

  protected abstract action: DataLocalizationAction;

  protected abstract queryFn: (params: Request) => Response;

  protected getPostToRenderFn: (portId: number) => PostToRenderFn<Response>;

  constructor(config: RequestHandlerConfig) {
    this.dataController = config.dataController;
    this.getPostToRenderFn = config.getPostToRenderFn;
  }

  getAction() {
    return this.action;
  }

  execute(portId: number, data: DataLocalizationRequest<Request>) {
    const { action, value, local_request_trace_id } = data ?? {};
    try {
      logger.ctxInfo(context.active(), `[data-localization-handlers] execute start. data = ${JSON.stringify(data)}`);

      if (action !== this.action) {
        throw new Error(`EventHandler:${action} is invalid.`);
      }
      if (!value) throw new Error(`${action} params is undefined.`);

      const result = this.queryFn(value);

      logger.ctxInfo(context.active(), '[data-localization-handlers] execute done.');

      this.getPostToRenderFn(portId)(action, local_request_trace_id, result);
    } catch (error) {
      this.getPostToRenderFn(portId)(action, local_request_trace_id, {
        base_response: { code: StatusCode.InternalError, msg: (error as Error)?.message ?? '' }
      } as unknown as Response);
      logError(error);
    }
  }
}
