import { KeyboardKeys } from '@fepkg/common/utils/keyboard';
import { useEventListener } from 'ahooks';
import { useHead } from '../providers/HeadProvider';

export const useHotKeys = () => {
  const { searchRef } = useHead();
  const handleKeydown = (evt: KeyboardEvent) => {
    if (evt.code === KeyboardKeys.CodeKeyF && (evt.ctrlKey || evt.metaKey)) {
      searchRef.current?.focus();
    }
  };
  useEventListener('keydown', handleKeydown);
};
