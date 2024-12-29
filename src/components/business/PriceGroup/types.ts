import { Ref } from 'react';
import { SelectProps } from 'antd';
import { SizeType } from 'antd/lib/config-provider/SizeContext';
import { BondQuoteType, Side } from '@fepkg/services/types/enum';
import { QuoteComponentRef } from '../Quote';

export type QuoteTypeSelectProps = Omit<SelectProps, 'value' | 'onChange' | 'defaultValue'> & {
  /** 组件的受控值 */
  value?: BondQuoteType;
  /** 组件的默认值 */
  defaultValue?: BondQuoteType;
  /** 报价类型改变后的回调 */
  onChange?: (v: BondQuoteType) => void;
  /** 额外的样式 */
  className?: string;
};

export type PriceImmerWrapper<T> = { [Side.SideNone]?: T; [Side.SideBid]?: T; [Side.SideOfr]?: T };

export type PriceState = {
  /** 价格 */
  quote_price?: string;
  /** 返点标志 */
  flag_rebate?: boolean;
  /** 返点值 */
  return_point?: string;
  /** 报价类型 */
  quote_type?: BondQuoteType;
  /** 意向价标志 */
  flag_intention?: boolean;

  /** 以下字段只配合服务端使用 */
  /** 收益率 */
  yield?: number;
  /** 净价 */
  clean_price?: number;
  /** 全价 */
  full_price?: number;
  /** 利差 */
  spread?: number;
};

export enum HandleChangeCategory {
  Price,
  QuoteType,
  ReturnPoint,
  F
}

export type HandleChangeValType = { side: Side } & (
  | {
      category: HandleChangeCategory.Price;
      data: { quote_price?: string; intention?: string };
      ignoreThreshold?: boolean;
    }
  | {
      category: HandleChangeCategory.QuoteType;
      data: { quote_type?: BondQuoteType; intention?: string };
    }
  | {
      category: HandleChangeCategory.ReturnPoint;
      data: { return_point?: string; intention?: string };
    }
  | {
      category: HandleChangeCategory.F;
      data: { flag_rebate?: boolean; intention?: string };
    }
);

export type PriceGroupProps = {
  /** 报价方向 */
  side: Side;
  /** 组件尺寸 */
  size?: SizeType;
  /** 价格输入框 label */
  label?: string;
  /** 价格组件样式模式 */
  mode?: 'quote' | 'calculator';
  /** 价格输入框 placeholder */
  placeholder?: string;
  /** 返点输入框 placeholder */
  suffixPlaceholder?: string;
  /** 外层className */
  outerClassName?: string;
  /** 选择器或返点输入框className */
  suffixClassName?: string;
  /** 价格输入框className */
  priceClassName?: string;
  /** 输入框尺寸map */
  refs?: {
    priceRefs?: Ref<QuoteComponentRef>;
    returnPointRefs?: Ref<QuoteComponentRef>;
  };
  /** 是否禁用 [boolean: 价格/返点/报价类型是否禁用, boolean: F按钮是否禁用] */
  disabled?: [boolean, boolean];
  /** price是否报错 */
  priceError?: boolean;
  /** 返点是否报错 */
  returnPointError?: boolean;

  /**
   * 以下函数，当父组件不传递时， PriceGroup将调用组件自身的更新数据函数来更新组件自身的provider
   * 若父组件传递该函数时，会覆盖组件本身的的更新函数
   * 父组件可通过调用组件provider本身提供onInnerChange等更新函数，更新组件状态
   */
  onChange?: (val: HandleChangeValType) => void;

  /** 意向价字符串，当指定字符串时，则视为该字符串为意向价字符串 */
  intention?: string;
  /** 注册输入框按钮事件的回调函数 */
  onKeyDowns?: {
    onPriceKeyDown?: (evt: React.KeyboardEvent<HTMLInputElement>) => void;
    onReturnPointKeyDown?: (evt: React.KeyboardEvent<HTMLInputElement>) => void;
  };
  /** 注册输入框获得焦点后的回调函数 */
  onFocus?: {
    onPriceFocus?: () => void;
    onReturnPointFocus?: () => void;
  };
  /** 注册输入框失去焦点后的回调函数 */
  onBlurs?: {
    onPriceBlur?: () => void;
    onReturnPointBlur?: () => void;
  };
};
