import { useMemoizedFn } from 'ahooks';
import { RETRY_DELAY, RETRY_TIMES } from './constants';
import { CentrifugeConnect } from './type';

/**
 * @param fn 需要尝试运行的函数
 * @param maxRetries 最大尝试次数
 * @param delay 每次重试的间隔时间，单位ms
 * @description 立即运行fn函数，如果失败则每隔delay毫秒后重试，共重试maxRetries次
 * */
function retry<T>(fn: () => Promise<T>, maxRetries: number, delay: number) {
  return new Promise<T>((resolve, reject) => {
    const attempt = async () => {
      try {
        const result = await fn();
        resolve(result);
      } catch (error) {
        if (maxRetries > 0) {
          setTimeout(() => {
            attempt();
          }, delay);
          maxRetries--;
        } else {
          reject(error);
        }
      }
    };

    attempt();
  });
}

export const useCentrifugeConnect = ({ centrifugeInstance, setCentrifugeState, logger }: CentrifugeConnect) => {
  // 处理连接成功的回调
  const handleConnectSuccess = useMemoizedFn(() => {
    setCentrifugeState('success');
  });

  // 处理连接失败的回调
  const handleConnectError = useMemoizedFn((error: unknown) => {
    setCentrifugeState('error');
    logger?.e({
      keyword: `centrifuge connect failed more than ${RETRY_TIMES} times, no more try to reconnect！`,
      error
    });
  });

  /** 连接centrifuge */
  const connect = async () => {
    if (!centrifugeInstance.current) {
      throw new Error('centrifugeClient is undefined');
    }
    await centrifugeInstance.current?.connect();
  };
  /** 连接centrifuge伴随重试 */
  const centrifugeConnect = useMemoizedFn(async () => {
    // 立即运行connect函数，如果失败则每隔RETRY_DELAY毫秒后重试，共重试RETRY_TIMES次
    await retry(connect, RETRY_TIMES, RETRY_DELAY).then(handleConnectSuccess).catch(handleConnectError);
  });

  /** 断开连接centrifuge */
  const centrifugeDisconnect = useMemoizedFn(() => {
    return centrifugeInstance.current?.disconnect();
  });

  return {
    /** 连接centrifuge伴随重试 */
    centrifugeConnect,
    /** 断开连接centrifuge */
    centrifugeDisconnect
  };
};
