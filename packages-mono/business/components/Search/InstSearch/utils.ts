import { ProductType } from '@fepkg/services/types/bdm-enum';
import { InstitutionTiny } from '@fepkg/services/types/common';
import { getInstName } from '../../../utils/get-name';

export const transform2InstOpt = <T extends InstitutionTiny = InstitutionTiny>(inst?: T) => {
  if (!inst) return null;
  return { label: inst.short_name_zh, value: inst.short_name_zh, original: inst, disabled: false };
};

export const transform2AgencyInstOpt =
  (productType: ProductType) =>
  <T extends InstitutionTiny = InstitutionTiny>(inst?: T) => {
    if (!inst) return null;
    const label = getInstName({ inst, productType });
    return { label, value: inst.short_name_zh, original: inst, disabled: false };
  };
