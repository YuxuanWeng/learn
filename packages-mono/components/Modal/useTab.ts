import { KeyboardEvent, useId } from 'react';
import { KeyboardKeys } from '@fepkg/common/utils/keyboard';
import { tabbable } from 'tabbable';

export const useTab = (visible?: boolean, keyboard?: boolean, closable?: boolean, onCancel?: () => void) => {
  const wrapperId = useId();

  const handleWrapperKeyDown = (evt: KeyboardEvent<HTMLDivElement>) => {
    // 保持 focus 在 modal 内部
    if (visible) {
      if (keyboard && evt.key === KeyboardKeys.Escape) {
        evt.stopPropagation();
        onCancel?.();
      }

      if (evt.key === KeyboardKeys.Tab) {
        const next = !evt.shiftKey;
        const wrapperEl = document.getElementById(wrapperId);

        if (wrapperEl) {
          const { activeElement } = document;

          const tabbableEls = tabbable(wrapperEl, { getShadowRoot: true, displayCheck: 'full' });

          // Ant Modal 为了做了让 focus 聚焦在内部，会使用两个 tabIndex 为 0 的隐藏元素把 Modal 的内容包裹起来：

          // <div tabIndex={0} />
          // {children}
          // <div tabIndex={0} />

          // 所以在 Ant Modal 内第一个能够聚焦的元素，是第一个 <div tabIndex={0} />，
          // 最后一个能够聚焦的元素，是第二个 <div tabIndex={0} />

          // 所以如果有 closeIcon，Modal 第一个应该聚焦的元素就是 tabbableEls 的第三个，没有则是第二个
          // Modal 最后一个应该聚焦的元素就是 tabbableEls 的倒数第二个

          /** 第一个需要 tab 聚焦的元素 */
          const firstShouldTabEl = closable ? tabbableEls.at(2) : tabbableEls.at(1);
          /** 倒数第二个可以使用 tab 聚焦的元素 */
          const lastShouldTabEl = tabbableEls.at(-2);

          /** 正在聚焦 wrapper 元素 */
          const isFocusingWrapperEl = activeElement === wrapperEl;

          if (next && (isFocusingWrapperEl || activeElement === lastShouldTabEl)) {
            evt.preventDefault();
            firstShouldTabEl?.focus();
          } else if (!next && (isFocusingWrapperEl || activeElement === firstShouldTabEl)) {
            evt.preventDefault();
            lastShouldTabEl?.focus();
          }
        }
      }
    }
  };

  return { wrapperId, handleWrapperKeyDown };
};
