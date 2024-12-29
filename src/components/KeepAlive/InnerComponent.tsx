import { memo, useEffect, useRef, useState } from 'react';
import type { RefObject } from 'react';
import { createPortal } from 'react-dom';
import type { FCWithChildren } from '@fepkg/common/types';
import { captureMessage } from '@sentry/react';

export type InnerComponentProps = {
  name: string;
  isActive: boolean;
  renderContainer: RefObject<HTMLDivElement>;
  className?: string;
  onInActive?: (name: string) => void;
};

export const InnerComponent: FCWithChildren<InnerComponentProps> = memo(
  ({ name, isActive, renderContainer, className, onInActive, children }) => {
    const [targetElement] = useState(() => document.createElement('div'));

    // 增加一个 ref 记录组件是否 “被激活过”，用于兼容 Lazy component
    const activated = useRef(false);
    activated.current = activated.current || isActive;

    useEffect(() => {
      try {
        if (isActive) {
          renderContainer.current?.appendChild(targetElement);
        } else {
          renderContainer.current?.removeChild(targetElement);
        }
      } catch (err) {
        captureMessage('KeepAlive Error', { extra: { err } });
      }
    }, [isActive, renderContainer, targetElement]);

    useEffect(() => {
      if (!isActive) {
        onInActive?.(name);
      }
    }, [name, isActive, onInActive]);

    useEffect(() => {
      if (className) targetElement.setAttribute('class', className);
    }, [className, targetElement]);

    useEffect(() => {
      targetElement.setAttribute('data-name', name);
    }, [name, targetElement]);

    // 如果 “被激活过”，才渲染 children
    return activated.current ? createPortal(children, targetElement) : null;
  }
);
