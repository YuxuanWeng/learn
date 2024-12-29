import cx from 'classnames';
import { Tooltip } from '@fepkg/components/Tooltip';
import { debounce } from 'lodash-es';
import { ReadOnlyOption } from './types';

/**
 *  描述列表组件
 */
const DescribeItem = ({
  label,
  value,
  isTruncate = true,
  enableCopy = false,
  className,
  suffix,
  labelWidth = 72,
  contentBold = false
}: ReadOnlyOption & { labelWidth?: number }) => {
  const onTextCopy = (v?: string | number) => {
    if (!enableCopy || !value) return;
    window.Main?.copy(String(v));
  };

  return (
    // 这里不能设置最小高度，因为这个组件涉及到的范围不止债券详情
    <div className={cx('text-sm flex items-center', enableCopy && 'select-none', className)}>
      <div
        className="flex-shrink-0 font-medium box-border text-gray-200"
        style={{ width: labelWidth }}
      >
        {label}
      </div>

      <div
        className={cx(
          'flex-grow flex items-center gap-1 text-white overflow-hidden',
          contentBold ? 'font-bold' : 'font-medium'
        )}
      >
        <Tooltip
          truncate
          content={value}
          placement="top-start"
        >
          <span
            className={cx(
              isTruncate && 'truncate',
              enableCopy && 'cursor-pointer hover:text-primary-200 active:bg-primary-500'
            )}
            onClick={() => (enableCopy ? debounce(onTextCopy, 500)(value) : undefined)}
          >
            {value}
          </span>
        </Tooltip>
        {suffix ? <i>{suffix}</i> : null}
      </div>
    </div>
  );
};
export default DescribeItem;
