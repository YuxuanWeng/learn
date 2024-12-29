import { ReactNode } from 'react';
import { InputProps } from '@fepkg/components/Input';
import { SelectProps } from '@fepkg/components/Select/types';
import { Size } from '@fepkg/components/types';
import { Side } from '@fepkg/services/types/enum';

export type Intention = 'BID' | 'OFR' | 'B' | 'BI' | 'O' | 'OF';

export enum VolumeUnit {
  /** 万 */
  TenThousand = 1,
  /** 千万 */
  TenMillion = 2
}

export type QuoteComponentRef = {
  /** 是否正在聚焦 */
  isFocusing?: () => boolean;
  /** 聚焦 */
  focus?: VoidFunction;
  /** 选择 */
  select?: VoidFunction;
};

type CommonProps = {
  /** 报价方向 */
  side: Side;
  /** F 键按下时的回调 */
  onFPress?: VoidFunction;
};

export declare namespace QuoteComponentProps {
  type Price = Omit<InputProps, 'onChange'> &
    CommonProps & {
      /** 价格改变时的回调 */
      onChange?: (side: Side, val?: string | Intention, intention?: boolean) => void;
      /** 意向价字符串 */
      intention?: string;
    };

  type Volume = Omit<InputProps, 'onChange'> &
    CommonProps & {
      /** 默认单位 */
      defaultUnit?: VolumeUnit;
      /** 量改变时的回调 */
      onChange?: (side: Side, val?: string) => void;
    };

  type ReturnPoint = Omit<InputProps, 'onChange'> &
    CommonProps & {
      /** 价格改变时的回调 */
      onChange?: (side: Side, val?: string) => void;
    };

  type Unit = SelectProps<VolumeUnit>;

  type Notional = {
    className?: string;
    volumeCls?: string;
    unitCls?: string;
    disabled?: boolean;
    size?: Size;
    side: Side;
    notional?: string | null;
    unit: VolumeUnit;
    unitRender?: ReactNode;
    onVolumeChange?: (side: Side, val?: string) => void;
    onUnitChange?: (v: VolumeUnit) => void;
    error?: boolean;
  };
}
