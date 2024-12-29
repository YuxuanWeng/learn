import { RefObject, useRef } from 'react';
import { isTextInputElement } from '@fepkg/common/utils/element';
import { hasRegistered } from '@fepkg/common/utils/hotkey/register';
import { useEventListener } from 'usehooks-ts';

export const useForbidAllSelect = () => {
  const ref = useRef(null) as RefObject<HTMLDivElement>;
  const el = ref.current;
  useEventListener('keydown', (evt: KeyboardEvent) => {
    if (!el?.contains(evt.target as Node) && (evt.ctrlKey || evt.metaKey) && evt.code === 'KeyA') {
      const evtTarget = evt.target as any;

      if (isTextInputElement(evtTarget)) {
        return;
      }

      if (hasRegistered('cmd+A') || hasRegistered('ctrl+A')) return;
      evt.preventDefault();
      evt.stopPropagation();
    }
  });
  return [ref] as const;
};
