import { BrokerGroup, EnumQuoteDraftGroupSettings } from '@/pages/Base/SystemSetting/components/QuoteSettings/types';

export type BrokerOptions = {
  label: string;
  value: string;
  disabled: boolean;
};

export type BrokerProps = {
  id: string;
  name: string;
  onDelete?: (brokerId: string) => void;
};

export type AddGroupModalProps = {
  visible?: boolean;
  defaultValue?: string;
  onOk?: (val?: string) => Promise<boolean>;
  onCancel?: () => void;
};

export type QuoteDraftSettingsGroupsType = Map<EnumQuoteDraftGroupSettings, BrokerGroup[] | string>;
