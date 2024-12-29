import { cloneElement, isValidElement } from 'react';
import cx from 'classnames';
import { CombinationNodeProps } from './types';

const sizeMap = {
  md: 'h-8',
  sm: 'h-7',
  xs: 'h-6'
};

export const CombinationNode = (props: CombinationNodeProps) => {
  const { className, disabled, children, suffixButton } = props;
  const size: string = sizeMap[props.size ?? 'md'];

  if (isValidElement(children)) {
    const el = cloneElement(children, {
      ...children?.props,
      disabled: children?.props?.disabled || disabled,
      className: suffixButton ? children.props?.className : cx(className, children.props?.className)
    });

    // 若为 Button，需要在外层添加一层 div
    if (suffixButton) {
      return <div className={cx('s-combination-btn border border-solid', className)}>{el}</div>;
    }
    return el;
  }

  // 组合两个text的情况虽然合理，但无意义，所以不考虑该情况
  return <div className={cx('s-combination-text border border-solid', size, className)}>{children}</div>;
};
