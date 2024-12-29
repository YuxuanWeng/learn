import { useCallback, useEffect, useRef } from 'react';
import { hasModalVisible } from '@fepkg/common/hooks';
import { isTextInputElement } from '@fepkg/common/utils/element';
import { hasRegistered } from '@fepkg/common/utils/hotkey/register';
import { KeyHandler } from '@fepkg/common/utils/hotkey/types';
import { useMemoizedFn } from 'ahooks';
import { HotkeyScope, getAlphabetNumberKeys } from '@/common/utils/hotkey';
import hotkeys from '@/common/utils/hotkey/hotkeys-js';

/** A-Za-z0-9 */
const TARGET_KEYS = [...getAlphabetNumberKeys().keys].join(',');

export const useHotkey = (
  onInputValueChange: (val: string) => void,
  onInputValueCacheChange?: (val: string) => void
) => {
  const searchRef = useRef<HTMLInputElement>(null);

  const focusSearch = useMemoizedFn(() => {
    if (isTextInputElement(document.activeElement)) return;

    if (searchRef.current && searchRef.current !== document.activeElement) {
      onInputValueChange('');
      onInputValueCacheChange?.('');
      searchRef.current.focus();
    }
  });

  const hotkeyCallback: KeyHandler = useCallback(
    (_, e) => {
      if (hasRegistered(e.key)) return;
      if (hasModalVisible()) return;
      focusSearch();
    },
    [focusSearch]
  );

  useEffect(() => {
    hotkeys(TARGET_KEYS, { scope: HotkeyScope.main, element: document.body }, hotkeyCallback);

    return () => hotkeys.unbind(TARGET_KEYS, HotkeyScope.main, hotkeyCallback);
  }, [hotkeyCallback]);

  return { searchRef };
};
