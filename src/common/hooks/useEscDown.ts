import { KeyboardKeys } from '@fepkg/common/utils/keyboard';
import { hasDropdownEl } from '@fepkg/components/utils/element';
import { useEventListener } from 'usehooks-ts';

/** 回车按下时的检测是否有下拉框存在，并执行相关回车回调 */
export const useEscDown = (onCancel?: () => void) => {
  useEventListener('keydown', evt => {
    if (evt.key === KeyboardKeys.Escape) {
      if (hasDropdownEl()) return;

      evt.stopPropagation();
      onCancel?.();
    }
  });
};
