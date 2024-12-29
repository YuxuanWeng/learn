import cx from 'classnames';
import { CombinationNode } from './CombinationNode';
import { containerSizeMap } from './constants';
import { CombinationProps } from './types';
import './combination.less';

export const Combination = (props: CombinationProps) => {
  const { disabled, containerCls, size = 'md', background, suffixButton } = props;

  return (
    <div
      className={cx(
        's-combination',
        disabled ? 's-combination-disabled' : '',
        background,
        containerSizeMap[size],
        containerCls
      )}
    >
      <CombinationNode
        className="s-combination-prefix"
        size={size}
        disabled={props.disabled}
      >
        {props.prefixNode}
      </CombinationNode>

      <CombinationNode
        size={size}
        className="s-combination-suffix"
        disabled={props.disabled}
        suffixButton={suffixButton}
      >
        {props.suffixNode}
      </CombinationNode>
    </div>
  );
};
