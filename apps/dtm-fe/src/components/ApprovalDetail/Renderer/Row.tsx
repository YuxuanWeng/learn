import cx from 'classnames';
import { ApprovalDetailRendererProps } from './types';

export const Row = ({ className, dashed, children, ...restProps }: ApprovalDetailRendererProps.Row) => {
  return (
    <div
      className={cx('row', dashed && 'row-dashed', className)}
      {...restProps}
    >
      {children}
    </div>
  );
};
