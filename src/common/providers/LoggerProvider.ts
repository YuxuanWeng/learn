import { useRef } from 'react';
import { TraceName } from '@fepkg/business/constants/trace-map';
import { withNewSpan } from '@fepkg/trace';
import { Context, context } from '@opentelemetry/api';
import { useMemoizedFn } from 'ahooks';
import { createContainer } from 'unstated-next';

const LoggerContainer = createContainer(() => {
  const logContext = useRef<Map<TraceName, Context>>(new Map<TraceName, Context>());

  const getLogContext = (spanName: TraceName) => logContext.current.get(spanName) || context.active();

  const wrapperSubmit = useMemoizedFn(async <T>(spanName: TraceName, fn: () => Promise<T>) => {
    const response = await withNewSpan<unknown[], () => Promise<T>>(spanName, async () => {
      logContext.current.set(spanName, context.active());
      const res = await fn();
      return res as T;
    });
    return response;
  });

  return {
    /** 获取日志能力的ctx */
    getLogContext,
    wrapperSubmit
  };
});

export const LoggerProvider = LoggerContainer.Provider;
export const useLogger = LoggerContainer.useContainer;
