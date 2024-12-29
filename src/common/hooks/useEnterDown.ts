import { useMemo } from 'react';
import { KeyboardKeys } from '@fepkg/common/utils/keyboard';
import { DEFAULT_KEY_DOWN_THROTTLE_WAIT } from '@fepkg/components/Button/types';
import { hasDropdownEl } from '@fepkg/components/utils/element';
import { useMemoizedFn } from 'ahooks';
import { debounce } from 'lodash-es';
import { useEventListener } from 'usehooks-ts';

/** 回车按下时的检测是否有下拉框存在，并执行相关回车回调 */
export const useEnterDown = (onEnterDown?: (evt: KeyboardEvent) => void) => {
  const onMemoizedEnterDown = useMemoizedFn(evt => onEnterDown?.(evt));
  const throttleEnterDown = useMemo(
    () =>
      debounce(evt => onMemoizedEnterDown?.(evt), DEFAULT_KEY_DOWN_THROTTLE_WAIT, {
        leading: true,
        trailing: false
      }),
    [onMemoizedEnterDown]
  );

  useEventListener('keydown', evt => {
    switch (evt.key) {
      case KeyboardKeys.Enter: {
        // 如果当前聚焦的是确认/取消按钮，则走按钮默认的事件
        if (document.activeElement?.tagName === 'BUTTON') {
          const innerHTML = document.activeElement?.innerHTML;
          if (/确定|取消/.test(innerHTML)) return;
        }

        if (hasDropdownEl()) return;

        evt.stopPropagation();
        throttleEnterDown?.(evt);
        break;
      }
      default:
        break;
    }
  });
};
