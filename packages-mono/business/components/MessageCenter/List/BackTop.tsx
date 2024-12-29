import { MouseEvent, forwardRef, useState } from 'react';
import cx from 'classnames';
import { isElement } from '@fepkg/common/utils/element';
import { Button } from '@fepkg/components/Button';
import { IconUpDouble } from '@fepkg/icon-park-react';
import { useEventListener } from 'usehooks-ts';
import { MessageBackTopProps } from '../types';

export const MESSAGE_HEIGHT = 96;

export const BackTop = forwardRef<HTMLButtonElement, MessageBackTopProps>(
  ({ target, children, onClick, onTargetScroll, ...restProps }, ref) => {
    const [visible, setVisible] = useState(false);

    useEventListener(
      'scroll',
      evt => {
        const el = evt.target;
        if (!isElement(el)) return;

        const { scrollTop } = el;
        onTargetScroll?.(evt);
        if (scrollTop > MESSAGE_HEIGHT) setVisible(prev => prev || true);
        else setVisible(prev => (!prev ? prev : false));
      },
      target ?? window
    );

    const handleClick = (evt: MouseEvent<HTMLButtonElement>) => {
      if (onClick) {
        onClick?.(evt);
        return;
      }

      if (target.current) target.current?.scrollTo?.({ top: 0 });
      else window.scrollTo({ top: 0 });
    };

    return (
      <Button
        ref={ref}
        className={cx(
          'absolute top-3 right-3 flex-row-reverse h-8 !bg-gray-500 !border-gray-400 rounded-2xl',
          !children && 'w-8 p-0',
          !visible && 'hidden'
        )}
        type="primary"
        text
        icon={<IconUpDouble />}
        onClick={handleClick}
        {...restProps}
      >
        {children}
      </Button>
    );
  }
);
