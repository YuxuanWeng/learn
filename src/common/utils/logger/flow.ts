import { noNil } from '@fepkg/common/utils';
import { noop } from 'lodash-es';
import { LogFlow, LogFlowPhase } from '@/types/log';
import { logger } from '.';

export const getFlowLogger = <T>(flowName: string, immediate = false, params = {}) => {
  if (!flowName) return noop;

  // eslint-disable-next-line no-underscore-dangle
  let _enterTime = 0;

  return (phase: LogFlowPhase, successResult?: T) => {
    let duration = Date.now();

    if (phase === LogFlowPhase.Enter) _enterTime = duration;
    else duration -= _enterTime;

    const isDev = import.meta.env.DEV;
    if (isDev) console.log('🔖 flow logger', phase, successResult, phase === LogFlowPhase.Enter ? void 0 : duration);

    const loggerData = noNil<LogFlow>(
      {
        flowName,
        flowPhase: phase,
        flowData: successResult ? JSON.stringify(successResult) : void 0,
        flowDuration: phase === LogFlowPhase.Enter ? void 0 : duration,
        ...params
      },
      { keepFalse: true, keepZero: true }
    );
    if (!loggerData) return;

    logger.i(loggerData, { immediate });
  };
};
