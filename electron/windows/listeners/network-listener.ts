import { ABRuleEventEnum, NetworkEventEnum } from 'app/types/IPCEvents';
import { NetworkWorkerData, NetworkWorkerType } from 'app/types/worker';
import { isDevOrTest } from 'app/utils/electron-is-dev';
import { createWebWorker } from 'app/utils/worker';
import { IpcMainEvent, IpcMainInvokeEvent, ipcMain } from 'electron';
import { postMessageAllWindow } from './broadcast-listener';

let worker: Worker | undefined;

let networkIsReachable = true;
/** 获取当前api网络状态 */
export const getNetworkIsReachable = () => networkIsReachable;

let apiBaseUrl = '';
/** 获取api-url */
const getApiUrl = () => {
  if (apiBaseUrl) return apiBaseUrl;
  if (isDevOrTest()) return 'api-dev.zoople.cn:80';
  return 'https://api-sh-uat.zoople.cn';
};

const startCheckUrlIsReachable = (_evt: IpcMainEvent, url = getApiUrl()) => {
  apiBaseUrl = url;

  worker?.postMessage({
    type: NetworkWorkerType.StartUrlIsReachableCheck,
    value: { url }
  } as NetworkWorkerData);
};

export const stopCheckUrlIsReachable = () => {
  worker?.postMessage({ type: NetworkWorkerType.EndUrlIsReachableCheck } as NetworkWorkerData);
};

const setMaxShowOfflineTipFailures = (_evt: IpcMainInvokeEvent, maxShowOfflineTipFailures: number) => {
  worker?.postMessage({
    type: NetworkWorkerType.SetMaxShowOfflineTipFailures,
    value: { maxShowOfflineTipFailures }
  } as NetworkWorkerData);
};

const setNetworkPingTimeout = (_evt: IpcMainInvokeEvent, pingTimeout: number) => {
  worker?.postMessage({
    type: NetworkWorkerType.SetNetworkPingTimeout,
    value: { pingTimeout }
  } as NetworkWorkerData);
};

const setNetworkRecheckTimeout = (_evt: IpcMainInvokeEvent, recheckTimeout: number) => {
  worker?.postMessage({
    type: NetworkWorkerType.SetNetworkRecheckTimeout,
    value: { recheckTimeout }
  } as NetworkWorkerData);
};

const start = () => {
  ipcMain.on(NetworkEventEnum.StartCheckUrlIsReachable, startCheckUrlIsReachable);
  ipcMain.on(NetworkEventEnum.StopCheckUrlIsReachable, stopCheckUrlIsReachable);

  ipcMain.handle(ABRuleEventEnum.SetMaxShowOfflineTipFailuresRule, setMaxShowOfflineTipFailures);
  ipcMain.handle(ABRuleEventEnum.SetNetworkPingTimeoutRule, setNetworkPingTimeout);
  ipcMain.handle(ABRuleEventEnum.SetNetworkRecheckTimeoutRule, setNetworkRecheckTimeout);

  // 实例化 worker
  if (!worker) {
    worker = createWebWorker(__dirname, 'network-worker.js');
  }

  worker?.addEventListener('message', (evt: MessageEvent<NetworkWorkerData>) => {
    const { type, value = {} } = evt.data;
    const isReachable = !!value?.isReachable;
    const offlineTipVisible = !!value?.offlineTipVisible;

    switch (type) {
      case NetworkWorkerType.UrlIsReachableChange:
        networkIsReachable = isReachable;
        postMessageAllWindow(NetworkEventEnum.NetworkUrlIsReachable, isReachable);
        break;
      case NetworkWorkerType.OfflineTipVisibleChange:
        postMessageAllWindow(NetworkEventEnum.OfflineTipVisibleChange, offlineTipVisible);
        break;
      default:
        break;
    }
  });
};

const end = () => {
  ipcMain.off(NetworkEventEnum.StartCheckUrlIsReachable, startCheckUrlIsReachable);
  ipcMain.off(NetworkEventEnum.StopCheckUrlIsReachable, stopCheckUrlIsReachable);

  ipcMain.off(ABRuleEventEnum.SetMaxShowOfflineTipFailuresRule, setMaxShowOfflineTipFailures);
  ipcMain.off(ABRuleEventEnum.SetNetworkPingTimeoutRule, setNetworkPingTimeout);
  ipcMain.off(ABRuleEventEnum.SetNetworkRecheckTimeoutRule, setNetworkRecheckTimeout);

  // 关闭 worker 定时任务
  stopCheckUrlIsReachable();
  // 关闭 worker
  worker?.terminate();
};

/** 网络相关时间监听 */
export default () => [start, end];
