import { sleep } from '@fepkg/common/utils';
import { CreateDialogParams } from 'app/windows/models/base';
import { IpcRendererEvent, contextBridge, ipcRenderer } from 'electron';
import os from 'os';
import { format } from 'util';
import { v4 } from 'uuid';
import { IMHelperMsgSendResponse, IMHelperQQMsgForSend } from './packages/im-helper-core/types';
import {
  DataLocalizationAction,
  DataLocalizationEvent,
  DataLocalizationRequestCommon,
  DataLocalizationResponse
} from './types/DataLocalization';
import IPCEventEnum, {
  AutoUpdateEventEnum,
  IMHelperEventEnum,
  UtilEventEnum,
  WindowChannelEventEnum
} from './types/IPCEvents';
import BroadcastEventEnum from './types/broad-cast';
import { DialogWindowResponse } from './types/dialog-v2';

/** 这里不能使用omsApp的appConfig，preload与主进程是隔离的 */
import { getAppConfig } from './utils/get-app-config';
import { buildBroadcastChannel } from './windows/listeners/broadcast-listener';

const appConfig = getAppConfig();

const api = {
  sendMessage(channel: string, ...args: unknown[]) {
    ipcRenderer.send(channel, ...args);
  },
  /**
   * 与主进程通信，并【同步】等待返回结果，注意会造成阻塞，非必要情况勿用
   * 需要通信后等待结果，尽量使用异步的invoke方法
   * @param channel 方法名称，string
   * @param args 参数列表，unknown[]
   * @returns 主进程返回结果，any
   */
  sendSync(channel: string, ...args: unknown[]) {
    return ipcRenderer.sendSync(channel, ...args);
  },
  /**
   * 与主进程通信，并【异步】等待结果，同Promise，使用 then 接受返回值
   * @param channel 方法名称，string
   * @param args 参数，any
   * @returns 主进程返回结果，any
   */
  invoke<R = any, P = unknown>(channel: string, ...args: P[]) {
    return ipcRenderer.invoke(channel, ...args) as Promise<R>;
  },
  /**
   Here function for AppBar
   */
  minimize: () => {
    ipcRenderer.send(IPCEventEnum.Minimize);
  },
  maximize: () => {
    ipcRenderer.send(IPCEventEnum.Maximize);
  },
  close: () => {
    ipcRenderer.send(IPCEventEnum.Close);
  },
  copy: (text: string) => {
    ipcRenderer.send(UtilEventEnum.Copy, text);
  },
  // 对 on、off 进行改造，原模板中的写法将导致只能on，不能成功off掉
  /**
   * 接收某个信道类型（channel）发来的消息
   * 返回值为事件卸载函数
   * @param channel 信道类型
   * @param listener 接收回调函数
   * @returns 用于卸载的函数引用（相当于off）
   */
  on<P = any>(channel: string, listener: (...args: (P | undefined)[]) => void) {
    const subscription = (_event: IpcRendererEvent, ...args: (P | undefined)[]) => listener(...args);
    ipcRenderer.addListener(channel, subscription);

    return () => ipcRenderer.removeListener(channel, subscription);
  },
  remove: (channel: string) => {
    ipcRenderer.removeAllListeners(channel);
  },
  once<P = any>(channel: string, listener: (...args: (P | undefined)[]) => void) {
    ipcRenderer.once(channel, (_event: IpcRendererEvent, ...args: (P | undefined)[]) => listener(...args));
  },
  // ..先注释掉off，以免再次出现使用不当导致的泄漏问题
  /**
   * 根据回调函数引用，删除某信道上的某个回调
   * 注意：off暂时不能取消掉单独的回调；
   * 需要用 on 的返回值来进行单个回调引用的卸载、
   * 或者直接用 remove 删除某信道的所有回调；
   * @param channel 信道类型
   * @param func 函数引用
   */
  // off(channel: string, func: (...args: any[]) => void) {
  //   ipcRenderer.off(channel, func);
  // },
  checkUpdate: (showError = false) => {
    return ipcRenderer.invoke(AutoUpdateEventEnum.CheckUpdate, showError);
  },

  getMemoInfo: async () => {
    const eventNames = ipcRenderer.eventNames();
    const eventMap = new Map<string, number>();
    eventNames?.forEach(name => {
      const count = ipcRenderer.listenerCount(name);
      eventMap.set(name.toString(), count);
    });

    const memoInfo = await process.getProcessMemoryInfo();
    return { memoInfo, heap: process.getHeapStatistics(), eventMap };
  }
};

const system = {
  /**
   * 判断是否为Mac环境
   * 另一种渲染进程判断的方式：
   * /Mac/.test(navigator.appVersion) // true表示为Mac;
   * 或：/AppleWebKit/.test(navigator.appVersion)
   * 暂时采用preload暴露的方式，
   */
  isMac: process.platform === 'darwin',
  isWin7: process.platform !== 'darwin' && os.release().startsWith('6.1')
};

let windowContextReady = false;
const monitorWindowLoadedStatus = (resolve: (value: unknown) => void) => {
  if (windowContextReady) {
    resolve(true);
    return;
  }
  setTimeout(() => monitorWindowLoadedStatus(resolve), 100);
};
const windowLoaded = new Promise(resolve => {
  monitorWindowLoadedStatus(resolve);
});

const dialogWindow = {
  /**
   * @description electron弹窗
   * @param param Omit<CreateDialogParams, 'category'>
   * 前端采用的嵌套路由的方式
   * 示例使用可以参考 ./src/routes/index.tsx/ path=/dialog/shortcut
   * 与electron的回调交互在 ./src/pages/dialog/index.tsx 中
   * 通过 useOutletContext 可以拿到母版页中的 title设置(useState)、确认回调、取消回调
   * 示例调用在：./src/pages/home/index.tsx openDialog函数
   * @author zsl
   * @date 2022-07-12 13:53:00
   * @lastModifiedBy zsl
   * @lastModifiedTime  2022-07-12 13:53:00
   */
  openDialogWindow(param: Omit<CreateDialogParams, 'category'>): Promise<DialogWindowResponse> {
    return ipcRenderer.invoke(IPCEventEnum.CreateDialogWindow, param);
  },
  /** 窗口就绪后的通知，windowContextReady后才会给子窗口发送port */
  setDialogContextReady() {
    windowContextReady = true;
  }
};

/**
 * 用于跨渲染进程间的消息广播
 */
const Broadcast = {
  /**
   * 触发一条广播
   * 使用方式：
   * const { emit } = window.Broadcast;
   * <button onClick={() => emit(BroadcastChannelEnum.delItems, Date.now(), 11, 2)}>发送广播</button>
   */
  emit(channel: string, ...args: unknown[]) {
    ipcRenderer.send(BroadcastEventEnum.emit, channel, ...args);
  },
  /**
   * 接收来自其他渲染进程的消息
   * 卸载（防止内存泄漏）的两种方式：
   * 方式一：
   * const { on, remove } = window.Broadcast;
   * useEffect(() => {
        const off = on(BroadcastChannelEnum.delItems, (timer: number, p1: number, p2: number) => {
          console.log('客官，来啦1~', timer, p1, p2);
        });
      return () => off();
    }, []);
   * 方式二：
    const { on, remove } = window.Broadcast;
    * useEffect(() => {
        on(BroadcastChannelEnum.delItems, (timer: number, p1: number, p2: number) => {
          console.log('客官，来啦~', timer, p1, p2);
        });
        return () => remove(BroadcastChannelEnum.delItems);
      }, []);
   * @param channel 消息类型
   * @param func 回调
   * @returns 用于注销单条回调的函数
   */
  on(channel: string, func: (...args: any[]) => void) {
    const subscription = (_event: IpcRendererEvent, args: unknown[]) => func(...args);
    const nChannel = buildBroadcastChannel(channel);
    ipcRenderer.addListener(nChannel, subscription);

    /** 这里不能使用es6匿名函数的简写，否则前端接收到的会有返回值类型，就不能在 useEffect的回调中直接使用 */
    return () => {
      ipcRenderer.removeListener(nChannel, subscription);
    };
  },
  /**
   * 同 on，但是只触发一次
   * @param channel 消息类型
   * @param func 回调
   */
  once(channel: string, func: (...args: unknown[]) => void) {
    const nChannel = buildBroadcastChannel(channel);
    ipcRenderer.once(nChannel, (_event, args) => func(...args));
  },
  /**
   * 清空某消息类型下的所有回调
   * @param channel 消息类型
   */
  remove: (channel: string) => {
    const nChannel = buildBroadcastChannel(channel);
    ipcRenderer.removeAllListeners(nChannel);
  }
};

interface UtilityProcessType {
  port?: MessagePort;
  portId?: string;
  portListeners: ((val: boolean) => void)[];
  addPortEventListener: (callback: (val: boolean) => void) => void;
  removePortEventListener: (callback: (val: boolean) => void) => void;
  dispatchPortEvent: (val: boolean) => void;
  newPort: () => void;
  closePort: () => void;
  postMessage: <Request>(messages: DataLocalizationRequestCommon<Request>) => void;
  invoke: <Request, Response>(
    messages: DataLocalizationRequestCommon<Request>
  ) => Promise<DataLocalizationResponse<Response>>;
  on: <Response>(
    action: DataLocalizationAction,
    func: (data?: DataLocalizationResponse<Response>) => void
  ) => () => void;
  isPortAvailable: () => boolean;
}
const UtilityProcess: UtilityProcessType = {
  isPortAvailable: () => {
    return !!UtilityProcess.port && !!UtilityProcess.portId;
  },
  portListeners: [],
  /**
   * 注册PortEventListener
   */
  addPortEventListener: (callback: (val: boolean) => void) => {
    UtilityProcess.portListeners.push(callback);
  },
  removePortEventListener: (callback: (val: boolean) => void) => {
    let index = UtilityProcess.portListeners.indexOf(callback);
    while (index !== -1) {
      UtilityProcess.portListeners.splice(index, 1);
      index = UtilityProcess.portListeners.indexOf(callback);
    }
  },
  /**
   * 触发已注册的PortEventListener
   */
  dispatchPortEvent: (val: boolean) => {
    // TODO: 有待观察
    for (const callback of UtilityProcess.portListeners) {
      // TODO: 有待观察
      callback?.call(this, val);
    }
  },

  /**
   * 向主进程listener发起newPort事件，并监听主进程传回来的port
   */
  newPort: () => {
    ipcRenderer.on(WindowChannelEventEnum.AddUtilityProcessPort, (event: Electron.IpcRendererEvent) => {
      [UtilityProcess.port] = event.ports;
      UtilityProcess.port?.start();
      UtilityProcess.dispatchPortEvent(true);
    });

    ipcRenderer.invoke(DataLocalizationEvent.NewPort).then(portId => {
      UtilityProcess.portId = portId;
    });
  },
  /**
   * 向主进程listener发起closePort事件，并监听主进程传回来的port
   */
  closePort: () => {
    UtilityProcess.port?.close();
    UtilityProcess.dispatchPortEvent(false);
    delete UtilityProcess.port;
    ipcRenderer.invoke(DataLocalizationEvent.RemovePort, UtilityProcess.portId);
  },
  /**
   * 渲染进程向UtilityProcess发起消息
   * @param messages 消息类型
   */
  invoke: async <Request, Response>(messages: DataLocalizationRequestCommon<Request>) => {
    const local_request_trace_id = v4();
    // 若无port则等待200ms后再次尝试，目前发现渲染进程新建并mount后的时机立即调用时，port会有概率未创建好
    if (!UtilityProcess.port) {
      await sleep(200);
      if (!UtilityProcess.port) {
        return Promise.reject(new Error("utilityProcess'port is undefined!"));
      }
    }
    return new Promise<DataLocalizationResponse<Response>>((resolve, reject) => {
      let timer: NodeJS.Timeout;

      const listener = (evt: MessageEvent<DataLocalizationResponse<Response>>) => {
        if (local_request_trace_id === evt?.data?.local_request_trace_id) {
          UtilityProcess.port?.removeEventListener('message', listener);
          clearTimeout(timer);
          resolve(evt?.data);
        }
      };

      // 本地数据平均相应时长为30ms内，超过1000ms则视为服务无响应
      timer = setTimeout(() => {
        UtilityProcess.port?.removeEventListener('message', listener);
        reject(
          new Error(
            `utilityProcess'port post message is timeout! The messages is ${format(messages)}.
            local_request_trace_id:${local_request_trace_id}`
          )
        );
      }, 30000); // windows机器下启动后第一次出现过6-8s的时间

      UtilityProcess.port?.addEventListener('message', listener);
      UtilityProcess.port?.postMessage({ ...messages, local_request_trace_id });
    });
  },
  postMessage: <Request>(messages: DataLocalizationRequestCommon<Request>) => {
    const local_request_trace_id = v4();
    UtilityProcess.port?.postMessage({ ...messages, local_request_trace_id });
  },
  on: <Response>(action: DataLocalizationAction, func: (data?: DataLocalizationResponse<Response>) => void) => {
    const subscription = (event: MessageEvent<DataLocalizationResponse<Response>>) => {
      if (action === event?.data?.action) {
        func(event.data);
      }
    };
    const remove = () => {
      UtilityProcess.port?.removeEventListener('message', subscription);
    };
    UtilityProcess.port?.addEventListener('message', subscription);
    return remove;
  }
};

const imHelperBridge = {
  sendQQ: (messages: IMHelperQQMsgForSend[]) => {
    return api.invoke<IMHelperMsgSendResponse>(IMHelperEventEnum.SendQQ, messages);
  }
};

/** 当前为父窗口 */
ipcRenderer.on(WindowChannelEventEnum.ParentChannel, async (event: Electron.IpcRendererEvent, msg) => {
  await windowLoaded;
  window.postMessage(
    {
      type: WindowChannelEventEnum.ParentChannelToBrowser,
      msg
    },
    '*',
    event.ports
  );
});
/** 当前为子窗口 */
ipcRenderer.on(WindowChannelEventEnum.ChildChannel, async (event: Electron.IpcRendererEvent, msg) => {
  await windowLoaded;
  window.postMessage(
    {
      type: WindowChannelEventEnum.ChildChannelToBrowser,
      msg
    },
    '*',
    event.ports
  );
});

contextBridge.exposeInMainWorld('Main', api);

contextBridge.exposeInMainWorld('System', system);

contextBridge.exposeInMainWorld('Dialog', dialogWindow);

contextBridge.exposeInMainWorld('Broadcast', Broadcast);

contextBridge.exposeInMainWorld('UtilityProcess', UtilityProcess);

contextBridge.exposeInMainWorld('appConfig', appConfig);

contextBridge.exposeInMainWorld('IMHelperBridge', imHelperBridge);

declare global {
  interface Window {
    Main: typeof api;
    System: typeof system;
    Dialog: typeof dialogWindow;
    appConfig: typeof appConfig;
    Broadcast: typeof Broadcast;
    IMHelperBridge: typeof imHelperBridge;
    Date: Date & { offset: number };
    UtilityProcess: UtilityProcessType;
  }
}

export default null;
