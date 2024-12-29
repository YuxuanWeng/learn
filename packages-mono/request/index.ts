import { DefaultResponse } from '@fepkg/services/types/common';
import { RequestConfig, RequestParams, RequestResponse } from './types';

let innerRequest: {
  [key in 'get' | 'post']: <R extends DefaultResponse, P extends RequestParams = Record<string, unknown>>(
    url: string,
    params?: P | undefined,
    config?: RequestConfig | undefined
  ) => Promise<RequestResponse<R>>;
};

/** 注入 request */
const initRequest = (val: typeof innerRequest) => {
  innerRequest = val;
};

const getRequest = () => innerRequest;

export { initRequest, getRequest };
