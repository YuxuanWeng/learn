import { useEffect } from 'react';
import { Portal } from '@fepkg/components/Portal';
import IPCEventEnum from 'app/types/IPCEvents';
import { debounce } from 'lodash-es';
import { useWindowDisabledState } from '@/common/atoms';

const handleMouseWhell = evt => {
  if (evt.ctrlKey || evt.metaKey) {
    evt.preventDefault();
    return false;
  }
  return true;
};

const handleMouseUp = evt => {
  if (evt.button === 3 || evt.button === 4) {
    evt.preventDefault();
  }
};

const useWindowDisabled = () => {
  const [windowDisabled, setWindowDisabled] = useWindowDisabledState();

  useEffect(() => {
    const { on, remove } = window.Main;
    on(IPCEventEnum.SetWindowIsEnable, (...args: unknown[]) => setWindowDisabled(!args[0]));

    document.addEventListener('mousewhell', handleMouseWhell);
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      document.removeEventListener('mousewhell', handleMouseWhell);
      window.removeEventListener('mouseup', handleMouseUp);
      remove(IPCEventEnum.SetWindowIsEnable);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { windowDisabled };
};

const handleMask = debounce(() => window.Main.invoke(IPCEventEnum.SetLockWindowFocus), 500);

export const WindowDisabledMask = () => {
  const { windowDisabled } = useWindowDisabled();

  return (
    <Portal rootId="window-disabled-mask">
      {windowDisabled ? (
        <div
          className="fixed inset-0 z-mask bg-black opacity-25"
          onClick={handleMask}
        />
      ) : null}
    </Portal>
  );
};
