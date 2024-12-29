import { useRef } from 'react';
import { createPortal } from 'react-dom';
import { FCWithChildren } from '@fepkg/common/types';

type PortalProps = {
  rootId: string;
  targetElement?: HTMLElement;
};

export const Portal: FCWithChildren<PortalProps> = ({ rootId, targetElement, children }) => {
  const target = useRef(document.getElementById(rootId));

  if (!target.current) {
    requestAnimationFrame(() => {
      target.current = document.getElementById(rootId);

      if (!target.current) {
        target.current = document.createElement('div');
        target.current.setAttribute('id', rootId);
        document.body.appendChild(target.current);
      }
    });
  } else if (targetElement && target.current !== targetElement) {
    target.current = targetElement;
  }

  return createPortal(children, target.current ?? document.createElement('div'));
};
