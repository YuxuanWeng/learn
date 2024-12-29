import cx from 'classnames';
import { isNCD } from '@fepkg/business/utils/product';
import { RadioButton } from '@fepkg/components/Radio';
import { Tooltip } from '@fepkg/components/Tooltip';
import { IconInfo } from '@fepkg/icon-park-react';
import { ExerciseType } from '@fepkg/services/types/enum';
import { useProductParams } from '@/layouts/Home/hooks/useProductParams';
import { Exercise, Maturity } from './constants';
import { useExercise } from './provider';
import { ExerciseGroupProps } from './types';

export const ExerciseGroup = ({ className, itemClassName, hideHint = false, onChange }: ExerciseGroupProps) => {
  const { productType } = useProductParams();
  const { disabled, innerValue, tipsLabel, setInnerValue, getExerciseEnum, getExerciseBoolean, getIsSelected } =
    useExercise();

  const handleChange = (type: ExerciseType, val: boolean | null) => {
    const exercise = val ? type : ExerciseType.ExerciseTypeNone;
    setInnerValue(exercise);
    onChange?.([val, getExerciseEnum(exercise), getExerciseBoolean(exercise), getIsSelected(exercise)]);
  };

  // 存单台没有行权到期，UI上不用展示
  if (isNCD(productType)) return null;

  return (
    <div className={cx('flex items-center gap-4', className)}>
      <div className="flex rounded-lg bg-gray-600 [&_.s-checkbox-wrapper]:h-6">
        <RadioButton
          className={cx('w-[82px]', itemClassName)}
          type="checkbox"
          disabled={disabled}
          checked={innerValue === ExerciseType.Exercise}
          value={ExerciseType.Exercise}
          onChange={val => handleChange(ExerciseType.Exercise, val)}
        >
          {Exercise.label}
        </RadioButton>
        <RadioButton
          className={cx('ml-0.5 w-[82px]', itemClassName)}
          type="checkbox"
          disabled={disabled}
          checked={innerValue === ExerciseType.Expiration}
          value={ExerciseType.Expiration}
          onChange={val => handleChange(ExerciseType.Expiration, val)}
        >
          {Maturity.label}
        </RadioButton>
      </div>
      {!disabled && innerValue === ExerciseType.ExerciseTypeNone && !hideHint && (
        <Tooltip
          content={tipsLabel}
          placement="bottom"
        >
          <IconInfo className="text-gray-100 hover:text-primary-100" />
        </Tooltip>
      )}
    </div>
  );
};
