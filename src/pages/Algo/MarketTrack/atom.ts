import { atom } from 'jotai';
import { ReminderTabsEnum } from './type';

export const userSettingMdlOpen = atom(false);
export const activeTab = atom(ReminderTabsEnum.RemindTab);
