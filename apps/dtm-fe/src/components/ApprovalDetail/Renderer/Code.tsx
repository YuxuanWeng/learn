import cx from 'classnames';
import { copy } from '../utils';
import { ApprovalDetailRendererProps } from './types';

export const Code = ({ label, labelCls, diff, children }: ApprovalDetailRendererProps.Code) => {
  const handleCopy = () => {
    if (typeof children === 'string') copy(children);
  };

  return (
    <>
      <div className={cx('font-medium text-gray-400', labelCls)}>{label}</div>
      <div>
        <span
          className={cx(diff && 'bg-danger-100', 'cursor-pointer font-bold text-[14px]')}
          onClick={handleCopy}
        >
          {children}
        </span>
      </div>
    </>
  );
};
