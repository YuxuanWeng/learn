import { IMHelperClient } from 'app/packages/im-helper-core';
import { IMConnection, IMHelperClientConfig, IMHelperQQMsgForSend } from 'app/packages/im-helper-core/types';
import { IMHelperEventEnum } from 'app/types/IPCEvents';
import { ipcMain } from 'electron';

let imHelperClient: IMHelperClient | undefined;

export const startIMHelper = (config: IMHelperClientConfig) => {
  if (imHelperClient == null) {
    imHelperClient = new IMHelperClient(config);
    imHelperClient.start();
  } else {
    imHelperClient.update(config);
  }
};

export const stopIMHelperListening = () => {
  imHelperClient?.destroy();
  imHelperClient = undefined;
};

const sendQQ = (_: any, msg: IMHelperQQMsgForSend[]) => {
  return imHelperClient?.sendMessageToIMHelper(msg);
};

const getIMConnection = () => {
  return {
    imConnection: imHelperClient?.connection.imConnection ?? IMConnection.Lost,
    allowedUserIDs: imHelperClient?.connection.allowedUserIDs ?? []
  };
};

const start = () => {
  ipcMain.handle(IMHelperEventEnum.SendQQ, sendQQ);
  ipcMain.handle(IMHelperEventEnum.GetIMConnection, getIMConnection);
};

const end = () => {
  ipcMain.off(IMHelperEventEnum.SendQQ, sendQQ);
  ipcMain.off(IMHelperEventEnum.GetIMConnection, getIMConnection);
};

/**
 * im小助手相关Listener
 */
export default () => [start, end];
