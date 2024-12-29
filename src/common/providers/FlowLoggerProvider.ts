import { useRef } from 'react';
import { useMemoizedFn } from 'ahooks';
import { createContainer } from 'unstated-next';
import { v4 as uuidv4 } from 'uuid';
import { logger } from '../utils/logger';

type InitialState = {
  /** log中trace字段名 */
  traceField?: string;
  /** traceId */
  traceId?: string;
  /** 流名称，一般用于针对某个操作流程的名字 */
  flowName?: string;
};

export enum TrackEventType {
  Enter = 'Enter',
  Submit = 'Submit',
  Success = 'Success'
}

const FlowLoggerContainer = createContainer((initialState?: InitialState) => {
  const defaultTraceId = useRef(uuidv4());

  const trackEvent = useMemoizedFn(
    (
      remark: TrackEventType,
      isAlwaysOpen = false,
      data?: { request?: object; response?: object; enterTime?: number }
    ) => {
      let successDuration: number | undefined;
      if (remark === TrackEventType.Success) successDuration = (Date.now() - (data?.enterTime || Date.now())) / 1000;

      const loggerParams: any = {
        remark,
        type: initialState?.flowName || 'defaultFlowName',
        [initialState?.traceField || 'traceId']: initialState?.traceId || defaultTraceId.current
      };

      if (remark === TrackEventType.Submit || remark === TrackEventType.Success) {
        loggerParams.params = data || {};
      }

      if (remark === TrackEventType.Success) {
        loggerParams.quoteDuration = successDuration;
        loggerParams.isAlwaysOpen = isAlwaysOpen;
      }

      logger.i(loggerParams, { immediate: true });
    }
  );

  const trackPoint = useMemoizedFn((remark?: string, keyword?: string, params = {}) => {
    logger.i(
      {
        remark,
        type: 'track-point',
        keyword,
        [initialState?.traceField || 'traceId']: initialState?.traceId || defaultTraceId.current,
        params
      },
      { immediate: true }
    );
  });

  return { trackPoint, trackEvent };
});

export const FlowLoggerProvider = FlowLoggerContainer.Provider;
export const useFlowLogger = FlowLoggerContainer.useContainer;
