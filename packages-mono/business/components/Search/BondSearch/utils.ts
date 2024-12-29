import { SearchOption } from '@fepkg/components/Search';
import { FiccBondBasic } from '@fepkg/services/types/common';

export const transform2BondOpt = (bond?: FiccBondBasic | null): SearchOption<FiccBondBasic> | null => {
  if (!bond) return null;
  return { label: bond.display_code, value: bond.display_code, original: bond, disabled: false };
};
