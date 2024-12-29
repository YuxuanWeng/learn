import { HTMLProps, ReactNode } from 'react';
import cx from 'classnames';

interface IText {
  children: ReactNode;
  highlight?: boolean;
}
type IDom = Omit<HTMLProps<HTMLDivElement>, keyof IText>;

export default function Text({ children, highlight, ...rest }: IText & IDom) {
  return (
    <span
      {...rest}
      className={cx(
        'text-ellipsis font-semibold leading-6',
        highlight ? ' text-white' : ' text-gray-300',
        rest?.className
      )}
    >
      {children}
    </span>
  );
}
