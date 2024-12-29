import cx from 'classnames';
import { usePropsValue } from '@fepkg/common/hooks';
import { FloatingPortal } from '@floating-ui/react';
import { DrawerProps } from './types';

export const Drawer = ({
  className,
  maskCloseable = true,
  destroyOnClose = true,
  defaultOpen = false,
  open,
  onOpenChange,
  onMaskClick,
  children
}: DrawerProps) => {
  const [innerOpen, setInnerOpen] = usePropsValue({
    defaultValue: defaultOpen,
    value: open,
    onChange: onOpenChange
  });

  // const delayOpen = useDelayOpen(innerOpen);

  const handleMaskClick = () => {
    if (maskCloseable) setInnerOpen(false);
    onMaskClick?.();
  };

  if (!innerOpen && destroyOnClose) return null;

  return (
    <FloatingPortal id="floating-container">
      {/* wrapper */}
      <div className="z-floating fixed top-0 left-0 w-full h-full">
        {/* mask */}
        <div
          className="absolute top-0 left-0 w-full h-full bg-black/40"
          onClick={handleMaskClick}
        />

        {/* container */}
        <div
          className={cx(
            'absolute top-0 right-0 h-full bg-gray-700 border border-r-0 border-solid border-gray-600 rounded-l-2xl drop-shadow-system',
            className
          )}
        >
          {children}
        </div>
      </div>
    </FloatingPortal>
  );
};
