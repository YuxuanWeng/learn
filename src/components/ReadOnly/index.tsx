import cx from 'classnames';
import DescribeItem from '@/components/ReadOnly/DescribeItem';
import { ReadOnlyProps } from './types';

export const ReadOnly = (props: ReadOnlyProps) => {
  const {
    options,
    containerClassName,
    optionsClassName,
    defaultValue = '-',
    labelWidth,
    enableCopy = false,
    rowCount = 3
  } = props;
  return (
    <div className={cx(`bg-gray-600 rounded-lg grid gap-y-2 grid-cols-${rowCount} px-3 text-sm`, containerClassName)}>
      {options?.map(({ label, value, suffix, isTruncate, className }) => {
        return (
          <DescribeItem
            key={label}
            label={label}
            value={value || defaultValue}
            suffix={suffix}
            labelWidth={labelWidth}
            isTruncate={isTruncate}
            enableCopy={enableCopy}
            className={cx(optionsClassName, className)}
          />
        );
      })}
    </div>
  );
};
