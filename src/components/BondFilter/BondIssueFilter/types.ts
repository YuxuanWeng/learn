import { ProductType } from '@fepkg/services/types/enum';
import { BondIssueInfoFilterValue } from '../types';

export type BondIssueFilterFilterProps = {
  productType: ProductType;
  loggerEnabled?: boolean;
  value?: BondIssueInfoFilterValue;
  onChange?: (v: BondIssueInfoFilterValue) => void;
  disabled?: boolean;
};

export type BondIssueFilterFilterInstance = {
  reset: () => void;
};
