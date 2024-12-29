import { BaseWindowProps } from 'app/windows/models/base';
import { IpcMainInvokeEvent } from 'electron';
import { LogEventEnum } from '../types/IPCEvents';
import { MainLogResponse } from '../types/main-log';
import { WindowInstance } from '../types/window-type';
import { WindowName } from '../types/window-v2';
import { WindowManager } from '../windows/models/windows-manager';

const mainLogList: MainLogResponse[] = [];
/**
 * 设置主进程日志队列
 * @param res 消息
 * @param maxLength 最大长度
 */
const setMainLogItems = (res: MainLogResponse, maxLength = 100) => {
  if (mainLogList.length >= maxLength) {
    mainLogList.splice(0, mainLogList.length - maxLength);
  }
  mainLogList.push(res);
};
const clearMainLogItems = () => {
  mainLogList.length = 0;
};

/** 个别窗口读取 html 文件失败后，会跳转到错误导航页，可从错误导航页接收日志 */
let crashPrintWindowName = '';

const supportedWindowNames: string[] = [WindowName.MainLogPage, WindowName.Login];
const consumerWindowNames: string[] = [WindowName.MainLogPage];

const getPrintLogWindow = () => {
  const supportedWindow = supportedWindowNames.map(name => WindowManager.get(name)).find(win => win?.isAlive());
  const crashPrintWindow = WindowManager.get(crashPrintWindowName);
  return supportedWindow || crashPrintWindow || null;
};

const handlePrint = (win: WindowInstance | null, res: MainLogResponse[]) => {
  if (!win?.isAlive()) {
    console.log(...res);
    return;
  }
  win?.getContent()?.postMessage(LogEventEnum.PrintMainLog, res);
};

/**
 * 主进程日志打印；
 * 如果当前存在【主进程日志页】窗口，则优先通过窗口进行打印，便于打包环境调试使用；
 * @param args 参数列表：逗号分割，但只能是严格的基础类型或对象，不能出现函数；
 * @returns void
 */
export const printLog = (...args: unknown[]) => {
  const curWindow = getPrintLogWindow();
  const res: MainLogResponse = {
    timestamp: Date.now(),
    msg: args
  };
  /** 日志队列的消费窗口不存在时，就往队列中添加 */
  const consumerWindow = consumerWindowNames.map(name => WindowManager.get(name)).find(win => win?.isAlive());
  if (!consumerWindow?.isAlive()) {
    setMainLogItems(res);
    return;
  }
  handlePrint(curWindow, [res]);
};

/**
 * 打印窗口位置日志；
 * 如果当前存在【主进程日志页】窗口，则优先通过窗口进行打印，便于打包环境调试使用；
 * @param label 日志的标签
 * @param baseWindowProps window的参数
 * @returns
 */
export const printWindowLayout = (label: string, baseWindowProps: BaseWindowProps) => {
  printLog(
    label,
    baseWindowProps.name,
    baseWindowProps.options?.x,
    baseWindowProps.options?.y,
    baseWindowProps.options?.width,
    baseWindowProps.options?.height,
    baseWindowProps.options?.minWidth,
    baseWindowProps.options?.minHeight
  );
};

/** 日志窗口就绪后，若队列中有未接收的日志消息，则统一发送 */
export const printWindowReady = (_event: IpcMainInvokeEvent) => {
  const win = WindowManager.getByContentsId(_event.sender.id);
  if (!win?.isAlive() || !consumerWindowNames.includes(win.name)) return;
  handlePrint(win, mainLogList);
  clearMainLogItems();

  if (!supportedWindowNames.includes(win.name)) {
    crashPrintWindowName = win.name;
  }
};
