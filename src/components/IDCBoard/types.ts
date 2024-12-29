import { HTMLProps } from 'react';
import { TabItem } from '@fepkg/components/Tabs';
import type { DealQuote, FiccBondBasic } from '@fepkg/services/types/common';
import type { DealType } from '@fepkg/services/types/enum';
import { OpenSpotParam } from '@/pages/Spot/Panel/BondPanel/useSpot';
import { BondTabs } from '@/pages/Spot/types';
import { SpotDate } from '../IDCSpot/types';

export interface IGrid {
  isOptimal?: boolean;
  bond?: FiccBondBasic;
  /** 当前格子是否为空 */
  isEmpty?: boolean;
  quote?: Partial<DealQuote>;
  showQuote?: boolean;
  from?: 'cell' | 'detail';
  onDoubleClick?: (side: DealType) => void;
}

export type ClearSearchableBondOption = {
  focus?: boolean;
  isEdit?: boolean;
  isExpire?: boolean;
};

export type BondsCache = Record<number, FiccBondBasic['key_market'] | undefined>;
export type SpotDateCache = Record<number, SpotDate | undefined>;

export type BondsStorage = Record<TabItem<BondTabs>['key'], BondsCache>;
export type SpotDateStorage = Record<TabItem<BondTabs>['key'], SpotDateCache>;

export type BondsExpire = Record<FiccBondBasic['key_market'], FiccBondBasic['maturity_date']>;

export type IDCPanelProps = HTMLProps<HTMLDivElement> & {
  from?: 'cell' | 'detail';
  onListChange?: (list: IGrid[][]) => void;
  onBondDetailDialogOpen?: (keyMarket?: FiccBondBasic['key_market']) => void;
  showSubOptimal?: boolean;
  rowCount?: number;
  spotDate?: SpotDate;
  onSpot: (openSpotParam: OpenSpotParam) => void;
};
