import { BondQuoteType, ExerciseType } from '@fepkg/services/types/enum';
import { PriceType } from '@/pages/Base/Calculator/types';

/**
 * 获取行权到期值
 * @param bondHasOption 是否为含权债
 * @param exercise 行权字段
 * @param exerciseManual 手动操作行权字段
 */
export const getExerciseValue = (bondHasOption?: boolean, exercise?: boolean, exerciseManual?: boolean) => {
  /** case 1: 非含权债默认到期 */
  if (!bondHasOption) return false;

  /** case 2: 含权债 && 报价为行权 && 手动操作行权，则默认选中行权 */
  if (exercise && exerciseManual) return true;

  /** case 3: 含权债 && 报价为到期 && 手动操作行权，则默认选中行权 */
  if (exercise === false && exerciseManual) return false;
  return null;
};

/**
 * 根据原始数据(成交单)，转换成组件的入参形式
 * @param val 接口原始行权/到期字段
 * @returns boolean | null
 */
export const transFormExerciseToBoolean = (val: ExerciseType) => {
  if (val === ExerciseType.Exercise) return true;
  if (val === ExerciseType.Expiration) return false;
  return null;
};

/**
 * 将组件的返回值转换成接口入参(成交单接口)
 * @param val boolean | null: 组件返回值
 * @returns ExerciseType
 */
export const transFormExerciseToEnum = (val: boolean | null) => {
  if (val === null) return ExerciseType.ExerciseTypeNone;
  if (val === true) return ExerciseType.Exercise;
  if (val === false) return ExerciseType.Expiration;
  return ExerciseType.ExerciseTypeNone;
};

/**
 * 根据行权到期的值，获取价格类型
 * @param exerciseVal 是否行权
 * @param quoteType 价格类型
 *  */
export const getPriceType = (exerciseVal?: boolean | null, quoteType?: BondQuoteType) => {
  if (quoteType === BondQuoteType.Yield) {
    if (exerciseVal) return PriceType.YieldToExecution;
    return PriceType.Yield;
  }

  if (quoteType === BondQuoteType.CleanPrice) return PriceType.CleanPrice;

  return PriceType.None;
};
