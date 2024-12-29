import { HTMLProps, ReactNode } from 'react';
import cx from 'classnames';
import { Tooltip } from '@fepkg/components/Tooltip';
import TextWithTooltip from '../TextWithTooltip';

interface IProps {
  isSelf?: boolean;
  alwaysRounded?: boolean;
  name?: ReactNode;
  overflowTooltip?: boolean;
  selfClasses?: string;
}
type IDom = Omit<HTMLProps<HTMLDivElement>, keyof IProps>;

const roundedCls = ['rounded-lg', 'border', 'border-solid', 'leading-6', 'h-[26px]', 'text-center', 'px-2'].join(' ');

export default function UserName({
  name = '',
  isSelf,
  alwaysRounded,
  overflowTooltip = false,
  selfClasses,
  ...rest
}: IProps & IDom) {
  let cls = 'truncate';
  if (isSelf)
    cls = selfClasses || cx(roundedCls, 'border-primary-200 text-primary-200 truncate max-w-[88px]', rest?.className);
  else if (alwaysRounded) cls = cx(roundedCls, 'border-gray-300 text-white truncate', rest?.className);
  return (
    <Tooltip
      truncate
      content={name}
    >
      <div
        {...rest}
        className={cls}
      >
        {name}
      </div>
    </Tooltip>
  );
}
