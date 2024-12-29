import cx from 'classnames';
import { IconClose } from '@fepkg/icon-park-react';
import { MessageNotificationProps } from '../types';

export const Notification = ({ children, onClickClose, icon, ...restProps }: MessageNotificationProps) => {
  return (
    <div
      className={cx(
        'relative flex justify-between items-center',
        'h-[46px] w-[400px] px-3 py-[10px]',
        'bg-gray-500 border border-solid border-gray-400 rounded-lg'
      )}
      {...restProps}
    >
      {icon ? (
        <>
          <div className="w-[40px]">{icon}</div>
          <div className="ml-4 border-0 border-r border-solid border-gray-400 h-4" />
        </>
      ) : null}

      <div className={cx('flex-1 flex items-center text-sm h-full', icon && 'px-4')}>
        <div className="w-full">
          <div className="text-left font-bold text-gray-000 overflow-hidden select-none cursor-pointer">{children}</div>
        </div>
      </div>
      <IconClose
        className="absolute mr-0 pr-0 text-gray-100 cursor-pointer right-8 hover:text-gray-000 active:text-white"
        onClick={onClickClose}
      />
      <div className="absolute w-full h-full left-0 shadow-[0_8px_40px_0px_rgba(0,0,0,0.5)] pointer-events-none" />
    </div>
  );
};
