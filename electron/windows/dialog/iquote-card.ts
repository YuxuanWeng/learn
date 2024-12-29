import { DialogEvent } from 'app/types/IPCEvents';
import { WindowInstance } from 'app/types/window-type';
import { WindowName } from 'app/types/window-v2';
import { WindowManager } from '../models/windows-manager';

/**
 * 获取当前所有已打开的iquote卡片
 * @param excludes string 排除
 */
export const getAllOpenedIQuoteCardRoomIds = (excludes?: string) => {
  const res: string[] = [];
  const allWindow = WindowManager.getAll();
  allWindow.forEach(win => {
    const roomId = (win.custom.context as any)?.roomId ?? '';
    if (roomId && roomId !== excludes && win.name.startsWith(WindowName.IQuoteCard)) {
      res.push(roomId);
    }
  });
  return res;
};

/** 行情看板窗口信息发生变更 */
export const sendIQuoteCardChange = (excludes?: string) => {
  const openedRoomIds = getAllOpenedIQuoteCardRoomIds(excludes);
  WindowManager.get(WindowName.IQuote)?.getContent()?.postMessage(DialogEvent.IQuoteCardChange, openedRoomIds);
};

export const beforeCloseIQuoteCard = (win: WindowInstance) => {
  if (!win.name.startsWith(WindowName.IQuoteCard)) return;
  const roomId = (win.custom.context as any)?.roomId ?? '';
  if (!roomId) return;
  sendIQuoteCardChange(roomId);
};

export const getIQuoteCardWindowName = (roomID: string) => `${WindowName.IQuoteCard}__${roomID}`;

export const focusIQuoteCard = (roomID: string) => {
  const target = WindowManager.get(getIQuoteCardWindowName(roomID));

  target?.restore();
  target?.focus();
};

export const closeAllIQuoteCard = () => {
  WindowManager.getAll().forEach(win => {
    if (win.name.startsWith(WindowName.IQuoteCard)) {
      win.close();
    }
  });
};
