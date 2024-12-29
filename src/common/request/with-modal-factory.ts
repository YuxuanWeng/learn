import { ModalUtilProps, ModalUtils } from '@fepkg/components/Modal';
import { RequestConfig, ResponseError } from '@fepkg/request/types';

export type RequestWithModalOptions<T = unknown> = {
  config?: RequestConfig;
  withModal?: boolean;
  modalProps?: ModalUtilProps;
  onSuccess?: (result?: T) => void;
  onError?: (error: ResponseError) => void;
};
type CommonRequestType<Request, Response> = (params: Request, config?: RequestConfig) => Promise<Response>;

export const requestWithModalFactory = <Request, Response>(requestFn: CommonRequestType<Request, Response>) => {
  return (params: Request, options?: RequestWithModalOptions<Response>) => {
    return new Promise<boolean>(resolve => {
      const { withModal, modalProps, onSuccess, onError, config } = options ?? {};

      const request = () =>
        requestFn(params, config)
          .then(onSuccess)
          .catch(onError)
          .finally(() => resolve(true));

      if (withModal) {
        ModalUtils.warning({
          ...modalProps,
          onOk: request,
          onCancel: () => resolve(false)
        });
      } else {
        request();
      }
    });
  };
};
