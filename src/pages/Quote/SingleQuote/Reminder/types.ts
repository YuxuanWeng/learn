import type { BaseDataMulCalculate } from '@fepkg/services/types/base-data/mul-calculate';
import { FiccBondBasic } from '@fepkg/services/types/common';
import { ProductType, Side } from '@fepkg/services/types/enum';
import { QuoteParamsType } from '../QuoteOper/QuoteOperProvider';

/** 倒挂信息 */
export type InvertedInfo = {
  /** 是否倒挂 */
  inverted: boolean;
  /** 倒挂不能低于的最小值 */
  min?: string;
  /** 倒挂不能高于的最大值 */
  max?: string;
  /** 对价展示内容 */
  consideration?: string;
};

/** 双边报价倒挂信息集合 */
export type DblSideInvertedInfo = {
  [Side.SideBid]: InvertedInfo;
  [Side.SideOfr]: InvertedInfo;
};

export type InvertedDisplayProps = {
  /** display className */
  className?: string;
  /** 需要展示倒挂的债券所属台子类型 */
  productType: ProductType;
  /** 需要展示倒挂的债券信息 */
  bond?: FiccBondBasic;
};

/** 报价提醒信息 */
export type QuoteReminder = {
  /** 需要提醒的债券信息 */
  bond?: FiccBondBasic;
  /** 批量倒挂: 第几行债券 */
  bidIndex?: number;
  ofrIndex?: number;
} & {
  [key in Side]?: {
    /** 报价信息 */
    quote?: QuoteParamsType;
    /** 由上述报价信息获取的计算器结果信息 */
    calcRes?: BaseDataMulCalculate.CalculateResult;
    /** 倒挂信息 */
    invertedInfo?: InvertedInfo;
    /** 是否有估值偏离 */
    deviation?: boolean;
  };
};
