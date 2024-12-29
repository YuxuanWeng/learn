import { ReactNode } from 'react';
import { Size } from '@fepkg/components/types';

type CombinationColor = 'prefix700' | 'prefix800';

type BackgroundColor = `${CombinationColor}-suffix600`;

// 结合组件参数
export type CombinationProps = {
  /** 是否禁用 */
  disabled?: boolean;
  /** 容器样式，组合组件默认第一个背景色跟随容器，第二个区别于容器，如果需求与默认样式相悖，可以给容器添加flex-row-reverse来调换位置 */
  containerCls?: string;
  /** 需要结合到前面的组件 */
  prefixNode: ReactNode;
  /** 需要结合到后面的组件 */
  suffixNode: ReactNode;
  /** 结合组件的尺寸 */
  size?: Size;
  /** 结合组件的背景色 */
  background?: BackgroundColor;
  /** Suffix 内是否为 Button 组件，若为 Button，需要在外层添加一层 div */
  suffixButton?: boolean;
};

// 结合组件内节点参数
export type CombinationNodeProps = Partial<CombinationProps> & {
  children: ReactNode;
  className?: string;
};
