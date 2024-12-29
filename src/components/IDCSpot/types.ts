/* eslint-disable no-bitwise */
import { BondDeal, DealQuote, FiccBondBasic } from '@fepkg/services/types/common';
import { DealType } from '@fepkg/services/types/enum';
import BitOper from '@/common/utils/bit';
import { SpotPricingDisplayRecord } from '@/pages/Spot/SpotPricingHint/types';
import { ComparableQuote } from '../Quote/types';

export type ComparableSpotPricing = Pick<BondDeal, 'price' | 'price_type' | 'return_point'>;
export type ComparableIDCSpotQuote = ComparableQuote & { quote_price?: number };

export enum SpotDate {
  FRA = 1,
  Plus0 = 1 << 1,
  Plus1 = 1 << 2,
  Tomorrow0 = 1 << 3,
  NonFRA = Plus0 | Plus1 | Tomorrow0,
  Today1Tommorow0 = Plus1 | Tomorrow0
}

export enum IntentType {
  GVN = 1,
  TKN = 1 << 1,
  OFFLINE = 1 << 2,
  WAIT = 1 << 3,
  REFUSED = 1 << 4,
  PARTIAL = 1 << 5,
  CONFIRMED = 1 << 6,
  SPOTTED = 1 << 7,
  NO_VOLUME = 1 << 8
}

export const IntentBoxColors = {
  [IntentType.NO_VOLUME]: 'bg-gray-600',
  [IntentType.OFFLINE]: 'bg-gray-600',
  [IntentType.CONFIRMED]: 'bg-primary-600',
  [IntentType.REFUSED]: 'bg-danger-600',
  [IntentType.PARTIAL]: 'bg-trd-600',
  [BitOper.combine(IntentType.SPOTTED, IntentType.OFFLINE)]: 'bg-gray-600',
  [BitOper.combine(IntentType.SPOTTED, IntentType.CONFIRMED)]: 'bg-primary-600',
  [BitOper.combine(IntentType.SPOTTED, IntentType.REFUSED)]: 'bg-danger-600',
  [BitOper.combine(IntentType.SPOTTED, IntentType.PARTIAL)]: 'bg-trd-600'
};

export type SpotPricingCardType = {
  className?: string;
  card: SpotPricingDisplayRecord;
  onClose?: VoidFunction;
  onRefresh?: VoidFunction;
  forceVisible?: boolean;
  isManualRefresh?: boolean;
  onDragStart?: VoidFunction;
  onDragMove?: VoidFunction;
  onDragEnd?: VoidFunction;
};

export interface SpotModalProps {
  dealType: DealType;
  bond: FiccBondBasic;
  optimal: DealQuote;
  quoteList: DealQuote[];
  spotDate?: SpotDate;
  dialogId?: string;
  disabled?: boolean;
  forceUpdateTime?: number;
}

export interface SpotAppointModalProps {
  dealType: DealType;
  quote?: Partial<DealQuote>;
  bond: FiccBondBasic;
  disabled?: boolean;
  dialogId?: string;
  openTimestamp?: number;
}

export type ComparableSpotDate = {
  spotDate?: SpotDate;
  optimal?: Pick<DealQuote, 'deal_liquidation_speed_list'>;
};
