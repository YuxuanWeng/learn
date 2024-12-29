import { InputFilter } from '@fepkg/services/types/common';
import { ProductPanelTableKey } from '@/pages/ProductPanel/types';
import { BaseWindowProps } from '../windows/models/base';

export type AppMsgChannelModule = {
  parentWinName: string;
  parentPort: Electron.MessagePortMain;
  winName: string;
  winPort: Electron.MessagePortMain;
};

export type DialogConfig = BaseWindowProps;

export type GetDialogParamsFunc = (winName?: string) => DialogConfig;

export type GetDialogWindowConfig = (params: DialogConfig) => DialogConfig;

export enum DialogResponseType {
  Success = 'success',
  Cancel = 'cancel',
  Error = 'error'
}

export type DialogWindowResponse = {
  type: DialogResponseType;
  data?: unknown;
};

export interface DialogCacheModule {
  webContentsId: number;
  parentId?: number;
  winName: string;
  resolve?: (response: DialogWindowResponse) => void;
  reject?: (reason?: unknown) => void;
  context?: unknown;
  msgChannel?: AppMsgChannelModule;
}

export interface DialogParams {
  winName?: string;
  parentId: number;
}

export enum DialogChannelAction {
  /** 关闭通道，子窗口发送 */
  Close = 'channel-close',
  /** 更新全局搜索内容 */
  UpdateGlobalSearch = 'update-global-search'
}

export type DialogChannelData =
  | { action: DialogChannelAction.Close }
  | ({
      action: DialogChannelAction.UpdateGlobalSearch;
    } & ({
      /** 对应产品台子 panel id */
      panelId?: string | number;
      /** 需要跳转的报价表格类型 */
      tableKey?: ProductPanelTableKey;
    } & InputFilter));

/** 窗口回调函数的配置项 */
export type DialogHandlerConfig = {
  isCloseModal?: boolean;
};

export type DialogHandlerParams = { data?: unknown; config?: DialogHandlerConfig };
