import { useCallback, useEffect, useRef } from 'react';
import { hasModalVisible } from '@fepkg/common/hooks';
import { isTextInputElement } from '@fepkg/common/utils/element';
import { hasRegistered } from '@fepkg/common/utils/hotkey/register';
import { KeyHandler } from '@fepkg/common/utils/hotkey/types';
import { useMemoizedFn } from 'ahooks';
import { HotkeyScope, getAlphabetNumberKeys } from '@/common/utils/hotkey';
import hotkeys from '@/common/utils/hotkey/hotkeys-js';
import { useInput } from './InputProvider';

/** A-Za-z0-9 */
const TARGET_KEYS = [...getAlphabetNumberKeys().keys].join(',');

export const useHotkey = () => {
  const { displayQuickSearch, setDisplayQuickSearch } = useInput();
  const searchRef = useRef<HTMLInputElement>(null);

  const hotkeyHandle = useMemoizedFn(() => {
    if (displayQuickSearch) return;
    if (isTextInputElement(document.activeElement)) return;
    setDisplayQuickSearch(true);

    if (searchRef.current && searchRef.current !== document.activeElement) {
      searchRef.current.focus();
    }
  });

  const hotkeyCallback: KeyHandler = useCallback(
    (_, e) => {
      if (hasRegistered(e.key)) return;
      if (hasModalVisible()) return;
      hotkeyHandle();
    },
    [hotkeyHandle]
  );

  useEffect(() => {
    hotkeys(TARGET_KEYS, { scope: HotkeyScope.main, element: document.body }, hotkeyCallback);

    return () => hotkeys.unbind(TARGET_KEYS, HotkeyScope.main, hotkeyCallback);
  }, [hotkeyCallback]);

  return { searchRef };
};
