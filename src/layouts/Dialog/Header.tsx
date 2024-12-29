import { Children, ReactNode, cloneElement, isValidElement } from 'react';
import cx from 'classnames';
import { Button } from '@fepkg/components/Button';
import { IconClose, IconFullScreen, IconMinus, IconOffScreen } from '@fepkg/icon-park-react';
import { useMemoizedFn } from 'ahooks';
import { useEscDown } from '@/common/hooks/useEscDown';
import { useMaximize } from '@/common/hooks/useMaximize';
import { DraggableHeader } from '@/components/HeaderBar';
import { useDialogLayout } from './hooks';
import { DialogLayoutHeaderProps } from './types';

type ControllerProps = Pick<DialogLayoutHeaderProps, 'controllers' | 'extraControllers' | 'onCancel'> & {
  /** 是否为最大化 */
  maximize: boolean;
  /** 切换最大化/最小化时的回调 */
  onMaximize: VoidFunction;
  /** 透明功能键 */
  transIcon: boolean;
};

const Controller = ({ maximize, onMaximize, controllers, extraControllers, onCancel, transIcon }: ControllerProps) => {
  const handleMinimize = useMemoizedFn(() => {
    window.Main?.minimize();
  });

  return (
    <div
      className="flex items-center h-full flex-shrink-0 gap-3 undraggable pr-3"
      onClick={e => e.stopPropagation()}
      onDoubleClick={e => e.stopPropagation()}
    >
      {/* extra controllers */}
      {Children.map(extraControllers, child => {
        if (!child) return null;
        if (!isValidElement<HTMLElement>(child)) return child;
        return cloneElement(child, {
          className: child?.props?.className
        });
      })}

      {/* default controllers */}
      {controllers?.slice(0, 3)?.map(item => {
        let icon: ReactNode = null;
        let onBtnClick: () => void;

        switch (item) {
          case 'min':
            icon = <IconMinus />;
            onBtnClick = handleMinimize;
            break;
          case 'max':
            icon = maximize ? <IconOffScreen /> : <IconFullScreen />;
            onBtnClick = onMaximize;
            break;
          case 'close':
            icon = <IconClose />;
            onBtnClick = () => onCancel?.();
            break;
          default:
            return null;
        }

        return (
          <Button.Icon
            key={item}
            text
            type={transIcon ? 'transparent' : 'gray'}
            icon={icon}
            onClick={onBtnClick}
          />
        );
      })}
    </div>
  );
};

export const Header = ({
  children,
  className,
  draggable = true,
  keyboard = true,
  background = 'bg-gray-800',
  controllers = ['min', 'close'],
  extraControllers,
  onCancel
}: DialogLayoutHeaderProps) => {
  const { cancel } = useDialogLayout();
  const { isMaximize, toggleMaximize } = useMaximize();
  // 当背景色不为默认色时，采用透明样式的Icon
  const transIcon = background != 'bg-gray-800';

  const showController = !!controllers.length || !!extraControllers;

  const handleCancel = useMemoizedFn(() => {
    if (onCancel) onCancel();
    else cancel();
  });

  const handleHeaderDblClick = () => {
    if (controllers.includes('max')) toggleMaximize();
  };

  useEscDown(() => {
    const shouldCancel = typeof keyboard === 'function' ? keyboard() : keyboard;
    if (shouldCancel) handleCancel();
  });

  return (
    <DraggableHeader
      className={cx(
        'flex justify-between items-center gap-6 flex-shrink-0 text-white select-none [&_*]:select-none',
        'border border-transparent border-solid border-b-gray-600 h-12 pl-3',
        background,
        className
      )}
      draggable={draggable}
      onDoubleClick={handleHeaderDblClick}
    >
      <div className="flex-1 max-w-[89%]">{children}</div>
      {showController ? (
        <Controller
          maximize={isMaximize}
          controllers={controllers}
          extraControllers={extraControllers}
          onMaximize={toggleMaximize}
          transIcon={transIcon}
          onCancel={handleCancel}
        />
      ) : null}
    </DraggableHeader>
  );
};
