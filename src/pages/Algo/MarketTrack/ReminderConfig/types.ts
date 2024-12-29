import { OppositePriceNotifyLogic } from '@fepkg/services/types/common';
import type { OppositePriceNotificationTraderSettingGet } from '@fepkg/services/types/opposite-price-notification/trader-setting-get';

export type ColorOptType = { value: string | number; color: string; hoverColor: string };
export type ColorPickProps = {
  className?: string;
  selectedValue?: ColorOptType;
  colorOpt?: ColorOptType[];
  onChange?: (val: ColorOptType) => void;
};

export type ReminderChannelColumns = OppositePriceNotificationTraderSettingGet.TraderForOppositePriceNotification;

export type OppositePriceNotifyLogicTable = OppositePriceNotifyLogic & { id: string };

export type NotifyLogicState = {
  /** N值的类型 */
  nValueType: NValueEnum;
  /** 提醒逻辑列hover展示的内容 */
  detail: string;
  /** 是否为可复制的逻辑 */
  copy: boolean;
  /** input的输入规则 */
  rule?: RegExp;
};

export enum CpHandicapEnum {
  /** 含估值 */
  valuation = 'flag_valuation_for_cp_handicap',
  /** 含发行量 */
  issueAmount = 'flag_issue_amount_for_cp_handicap',
  /** 含到期日 */
  maturityDate = 'flag_maturity_date_for_cp_handicap'
}

export enum NValueEnum {
  None,
  OnOff,
  Input
}
