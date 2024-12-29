import { ReactNode } from 'react';
import cx from 'classnames';
import { Caption, CaptionProps } from '@fepkg/components/Caption';
import { Size } from '@fepkg/components/types';

type HeaderProps = {
  title: string;
  behindTitle?: ReactNode;
  leftNode?: ReactNode;
  type?: CaptionProps['type'];
  size?: Size;
  className?: string;
};

export const Header = ({ title, behindTitle, leftNode, className, ...rest }: HeaderProps) => {
  return (
    <div className={cx('h-11 px-3 py-1 flex items-center justify-between bg-gray-600 rounded-t', className)}>
      <div className="flex select-none">
        <Caption {...rest}>{title}</Caption>
        {behindTitle}
      </div>
      {leftNode}
    </div>
  );
};
