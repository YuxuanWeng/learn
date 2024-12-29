import { parentPort } from 'worker_threads';
import { NetworkWorkerData, NetworkWorkerEvent, NetworkWorkerType } from '../types/worker';
import { ping } from '../utils/ping';

declare let self: ServiceWorkerGlobalScope;

/** 需要展示提示内容的最大失败次数 */
let maxShowOfflineTipFailures = 8;
/** 检测网络时 Ping 的超时时间 */
let pingTimeout = 300;
/** 重新检测网络时间间隔 */
let recheckTimeout = 800;

/** 通过 ping 验证的网络状态 */
let isReachable = true;
/** 上次通过 ping 验证的网络状态 */
let prevIsReachable = isReachable;
/** 能否进行检查 url 是否能够连接 */
let enabled = true;
/** 失败次数 */
let failures = 0;
/** 暂无网络提示的显示状态 */
let offlineTipVisible = false;
/** 上次暂无网络提示的显示状态 */
let prevOfflineTipVisible = offlineTipVisible;
let timer: ReturnType<typeof setTimeout>;

/**
 * 系统启动时调用该函数进行 ping，等待返回结果
 *  - 若结果为 true，重置失败次数，等待 0.8s 后再次进行 ping
 *  - 若结果为 false，直接再次 ping，统计失败次数
 *    如果失败次数大于 8 次，展示提示内容
 * 若用户再次尝试重连，再次调用该函数
 */

/** 检查 url 是否能够连接 */
const checkUrlIsReachable = async (url: string) => {
  if (!enabled) return;
  // 防止有非预期调用时还有延时任务在进行
  if (timer) clearTimeout(timer);

  prevIsReachable = isReachable;
  prevOfflineTipVisible = offlineTipVisible;

  const failureCallback = () => {
    failures += 1;
    checkUrlIsReachable(url);

    if (failures > maxShowOfflineTipFailures) {
      offlineTipVisible = true;
    }
  };

  try {
    const reachable = await ping(url, pingTimeout);
    isReachable = reachable;

    if (reachable) {
      failures = 0;
      offlineTipVisible = false;
    }
  } catch {
    isReachable = false;
  } finally {
    // 当前通过 ping 验证的网络状态与上次进行不一样，需要发消息告知 url 是否能够连接状态的变更
    if (prevIsReachable !== isReachable) {
      parentPort?.postMessage({
        type: NetworkWorkerType.UrlIsReachableChange,
        value: { isReachable }
      } as NetworkWorkerData);
    }

    // 当前暂无网络提示显示状态与上次进行不一样，需要发消息告知暂无网络提示显示状态的变更
    if (prevOfflineTipVisible !== offlineTipVisible) {
      parentPort?.postMessage({
        type: NetworkWorkerType.OfflineTipVisibleChange,
        value: { offlineTipVisible }
      } as NetworkWorkerData);
    }

    if (!isReachable) {
      // 至少延迟 200ms 再执行失败回调，避免过于频繁操作
      timer = setTimeout(() => failureCallback(), 200);
    } else {
      timer = setTimeout(() => checkUrlIsReachable(url), recheckTimeout);
    }
  }
};

self.addEventListener('message', (evt: NetworkWorkerEvent) => {
  const { type, value = {} } = evt.data;

  switch (type) {
    case NetworkWorkerType.StartUrlIsReachableCheck:
      enabled = true;

      if (value?.url) checkUrlIsReachable(value.url);
      break;
    case NetworkWorkerType.EndUrlIsReachableCheck:
      enabled = false;
      break;
    case NetworkWorkerType.SetMaxShowOfflineTipFailures:
      if (value?.maxShowOfflineTipFailures) maxShowOfflineTipFailures = value.maxShowOfflineTipFailures;
      break;
    case NetworkWorkerType.SetNetworkPingTimeout:
      if (value?.pingTimeout) pingTimeout = value.pingTimeout;
      break;
    case NetworkWorkerType.SetNetworkRecheckTimeout:
      if (value?.recheckTimeout) recheckTimeout = value.recheckTimeout;
      break;
    default:
      break;
  }
});

export default null;
