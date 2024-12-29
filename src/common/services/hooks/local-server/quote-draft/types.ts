import {
  FiccBondBasic,
  InstitutionTiny,
  QuoteDraftDetail,
  QuoteDraftMessage,
  TraderLite,
  User
} from '@fepkg/services/types/common';

export type LocalQuoteDraftDetail = QuoteDraftDetail & { bond_info?: FiccBondBasic };

export type LocalQuoteDraftMessage = Omit<
  QuoteDraftMessage,
  'inst_id' | 'trader_id' | 'broker_id' | 'creator' | 'operator' | 'detail_list' | 'trader_tag'
> & {
  inst_info?: InstitutionTiny;
  trader_info?: TraderLite;
  broker_info?: User;
  operator_info?: User;
  creator_info?: User;
  detail_list?: LocalQuoteDraftDetail[];
};

export type QuoteDraftMessageListQueryData = {
  list?: LocalQuoteDraftMessage[];
  total?: number;
  last_create_time?: string;
};
