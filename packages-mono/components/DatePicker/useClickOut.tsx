import { MutableRefObject, useEffect } from 'react';

export function useClickOut(
  containerRef: MutableRefObject<HTMLDivElement | null>,
  dropdownRef: MutableRefObject<HTMLDivElement | null>,
  isOpen: boolean,
  callback: () => void
) {
  useEffect(() => {
    function clickHandler(event: MouseEvent) {
      const container = containerRef.current;
      const dropdown = dropdownRef.current;
      const target = event.target as Node;
      if (isOpen && dropdown && !dropdown.contains(target) && container && !container.contains(target)) {
        callback();
      }
    }

    window.addEventListener('mousedown', clickHandler);
    return () => {
      window.removeEventListener('mousedown', clickHandler);
    };
  }, [callback, containerRef, isOpen, dropdownRef]);
}
