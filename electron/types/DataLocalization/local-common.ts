import {
  FiccBondBasic,
  InstSync,
  InstitutionTiny,
  QuoteDraftDetailSync,
  QuoteDraftMessageSync,
  TraderLite,
  TraderSync,
  User,
  UserSync
} from '@fepkg/services/types/common';
import { QuoteDraftDetailSyncDBExp } from 'app/packages/database-client/types';

export type QuoteDraftDetail = Omit<QuoteDraftDetailSync, 'enable'> &
  QuoteDraftDetailSyncDBExp & {
    bond_info?: FiccBondBasic;
  };

export type QuoteDraftMessage = Omit<
  QuoteDraftMessageSync,
  'inst_id' | 'trader_id' | 'broker_id' | 'trader_tag' | 'enable'
> & {
  inst_info?: InstitutionTiny;
  trader_info?: TraderLite;
  broker_info?: User;
  operator_info?: User;
  creator_info?: User;
  quote_draft_detail_list?: QuoteDraftDetail[];
};

export type BridgeInfoSync = {
  user?: UserSync;
  trader?: TraderSync;
  trader_tag?: string;
  inst?: InstSync;
};
