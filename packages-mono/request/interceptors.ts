import { RequestConfig, RequestResponse, StatusCode } from '@fepkg/request/types';
import { newSpan } from '@fepkg/trace';
import { Span, SpanStatusCode, context, propagation, trace } from '@opentelemetry/api';
import type { AxiosError, AxiosResponse } from 'axios';

export const logStartInterceptor = (config: RequestConfig) => {
  config.logStartTime = performance.now();
  return config;
};

export const traceStartInterceptor = async (config: RequestConfig) => {
  if (config.skipTrace) {
    return config;
  }
  if (!config.traceCtx) config.traceCtx = context.active();
  const span = newSpan('http_request', { path: config.url }, config.traceCtx);
  const traceCarrier = {};
  propagation.inject(trace.setSpan(config.traceCtx, span), traceCarrier);
  config.headers = {
    ...config.headers,
    ...traceCarrier
  };
  config.span = span;

  if (!config?.signal) return config;
  config.onCanceled = () => {
    if (config?.onCanceled) config?.signal?.removeEventListener('abort', config.onCanceled);
    if (!config?.span) return;
    config.span.addEvent('log', { log: 'request canceled' });
    config.span.end();
  };
  config.signal?.addEventListener('abort', config?.onCanceled);

  return config;
};

export const getResponseFulfilledInterceptor =
  (callback?: (response: AxiosResponse<RequestResponse>) => void) => (response: AxiosResponse<RequestResponse>) => {
    const { status, data } = response;

    if (status === 200) {
      if (data?.base_response?.code !== StatusCode.Success) {
        return Promise.reject(response);
      }
      callback?.(response);
      return Promise.resolve(response);
    }

    return Promise.reject(response);
  };

export const getResponseRejectedInterceptor = (callback?: (err: AxiosError<RequestResponse>) => void) => {
  return (err: AxiosError<RequestResponse>) => {
    if (err.response?.status === 401) {
      callback?.(err);
    }
    return Promise.reject(err);
  };
};

const spanFromConfig = (config: RequestConfig): Span | undefined => {
  if (config?.span) return config.span;
  return undefined;
};

export const responseTraceFulfilledInterceptor = (response: AxiosResponse<RequestResponse>) => {
  const config = response.config as RequestConfig;
  if (config?.onCanceled && config?.signal) config.signal.removeEventListener('abort', config.onCanceled);

  const span = spanFromConfig(config);
  if (span && span?.isRecording()) {
    span.addEvent('log', { log: `success request, path=${response.config.url}` });
    span.setStatus({ code: SpanStatusCode.OK });
    span.end();
  }
  return Promise.resolve(response);
};

export const responseTraceRejectedInterceptor = (err: AxiosError<RequestResponse> & AxiosResponse<RequestResponse>) => {
  const config = err.config as RequestConfig;
  if (config?.onCanceled && config?.signal) config.signal.removeEventListener('abort', config.onCanceled);

  const span = spanFromConfig(config);
  if (span && span?.isRecording()) {
    span.addEvent('log', {
      log:
        `failed request, http_status=${err.status}, ` +
        `status_code=${err.data?.base_response?.code}, status_msg=${err.data?.base_response?.msg}`
    });
    span.setStatus({ code: SpanStatusCode.ERROR });
    span.end();
  }
  return Promise.reject(err);
};
