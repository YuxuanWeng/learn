import { UserHotkey } from '@fepkg/services/types/common';

export enum EShortCutType {
  ProductPanel = 'ProductPanel', // 行情看板快捷键
  Func = 'Func', // 功能快捷键
  SettlementType = 'SettlementType', // 结算方式快捷键
  DealPanel = 'DealPanel', // 成交面板快捷键

  All = 'All' // 以上所有类型快捷键
}

export type ISelectRow = UserHotkey & { type: EShortCutType };

export interface ShortCutAction {
  type: EShortCutType;
  payload: UserHotkey[];
}

export type ShortCutState = {
  [k in EShortCutType]?: UserHotkey[];
};

export type IUpdateSelectedRow = (hotkey: string, selected?: ISelectRow) => void;
