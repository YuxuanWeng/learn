import { ExerciseType, ProductType } from '@fepkg/services/types/enum';

export const Exercise = { label: '行权', value: ExerciseType.Exercise };
export const Maturity = { label: '到期', value: ExerciseType.Expiration };
export const options = [Exercise, Maturity];

export const defaultContext = {
  disabled: false,
  innerValue: ExerciseType.ExerciseTypeNone,
  productType: ProductType.BNC,
  tipsLabel: '',
  exerciseEnum: ExerciseType.ExerciseTypeNone,
  exerciseBoolean: false,
  isSelected: false,
  getExerciseEnum: () => ExerciseType.ExerciseTypeNone,
  getExerciseBoolean: () => false,
  getIsSelected: () => false,
  setInnerValue: () => false
};
