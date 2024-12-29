import { QueryClient } from '@tanstack/react-query';
import axios from 'axios';

// 尽量不重试原则
const retry = (failureCount: number, error: unknown) => {
  // 只有axios错误才重试, 最多重试三次
  if (axios.isAxiosError(error) && failureCount < 3) {
    return true;
  }
  return false;
};

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      networkMode: 'always',
      cacheTime: 5 * 60 * 1000,
      retry
    },
    mutations: {
      networkMode: 'always',
      retry
    }
  },
  logger: {
    log() {},
    warn(message) {
      // TODO
      // metricsFunc('warn', message);
    },
    error(message) {
      // TODO
      // metricsFunc('error', message);
    }
  }
});
