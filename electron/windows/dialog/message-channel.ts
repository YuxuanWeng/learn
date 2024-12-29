/**
 * 窗口消息通道管理
 * 主进程需要保存，在窗口关闭、崩溃处理时对通道进行关闭和清除
 */
import { DialogEvent, WindowChannelEventEnum } from 'app/types/IPCEvents';
import { AppMsgChannelModule } from 'app/types/dialog-v2';
import { WindowInstance } from 'app/types/window-type';
import { MessageChannelMain } from 'electron';
import { WindowManager } from '../models/windows-manager';
import { getDialogCache } from './context';

const channelMap = new Map<string, AppMsgChannelModule>();

export const getMsgChannel = (key: string) => channelMap.get(key);

/** 设置通道 */
export const setMsgChannel = (
  parent: WindowInstance,
  win: WindowInstance,
  context: object,
  instantMessaging = false
) => {
  const { port1, port2 } = new MessageChannelMain();
  const res = {
    parentWinName: parent.name,
    winName: win.name,
    instantMessaging
  };
  const p: AppMsgChannelModule = {
    parentPort: port1,
    winPort: port2,
    ...res
  };
  /**
   * 需要注意的是，被弹窗的窗口只有是通过窗口池生成的才会生效
   * 否则postMessage时窗口还没ready，会造成post的消息接收不到
   * 如果有不使用窗口池的场景，可以使用拦截 createWindow 的 onReadyShow 的方式
   * 或者使用 setTimeout 延迟（不推荐，虽然是通过preload.ts接收，时间相对可控）
   * 且，顺序不要颠倒，需要先发通知到子窗口，再通知父窗口
   */
  win.getContent()?.postMessage(WindowChannelEventEnum.ChildChannel, res, [port2]);
  parent
    .getContent()
    ?.postMessage(WindowChannelEventEnum.ParentChannel, { ...res, context, instantMessaging }, [port1]);
  channelMap.set(win.name, p);
  return p;
};

/** 窗口关闭后，清除相关通道 */
export const closeMsgChannel = (winName: string) => {
  const removeList: string[] = [];
  channelMap.forEach(channel => {
    if (channel.parentWinName === winName || channel.winName === winName) {
      channel.parentPort.close();
      channel.winPort.close();
      removeList.push(channel.winName);
    }
  });
  removeList.forEach(name => {
    channelMap.delete(name);
  });
};

export const closeMsgChannelTwoWay = (winName: string, parentName: string) => {
  const cm = channelMap.get(winName);
  if (cm != null && cm.parentWinName === parentName) {
    channelMap.delete(winName);
  }
};

/**
 * 设置父子窗口之间的信道
 * @param webContentId 子窗口webContentsId
 * @param instantMessaging 是否需要创建时立即发送消息
 * @returns boolean 是否创建成功
 */
export const resetDialogPort = (webContentId: number, instantMessaging = false) => {
  const winCache = getDialogCache(webContentId);
  // ..放开条件，即便没有 context 也建立信道，方便父子窗口互相传递信息
  if (winCache == null) return false;
  const { winName, context, parentId } = winCache;
  const win = WindowManager.get(winName);
  const parent = WindowManager.getByContentsId(parentId || 0);
  if (win?.object == null || parent == null) return false;
  /**
   * 每次重新构建信道前，都先使用 postMessage 发送context
   * postMessage 没有初始化时间，首次打开弹窗速度会提升100~150ms
   */
  win.getContent()?.postMessage(DialogEvent.UpdateDialogContext, context);
  closeMsgChannelTwoWay(win.name, parent.name);
  setMsgChannel(parent, win, context as object, instantMessaging);
  return true;
};

/** 子窗口就绪后重新获取一次存储的context，可防止因网速、机型问题导致的首次context更新不到正确值的问题 */
export const resendChildContextData = (webContentsId: number) => {
  const winCache = getDialogCache(webContentsId);
  if (winCache == null) return false;
  const { winName, context } = winCache;
  const win = WindowManager.get(winName);
  if (win?.object == null) return false;
  win.getContent()?.postMessage(DialogEvent.UpdateDialogContext, context);
  return true;
};
