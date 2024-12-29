import { BondQuoteType, ExerciseType, ProductType } from '@fepkg/services/types/enum';
import { LocalOptionType } from '../types/bond';

/** 是否被认为是真正含权债（结合永续债逻辑)  */
export const hasOption = (params?: { has_option?: boolean; option_type?: string }) =>
  params?.has_option || params?.option_type === LocalOptionType.ETS;

/** 根据台子获取默认的行权/到期类型 */
export const getDefaultExerciseType = (productType: ProductType, quoteType: BondQuoteType) => {
  if (quoteType === BondQuoteType.CleanPrice) return ExerciseType.Expiration;
  switch (productType) {
    case ProductType.BNC:
    case ProductType.NCD:
      // 利率债\NCD默认到期
      return ExerciseType.Expiration;
    case ProductType.BCO:
      // 信用债默认行权
      return ExerciseType.Exercise;
    default:
      return ExerciseType.ExerciseTypeNone;
  }
};
