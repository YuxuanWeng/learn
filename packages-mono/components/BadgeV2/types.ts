import { HTMLProps } from 'react';

export type BadgeType = 'danger' | 'primary';

export type BadgeProps = Omit<HTMLProps<HTMLDivElement>, 'type'> & {
  /** container className */
  containerCls?: string;
  /** 徽标类型，默认为 danger */
  type?: BadgeType;
  /** 不展示数字，只有一个小红点，默认为 count === undefined */
  dot?: boolean;
  /** 展示的数字，大于 overflowCount 时显示为 ${overflowCount}+，为 0 时隐藏 */
  count?: number;
  /** 展示封顶的数字值 */
  overflowCount?: number;
  /** 当数值为 0 时，是否展示徽标 */
  showZero?: boolean;
};
