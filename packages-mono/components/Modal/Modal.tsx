import { KeyboardEvent, ReactNode, useMemo, useRef, useState } from 'react';
import { mergeRefs } from 'react-merge-refs';
import cx from 'classnames';
import { Modal as AntModal } from 'antd';
import { KeyboardKeys } from '@fepkg/common/utils/keyboard';
import { Button } from '@fepkg/components/Button';
import { Dialog } from '@fepkg/components/Dialog';
import { IconClose } from '@fepkg/icon-park-react';
import { useMemoizedFn } from 'ahooks';
import { ModalRender } from './ModalRender';
import { ModalProps } from './types';
import { useTab } from './useTab';

export const Modal = ({
  visible,
  className,
  wrapProps,
  wrapClassName,
  titleCls,
  background = 'bg-gray-700',
  title,
  width,
  draggable = true,
  keyboard = false,
  centered = true,
  closable = true,
  maskClosable = false,
  destroyOnClose = true,
  footer,
  footerProps,
  footerChildren,
  confirmByEnter,
  modalRender,
  onConfirm,
  onCancel,
  onKeyDown,
  ...restProps
}: ModalProps) => {
  const confirmBtnRef = useRef<HTMLButtonElement>(null);
  const confirmBtnRefs = useMemo(
    () =>
      mergeRefs(
        footerProps?.confirmBtnProps?.ref ? [footerProps?.confirmBtnProps?.ref, confirmBtnRef] : [confirmBtnRef]
      ),
    [footerProps?.confirmBtnProps?.ref]
  );
  const [disabled, setDisabled] = useState(false);

  const renderModal = useMemoizedFn((node: ReactNode) => (
    <ModalRender
      visible={visible}
      disabled={!draggable || disabled}
    >
      {modalRender ? modalRender(node) : node}
    </ModalRender>
  ));

  const { wrapperId, handleWrapperKeyDown } = useTab(visible, keyboard, closable, onCancel);

  const handleKeyDown = (evt: KeyboardEvent<HTMLDivElement>) => {
    if (evt.key === KeyboardKeys.Enter) {
      if (!visible || !confirmByEnter) return;
      evt.stopPropagation();
      onConfirm?.();
    }
    onKeyDown?.(evt);
    handleWrapperKeyDown(evt);
  };

  return (
    <AntModal
      visible={visible}
      // 新UI边框为2px
      width={typeof width === 'number' ? width + 2 : width}
      title={
        // eslint-disable-next-line jsx-a11y/mouse-events-have-key-events
        <div
          className={cx(
            'w-full h-full px-3 text-md bg-gray-800 flex flex-col justify-center select-none',
            draggable ? 'cursor-move' : 'cursor-default',
            titleCls
          )}
          onMouseOut={() => {
            setDisabled(true);
          }}
          onMouseOver={() => {
            if (disabled) setDisabled(false);
          }}
          onFocus={() => void 0}
          onBlur={() => void 0}
        >
          {title}
        </div>
      }
      wrapClassName={cx('undraggable', wrapClassName)}
      transitionName=""
      maskTransitionName=""
      className={cx(
        className,
        '[&_.ant-modal-header]:p-0',
        background === 'bg-white' &&
          '[&_.ant-modal-content]:bg-white [&_.ant-modal-content]:border-gray-200 [&_.ant-modal-header]:bg-white [&_.ant-modal-body]:bg-white'
      )}
      closeIcon={
        <Button.Icon
          text
          icon={<IconClose />}
        />
      }
      closable={closable}
      keyboard={keyboard}
      centered={centered}
      destroyOnClose={destroyOnClose}
      maskClosable={maskClosable}
      footer={
        footer ??
        (footer !== null && (
          <Dialog.Footer
            {...footerProps}
            confirmBtnProps={{ ...footerProps?.confirmBtnProps, ref: confirmBtnRefs }}
            onConfirm={onConfirm}
            onCancel={onCancel}
          >
            {footerChildren}
          </Dialog.Footer>
        ))
      }
      wrapProps={{ id: wrapperId, onKeyDown: handleKeyDown, ...wrapProps }}
      modalRender={renderModal}
      onCancel={onCancel}
      {...restProps}
      maskStyle={{ ...restProps?.maskStyle, borderRadius: 8 }}
    />
  );
};
