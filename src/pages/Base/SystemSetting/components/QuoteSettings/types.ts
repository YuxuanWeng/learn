import { User } from '@fepkg/services/types/common';
import { ProductType, UserSettingFunction, ValuationConfType } from '@fepkg/services/types/enum';
import { VolumeUnit } from '@/components/business/Quote/types';
import { BondQuoteTableColumnSettingItem } from '@/pages/ProductPanel/types';
import {
  changeQuoteSettingsTypes,
  copySettingsTypes,
  quoteDisplaySettingsTypes,
  quoteDraftGroupSettingsTypes,
  quotePanelSettingsTypes
} from './constants';

export type IBrokerInfo = BrokerObj & { id: string };

export type BrokerObj = {
  brokerId?: string;
  brokerName?: string;
};

export type QuoteDisplayAmount = {
  internal: boolean;
  external: boolean;
};

export type BrokerGroup = {
  id: string;
  name: string;
  brokers?: User[];
};

export type ParseQuoteAmountValue = { value?: string; unit?: VolumeUnit };

export type TeamCollaboration = BrokerObj[];

// 协同报价报价量设置
export type CoQuoteVolumeSetting = {
  /** 改价量限制，大于等于 limit 时才需要改为目标报价量 */
  limit: ParseQuoteAmountValue;
  /** 目标报价量 */
  target: ParseQuoteAmountValue;
};

export type CommonTypeValue =
  | boolean
  | number
  | string
  | ParseQuoteAmountValue
  | BrokerObj[]
  | BrokerGroup[]
  | QuoteDisplayAmount
  | undefined
  | ValuationConfType
  | TeamCollaboration[]
  | BondQuoteTableColumnSettingItem[]
  | CoQuoteVolumeSetting;

export type IUserSettingRawValue<T = CommonTypeValue> = {
  [k in UserSettingFunction]?: { [p in ProductType]?: T } | T;
};
export type IUserSettingValue<T = CommonTypeValue> = {
  [k in UserSettingFunction]?: T;
};

// CommonSwitch 的传参数
export type TypeItem = {
  label?: string;
  value?: CommonTypeValue;
};

export type TypeOptions<T> = {
  label: string;
  value: T;
  disabled: boolean;
};

/**  每个台子的broker集合 */
export type BrokerItemObj = [number, BrokerObj[]][];

export type EnumChangeQuoteSettings = (typeof changeQuoteSettingsTypes)[number];
export type EnumQuotePanelSettings = (typeof quotePanelSettingsTypes)[number];
export type EnumCopySetting = (typeof copySettingsTypes)[number];
export type EnumQuoteDisplaySettings = (typeof quoteDisplaySettingsTypes)[number];

export type EnumQuoteDraftGroupSettings = (typeof quoteDraftGroupSettingsTypes)[number];

export type EnumUserSettingsTypes =
  | EnumChangeQuoteSettings
  | EnumQuotePanelSettings
  | EnumCopySetting
  | EnumQuoteDisplaySettings;
