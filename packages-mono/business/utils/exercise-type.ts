import { BondQuoteType, ExerciseType, ProductType } from '@fepkg/services/types/enum';
import { getDefaultExerciseType } from './bond';

/**
 * 获取行权到期值
 * @param bondHasOption 是否为含权债
 * @param exercise 行权字段
 * @param exerciseManual 手动操作行权字段，成交单请手动填true!!!
 * @param productType 产品类型
 * @param quoteType 报价类型
 */
export const getExerciseType = ({
  bondHasOption,
  exercise,
  exerciseManual,
  productType,
  price_type
}: {
  bondHasOption?: boolean;
  exercise?: ExerciseType;
  exerciseManual?: boolean;
  productType: ProductType;
  price_type: BondQuoteType;
}) => {
  /** case 1: 非含权债默认到期 */
  if (!bondHasOption) return ExerciseType.Expiration;

  /** case 2: 含权债 && 报价为行权 && 手动操作行权，则默认选中行权 */
  if (exercise === ExerciseType.Exercise && exerciseManual) return ExerciseType.Exercise;

  /** case 3: 含权债 && 报价为到期 && 手动操作行权，则默认选中行权 */
  if (exercise === ExerciseType.Expiration && exerciseManual) return ExerciseType.Expiration;
  return getDefaultExerciseType(productType, price_type);
};
