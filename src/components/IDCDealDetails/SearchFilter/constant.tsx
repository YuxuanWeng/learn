import { BondCategoryOptions, BondShortNameOptions } from '@fepkg/business/constants/options';
import { BondCategory } from '@fepkg/services/types/enum';

export const searchInputStyle = '';

// 利率债中的债券类型选项['国债', '央票', '地方债'];
export const bncIncludes = [BondCategory.GB, BondCategory.CBB, BondCategory.LGB];

// 利率债选项包括国债、央票、国开、口行、农发、地方债。
export const bondCategoryOptions = [
  ...BondCategoryOptions.filter(i => bncIncludes.includes(i.value)),
  ...BondShortNameOptions
];
