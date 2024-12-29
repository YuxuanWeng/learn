import { hasRegistered } from '@fepkg/common/utils/hotkey/register';
import { KeyboardKeys } from '@fepkg/common/utils/keyboard';
import { useEventListener } from 'ahooks';
import { useBridgeContext } from '../providers/BridgeProvider';
import { ArrowAreaEnum, TypeBridge } from '../types';

export const useBridgeArrowSelect = ({ bridgeList, disabled }: { bridgeList: TypeBridge[]; disabled?: boolean }) => {
  const { bridge, activeArea, setBridge } = useBridgeContext();
  const list = bridgeList.map(item => item.bridge);

  const { length } = list;

  const handleKeydown = (evt: KeyboardEvent) => {
    if ((evt.key !== KeyboardKeys.ArrowDown && evt.key !== KeyboardKeys.ArrowUp) || activeArea !== ArrowAreaEnum.Bridge)
      return;

    if (disabled) return;

    evt.stopPropagation();

    let nextIndex = 0;

    // 选中下一个
    if (evt.key === KeyboardKeys.ArrowDown) {
      if (hasRegistered('down')) return;
      evt.preventDefault();
      const index = list.findIndex(item => item?.bridge_inst_id === bridge?.bridge_inst_id && list?.length);
      nextIndex = index == length - 1 ? 0 : index + 1;
    }

    // 选中上一个
    if (evt.key === KeyboardKeys.ArrowUp && activeArea === ArrowAreaEnum.Bridge && list?.length) {
      if (hasRegistered('up')) return;
      evt.preventDefault();
      const index = list.findIndex(item => item?.bridge_inst_id === bridge?.bridge_inst_id);
      nextIndex = index > 0 ? index - 1 : length - 1;
    }

    setBridge(list[nextIndex]);
  };

  useEventListener('keydown', handleKeydown);
};
