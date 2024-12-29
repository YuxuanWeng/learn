import { IpcMainEvent, ipcMain } from 'electron';
import BroadcastEventEnum from '../../types/broad-cast';
import { WindowManager } from '../models/windows-manager';

/** 给所有已打开窗口发送通知 */
export const postMessageAllWindow = (channel: string, args: any) => {
  const allWindows = WindowManager.getAll();
  allWindows.forEach(win => {
    win.getContent()?.postMessage(channel, args);
  });
};

/**
 * 生成一个固定规则的广播信道类型
 * @param channel 前端传递的信道类型
 * @returns 生成后的信道类型
 */
export const buildBroadcastChannel = (channel: string) => `${BroadcastEventEnum.on}-${channel}`;

const emitBroadcast = (_event: IpcMainEvent, channel: string, ...args: any[]) => {
  const nChannel = buildBroadcastChannel(channel);
  // console.log('发出广播:', channel, args, nChannel);
  // const allWindows = windowManager.getAll();
  // allWindows.forEach(win => {
  //   win.content()?.postMessage(nChannel, args);
  // });
  postMessageAllWindow(nChannel, args);
};

const start = () => {
  ipcMain.on(BroadcastEventEnum.emit, emitBroadcast);
};

const end = () => {
  ipcMain.off(BroadcastEventEnum.emit, emitBroadcast);
};

/**
 * 与渲染进程-tabs相关的事件处理
 */
export default () => [start, end];
