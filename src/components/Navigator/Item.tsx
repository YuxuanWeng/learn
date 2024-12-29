import { MouseEvent, forwardRef } from 'react';
import cx from 'classnames';
import { BadgeV2 } from '@fepkg/components/BadgeV2';
import { SortablePosition } from '@/types/sortable';
import { useNavigator } from './providers/NavigatorProvider';
import { NavigatorItemProps } from './types';

export const NavigatorItem = forwardRef<HTMLDivElement, NavigatorItemProps>(
  (
    {
      id,
      label,
      className,
      disabled,
      checked,
      sortable,
      overlay,
      dragging,
      position,
      badge,
      horizontal,
      fixed,
      onClick,
      onContextMenu,
      ...props
    },
    ref
  ) => {
    const { navigatorInfoMap } = useNavigator();
    const { icon, contextMenu } = navigatorInfoMap[id];

    const handleClick = (evt: MouseEvent<HTMLDivElement>) => {
      if (disabled) return;
      onClick?.(evt);
    };

    const handleContextMenu = (evt: MouseEvent<HTMLDivElement>) => {
      if (!contextMenu || disabled) return;
      onContextMenu?.(evt);
    };

    const containerCls = cx(
      's-navigator-item relative flex gap-2 border border-solid rounded-lg select-none !opacity-100',
      horizontal ? 'items-center h-10 px-2' : 'items-center flex-col w-16 h-16 py-2',
      disabled ? 'cursor-not-allowed' : 'border-transparent hover:border-gray-500 cursor-pointer',
      checked ? 'text-primary-100 bg-gray-600' : 's-icon-two-tone-not-fill text-gray-100',
      dragging && '!bg-transparent',
      overlay && 'z-hightest !bg-gray-800/80 border-gray-500 backdrop-blur-xs',
      className
    );

    const lineCls = cx(
      'absolute left-0 right-0 h-px',
      position && 'bg-primary-100',
      position === SortablePosition.Before && '-top-[7px]',
      position === SortablePosition.After && '-bottom-2'
    );

    const maskCls = cx('absolute-full bg-gray-600/50 rounded-lg', !dragging && 'hidden');

    return (
      <div
        ref={ref}
        {...props}
        tabIndex={-1}
        className={containerCls}
        onClick={handleClick}
        onContextMenu={handleContextMenu}
      >
        {badge ? (
          <BadgeV2
            containerCls="leading-0"
            dot={badge}
            style={{ right: 1, top: 3 }}
          >
            {icon}
          </BadgeV2>
        ) : (
          icon
        )}

        <span className="text-xs">{label}</span>

        <div className={lineCls} />
        <div className={maskCls} />
      </div>
    );
  }
);
