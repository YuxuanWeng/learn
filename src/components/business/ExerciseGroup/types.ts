import { HTMLProps } from 'react';
import { BondQuoteType, ExerciseType, ProductType } from '@fepkg/services/types/enum';

export type ExerciseContextType = {
  /** 债券 */
  hasBond?: boolean;
  /** 组件是否禁用 */
  disabled?: boolean;
  /** 产品类型 */
  productType: ProductType;
  /** 报价类型 */
  quoteType?: BondQuoteType;
  /** 是否是含权债 */
  isHasOption?: boolean;
  /** 初始值, null表示都不选中 */
  defaultValue?: ExerciseType;
};

export type ExerciseProviderType = {
  disabled: boolean;
  innerValue: ExerciseType;

  setInnerValue: React.Dispatch<React.SetStateAction<ExerciseType>>;
  productType: ProductType;
  tipsLabel: string;

  getExerciseEnum: (val: ExerciseType) => ExerciseType;
  getExerciseBoolean: (val: ExerciseType) => boolean;
  getIsSelected: (val: ExerciseType) => boolean;

  /** 根据不同台子, 有不同默认值(用于请求数据): ExerciseType */
  exerciseEnum: ExerciseType;
  /** 根据不同台子, 有不同默认值(用于请求数据): Boolean */
  exerciseBoolean: boolean;
  /** 是否手动选中了行权/到期选项 */
  isSelected: boolean;
};

/** [UI组件切换返回的原始值, ExerciseType, boolean, 是否选中] */
export type ExerciseOnChange = [boolean | null, ExerciseType, boolean, boolean];

export type ExerciseGroupProps = Omit<HTMLProps<HTMLDivElement>, 'defaultValue' | 'value' | 'onChange'> & {
  /** 每个tab的css属性 */
  itemClassName?: string | undefined;
  /** 隐藏hint */
  hideHint?: boolean;
  /** 对外的回调函数 */
  onChange?: (val: ExerciseOnChange) => void;
};
