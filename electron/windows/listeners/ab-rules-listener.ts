import { ABRuleEventEnum } from 'app/types/IPCEvents';
import { IpcMainInvokeEvent, ipcMain } from 'electron';

/** 是否允许在生产环境打开 DevTools */
let isDevToolsInProd = false;

export const getIsDevToolsInProd = () => isDevToolsInProd;

const setDevToolsRule = (_evt: IpcMainInvokeEvent, rules: boolean) => {
  isDevToolsInProd = rules;
};

const start = () => {
  ipcMain.handle(ABRuleEventEnum.SetDevToolsRule, setDevToolsRule);
};

const end = () => {
  ipcMain.off(ABRuleEventEnum.SetDevToolsRule, setDevToolsRule);
};

/**
 * ab规则事件
 */
export default () => [start, end];
