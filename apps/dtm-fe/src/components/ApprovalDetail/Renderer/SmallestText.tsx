import cx from 'classnames';
import { ApprovalDetailRendererProps } from './types';

export const SmallestText = ({ className, diff, children, onClick }: ApprovalDetailRendererProps.SmallestText) => {
  return (
    <span className={cx(className, 'def:w-full def:h-4 leading-4')}>
      <span
        className={cx('text-xs', diff && 'bg-danger-100', onClick && 'cursor-pointer')}
        onClick={onClick}
      >
        {children}
      </span>
    </span>
  );
};
