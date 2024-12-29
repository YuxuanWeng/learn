import { MouseEventHandler, forwardRef } from 'react';
import cx from 'classnames';
import { Button } from '@fepkg/components/Button';
import {
  Content as PopoverContent,
  PopoverContext,
  Trigger,
  usePopover,
  usePopoverFloat
} from '@fepkg/components/Popover';
import { IconCautionFilled, IconCheckCircleFilled, IconDeleteFilled } from '@fepkg/icon-park-react';
import { PopconfirmProps } from './types';

const iconMap = {
  success: <IconCheckCircleFilled className="text-green-100 mt-1" />,
  warning: <IconCautionFilled className="text-orange-100 mt-1" />,
  danger: <IconDeleteFilled className="text-danger-100 mt-1" />
};

const Content = forwardRef<HTMLDivElement, PopconfirmProps>(
  (
    {
      children,
      floatingProps,
      floatingFocus = true,
      type = 'warning',
      icon = iconMap[type],
      confirmBtnProps,
      cancelBtnProps,
      onConfirm,
      onCancel,
      ...restProps
    },
    ref
  ) => {
    const popover = usePopover();

    const handleConfirm: MouseEventHandler<HTMLButtonElement> = evt => {
      popover?.setInnerOpen(false);
      onConfirm?.(evt);
    };

    const handleCancel: MouseEventHandler<HTMLButtonElement> = evt => {
      popover?.setInnerOpen(false);
      onCancel?.(evt);
    };

    return (
      <PopoverContent
        ref={ref}
        floatingProps={{ ...floatingProps, className: cx('s-popconfirm', floatingProps?.className) }}
        floatingFocus={floatingFocus}
        {...restProps}
      >
        <div className="flex gap-3 text-gray-000 text-sm">
          {icon}
          {children}
        </div>

        <div
          className="flex justify-end gap-3"
          // 这里阻止冒泡是为了不让按钮的操作冒泡到 Popconfirm 的 target 内误触发其 onClick 事件
          onClick={evt => evt.stopPropagation()}
        >
          <Button
            type="gray"
            ghost
            className="w-11 h-6 px-0"
            onClick={handleCancel}
            {...cancelBtnProps}
          >
            {cancelBtnProps?.label ?? '取消'}
          </Button>
          <Button
            type={type === 'danger' ? 'danger' : 'primary'}
            className="w-11 h-6 px-0"
            onClick={handleConfirm}
            {...confirmBtnProps}
          >
            {confirmBtnProps?.label ?? '确认'}
          </Button>
        </div>
      </PopoverContent>
    );
  }
);

export const Popconfirm = (props: PopconfirmProps) => {
  const { children, content, onPopupClick } = props;
  const popover = usePopoverFloat(props);
  return (
    <PopoverContext.Provider value={popover}>
      {children && <Trigger onClick={onPopupClick}>{children}</Trigger>}
      {content && (
        <Content
          ref={props.contentRef}
          {...props}
        >
          {content}
        </Content>
      )}
    </PopoverContext.Provider>
  );
};
