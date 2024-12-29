import { isTextInputElement } from '@fepkg/common/utils/element';
import { registeredHotkeys } from '@fepkg/common/utils/hotkey/register';
import { UserHotkeyFunction } from '@fepkg/services/types/enum';
import { useEventListener } from 'usehooks-ts';
import { getCode } from '@/common/utils/hotkey';

export const useHotkeys = (hotkeyCallback: () => void) => {
  // 行情切换操作
  // hotkey不支持单键与tab,故用原生事件
  useEventListener('keydown', evt => {
    const marketRotationCode = getCode(registeredHotkeys[UserHotkeyFunction.UserHotkeyMarketRotation] || '');

    // 焦点在input中不触发快捷键的操作，此处绑定的是所有按键，不判断会导致input无法输入，没有报价版面权限也不执行动作
    if (isTextInputElement(document.activeElement)) return;

    // 当焦点聚焦在tab上时，如何阻止空格默认的点击行为
    const active = document.activeElement as HTMLElement;
    active?.blur?.();

    if (evt.keyCode === marketRotationCode) {
      evt.preventDefault(); // 需要避免触发按键自身的动作-(空格翻页，tab切换聚焦)
      hotkeyCallback();
    }
  });

  return null;
};
