import { DateOffsetEnum } from '@fepkg/business/types/date';
import { LiquidationSpeed } from '@fepkg/services/types/common';
import { LiquidationSpeedTag } from '@fepkg/services/types/enum';
import type { Moment } from 'moment';

export type SettlementMethod = {
  key: DateShortcutsEnum;
  offset: DateOffsetEnum;
  timestamp?: number;
};

export type SettlementDate = {
  label: string;
  offset: DateOffsetEnum;
  timestamp?: number;
};

export interface ClearSpeedType {
  labelSet: SettlementMethod[];
  date: SettlementDate;
}

// 当前的结算方式以及对应的交易日与交割日
export interface LiqSpeedWithMoment {
  liquidationSpeed: LiquidationSpeed;
  tradedDate: Moment;
  deliveryDate: Moment;
}

// 当前的结算方式以及对应的交易日
export interface LiqSpeedWithTradeDate {
  liquidationSpeed: LiquidationSpeed;
  tradedDate: Moment;
}

export interface LabelDates {
  offset: 0 | 1;
  key: DateShortcutsEnum;
  tradedDate: string;
  deliveryDate: string;
}

export type Dates = { tradedDate: Moment; deliveryDate: Moment };

export type BatchGetTreadDayAndDeliDayProps = { tag: LiquidationSpeedTag; offset: DateOffsetEnum }[];
export type BatchGetTreadDayAndDeliDayResponse = {
  key: DateShortcutsEnum;
  offset: DateOffsetEnum;
  tradedDate: Moment;
  deliveryDate: Moment;
};

export type DaysStruct = BatchGetTreadDayAndDeliDayResponse;

export type LiquidationSpeedTagItem = {
  key: LiquidationSpeedTag;
  offset: number;
  tradedDate: Moment;
  deliveryDate: Moment;
};

// 仅对应用户点击的标签名称
export enum DateShortcutsEnum {
  NONE = 'none',
  PLUS_0 = 'today',
  PLUS_1 = 'today+1',
  TOMORROW = 'tomorrow',
  TOMORROW_1 = 'tomorrow+1',
  MON = 'weekday1',
  TUE = 'weekday2',
  WED = 'weekday3',
  THU = 'weekday4',
  FRI = 'weekday5',
  SAT = 'weekday6',
  SUN = 'weekday7'
}

export const Weeks = new Set([
  DateShortcutsEnum.MON,
  DateShortcutsEnum.TUE,
  DateShortcutsEnum.WED,
  DateShortcutsEnum.THU,
  DateShortcutsEnum.FRI,
  DateShortcutsEnum.SAT,
  DateShortcutsEnum.SUN
]);

export const WeeksOnService = new Set([
  LiquidationSpeedTag.Monday,
  LiquidationSpeedTag.Tuesday,
  LiquidationSpeedTag.Wednesday,
  LiquidationSpeedTag.Thursday,
  LiquidationSpeedTag.Friday,
  LiquidationSpeedTag.Saturday,
  LiquidationSpeedTag.Sunday
]);

export const WeekInSpeedTag = new Set([
  LiquidationSpeedTag.Monday,
  LiquidationSpeedTag.Tuesday,
  LiquidationSpeedTag.Wednesday,
  LiquidationSpeedTag.Thursday,
  LiquidationSpeedTag.Friday,
  LiquidationSpeedTag.Saturday,
  LiquidationSpeedTag.Sunday
]);

export const DateShortcuts = [
  { key: DateShortcutsEnum.NONE, label: '默认' },
  { key: DateShortcutsEnum.PLUS_0, label: '+0' },
  { key: DateShortcutsEnum.PLUS_1, label: '+1' },
  { key: DateShortcutsEnum.TOMORROW, label: '明天+0' },
  { key: DateShortcutsEnum.TOMORROW_1, label: '明天+1' },
  { key: DateShortcutsEnum.MON, label: '周一' },
  { key: DateShortcutsEnum.TUE, label: '周二' },
  { key: DateShortcutsEnum.WED, label: '周三' },
  { key: DateShortcutsEnum.THU, label: '周四' },
  { key: DateShortcutsEnum.FRI, label: '周五' },
  { key: DateShortcutsEnum.SAT, label: '周六' },
  { key: DateShortcutsEnum.SUN, label: '周日' }
];

export const DateShortcutsLine1 = [
  { key: DateShortcutsEnum.NONE, label: '默认' },
  { key: DateShortcutsEnum.PLUS_0, label: '+0' },
  { key: DateShortcutsEnum.PLUS_1, label: '+1' },
  { key: DateShortcutsEnum.TOMORROW, label: '明天+0' },
  { key: DateShortcutsEnum.TOMORROW_1, label: '明天+1' }
];

export const DateShortcutsLine2 = [
  { key: DateShortcutsEnum.MON, label: '周一' },
  { key: DateShortcutsEnum.TUE, label: '周二' },
  { key: DateShortcutsEnum.WED, label: '周三' },
  { key: DateShortcutsEnum.THU, label: '周四' },
  { key: DateShortcutsEnum.FRI, label: '周五' },
  { key: DateShortcutsEnum.SAT, label: '周六' },
  { key: DateShortcutsEnum.SUN, label: '周日' }
];
