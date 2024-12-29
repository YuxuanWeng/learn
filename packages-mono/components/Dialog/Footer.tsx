import cx from 'classnames';
import { KeyboardKeys } from '@fepkg/common/utils/keyboard';
import { Button } from '../Button';
import { Size } from '../types';
import { DialogFooterProps } from './types';

const sizeClsMap: Record<Size, string> = {
  md: 'h-12 px-3',
  sm: 'h-12 px-3',
  xs: 'h-8 px-2'
};

export const btnCls = 'w-[76px] h-7 transition-none rounded-lg flex items-center whitespace-nowrap';

export const Footer = ({
  children,
  className,
  style,
  size = 'sm',
  background = 'bg-gray-800',
  centered,
  showBtn = true,
  btnMirrored,
  confirmBtnProps,
  cancelBtnProps,
  onConfirm,
  onCancel
}: DialogFooterProps) => {
  const sizeCls = sizeClsMap[size];

  return (
    <footer
      style={style}
      className={cx(
        'flex flex-shrink-0 items-center border border-solid border-transparent border-t-gray-600',
        centered ? 'justify-center' : 'justify-between',
        background,
        sizeCls,
        className
      )}
    >
      {children ?? <div />}
      {showBtn && (
        <div className={cx('flex gap-3', btnMirrored && 'flex-row-reverse')}>
          <Button
            type="gray"
            ghost
            {...cancelBtnProps}
            onClick={onCancel}
            onKeyDown={evt => {
              if (evt.key === KeyboardKeys.Enter) evt.stopPropagation();
              cancelBtnProps?.onKeyDown?.(evt);
            }}
            className={cx(btnCls, cancelBtnProps?.className)}
          >
            {cancelBtnProps?.label ?? '取消'}
          </Button>
          <Button
            type="primary"
            onClick={onConfirm}
            {...confirmBtnProps}
            className={cx(btnCls, confirmBtnProps?.className)}
          >
            {confirmBtnProps?.label ?? '确定'}
          </Button>
        </div>
      )}
    </footer>
  );
};
