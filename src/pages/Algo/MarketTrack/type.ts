import { FiccBondBasic, OppositePriceNotification } from '@fepkg/services/types/common';
import type { BondQuoteDealHandicap } from '@fepkg/services/types/handicap/get-by-bond';
import { OppositePriceNotificationGet } from '@fepkg/services/types/opposite-price-notification/get';

/** 卡片组件的数据 */
export type TypeCardItem = {
  keyMarket: string;
  /** 对价提醒信息  数组表示卡片展开后的提醒内容 */
  notifications: OppositePriceNotification[];
  /** 债券信息 */
  bondInfo?: FiccBondBasic;
  /** 最优报价信息和市场成交信息 */
  bondHandicap?: BondQuoteDealHandicap;
};

export type TypeGetPriceNotificationList = {
  list?: OppositePriceNotification[];
} & Omit<Partial<OppositePriceNotificationGet.Request>, 'start_time'>;

export enum SortEnum {
  Time,
  KeyMarket,
  DeadLine
}

export enum ReminderTabsEnum {
  RemindTab,
  ConfigTab
}
