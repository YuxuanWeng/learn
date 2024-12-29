import { MouseEvent } from 'react';
import cx from 'classnames';
import { copy } from '../utils';
import { SmallestText } from './SmallestText';
import { ApprovalDetailRendererProps } from './types';

export const Item = ({
  className,
  label,
  labelCls,
  childrenCls,
  align = 'vertical',
  size = 'md',
  diff,
  content = '',
  children,
  ...restProps
}: ApprovalDetailRendererProps.Item) => {
  const alignCls = align === 'vertical' ? 'flex-col' : 'items-center min-h-[48px]';

  const labelNode = typeof label === 'string' ? <SmallestText>{label}</SmallestText> : label;

  const handleCopy = (evt: MouseEvent<HTMLDivElement>) => {
    evt.stopPropagation();

    if (typeof children === 'string') {
      copy(children);
    } else {
      copy(content);
    }
  };

  return (
    <div
      className={cx('item', alignCls, className)}
      {...restProps}
    >
      {label ? <div className={cx('flex items-center font-normal text-gray-400', labelCls)}>{labelNode}</div> : null}
      <div
        className={cx(
          size === 'md' ? 'min-h-[24px] text-lg/6' : 'min-h-[16px] text-[14px]',
          'flex-wrap font-bold text-gray-800'
        )}
        onClick={handleCopy}
      >
        {children && (
          <span className={cx('break-all cursor-pointer', childrenCls, diff && 'bg-danger-100')}>{children}</span>
        )}
      </div>
    </div>
  );
};
