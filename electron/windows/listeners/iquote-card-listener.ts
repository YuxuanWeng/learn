import { IpcMainInvokeEvent, ipcMain } from 'electron';
import { DialogEvent } from '../../types/IPCEvents';
import { closeAllIQuoteCard, focusIQuoteCard } from '../dialog/iquote-card';
import { WindowManager } from '../models/windows-manager';

const onFocus = (_: any, roomID: string) => {
  focusIQuoteCard(roomID);
};

const getStatus = (evt: IpcMainInvokeEvent) => {
  const win = WindowManager.getByContentsId(evt.sender.id);

  return !!win?.object?.isFocused();
};

const onCloseAll = (_: any) => {
  closeAllIQuoteCard();
};

const start = () => {
  ipcMain.on(DialogEvent.IQuoteCardFocus, onFocus);
  ipcMain.handle(DialogEvent.GetIQuoteCardFocusStatus, getStatus);
  ipcMain.on(DialogEvent.IQuoteCardCloaseAll, onCloseAll);
};

const end = () => {
  ipcMain.off(DialogEvent.IQuoteCardFocus, onFocus);
  ipcMain.off(DialogEvent.GetIQuoteCardFocusStatus, getStatus);
  ipcMain.off(DialogEvent.IQuoteCardCloaseAll, onCloseAll);
};

/**
 * iquote卡片事件
 */
export default () => [start, end];
