import { ReactNode, createContext, useContext, useEffect, useMemo, useState } from 'react';
import { getDefaultExerciseType } from '@fepkg/business/utils/bond';
import { ProductType } from '@fepkg/services/types/bdm-enum';
import { BondQuoteType, ExerciseType } from '@fepkg/services/types/bds-enum';
import { useMemoizedFn } from 'ahooks';
import { defaultContext } from './constants';
import { ExerciseContextType, ExerciseProviderType } from './types';
import { transFormExerciseToBoolean } from './utils';

export const ExerciseContext = createContext<ExerciseProviderType>(defaultContext);

export const ExerciseProvider = (props: ExerciseContextType & { children: ReactNode }) => {
  const {
    hasBond,
    disabled: propDisabled,
    productType,
    quoteType = BondQuoteType.Yield,
    isHasOption = false,
    defaultValue = ExerciseType.ExerciseTypeNone
  } = props;

  const disabled = propDisabled || !isHasOption || quoteType === BondQuoteType.CleanPrice || !hasBond;

  const [innerValue, setInnerValue] = useState<ExerciseType>(defaultValue);

  useEffect(() => {
    if (!hasBond) setInnerValue(ExerciseType.ExerciseTypeNone);
    else if (isHasOption && quoteType === BondQuoteType.CleanPrice) setInnerValue(ExerciseType.ExerciseTypeNone);
    else if (!isHasOption) setInnerValue(ExerciseType.Expiration);
  }, [hasBond, isHasOption, quoteType]);

  const defaultExercise = (() => {
    if (!isHasOption) return ExerciseType.Expiration;
    return getDefaultExerciseType(productType, quoteType);
  })();

  const getExerciseEnum = useMemoizedFn((val: ExerciseType) =>
    val === ExerciseType.ExerciseTypeNone ? defaultExercise : val
  );

  const getExerciseBoolean = useMemoizedFn((val: ExerciseType) => transFormExerciseToBoolean(val) as boolean);

  const getIsSelected = useMemoizedFn((val: ExerciseType) => {
    if (!isHasOption || quoteType === BondQuoteType.CleanPrice) return false;
    return val !== ExerciseType.ExerciseTypeNone;
  });

  const exerciseEnum = getExerciseEnum(innerValue);
  const exerciseBoolean = getExerciseBoolean(exerciseEnum);

  const isSelected = getIsSelected(innerValue);

  const tipsLabel = (() => {
    if (productType === ProductType.BCO) return '默认行权';
    if (productType === ProductType.BNC) return '默认到期';
    return '';
  })();

  const value = useMemo(
    () => ({
      disabled,
      setInnerValue,
      innerValue,
      productType,
      tipsLabel,

      getExerciseEnum,
      getExerciseBoolean,
      getIsSelected,

      /** 根据不同台子, 有不同默认值(用于请求数据): ExerciseType */
      exerciseEnum,
      /** 根据不同台子, 有不同默认值(用于请求数据): Boolean */
      exerciseBoolean,
      /** 是否手动选中了行权/到期选项 */
      isSelected
    }),
    [
      disabled,
      exerciseBoolean,
      exerciseEnum,
      getExerciseBoolean,
      getExerciseEnum,
      getIsSelected,
      innerValue,
      isSelected,
      productType,
      tipsLabel
    ]
  );

  return <ExerciseContext.Provider value={value}>{props.children}</ExerciseContext.Provider>;
};

export const useExercise = () => useContext(ExerciseContext);
