import cx from 'classnames';

export const getMenuCls = (className?: string, submenu?: boolean) => {
  return cx(
    'z-floating rounded-sm outline-none drop-shadow-dropdown undraggable border border-solid border-gray-500',
    'bg-gray-600 !rounded-lg p-1 min-w-[100px]',
    submenu && '!-ml-1',
    className
  );
};

export const getMenuItemCls =
  (className?: string) =>
  ({ disabled, submenu }: { disabled: boolean; submenu?: boolean }) => {
    return cx(
      'w-full h-6 text-sm text-gray-200 bg-transparent outline-none truncate select-none undraggable border border-transparent border-solid rounded-lg',
      'px-3 flex items-center',
      submenu && 'pr-1 inline-flex justify-between items-center',
      disabled ? 'cursor-not-allowed' : 'cursor-pointer hover:text-white hover:bg-gray-500',
      className
    );
  };
