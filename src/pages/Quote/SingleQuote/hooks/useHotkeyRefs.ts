import { RefObject, useCallback, useEffect, useMemo } from 'react';
import { Side, UserHotkeyFunction } from '@fepkg/services/types/enum';
import { userHotkeyManager } from '@/common/utils/hotkey';

export type FlagsBtnRefs = {
  starRef: RefObject<HTMLElement>;
  doubleStarRef: RefObject<HTMLElement>;
  ocoRef: RefObject<HTMLElement>;
  packageRef: RefObject<HTMLElement>;
};

type IFlagsProps = {
  side: Side;
  disabled?: boolean;
  isFocusing?: () => boolean;
};

export const useHotkeyRefs = (
  props: { [Side.SideBid]?: FlagsBtnRefs; [Side.SideBid]?: FlagsBtnRefs } & IFlagsProps
) => {
  const { side, isFocusing, disabled } = props;
  const { starRef, doubleStarRef, ocoRef, packageRef } = props[props.side];
  const pairs: [RefObject<HTMLElement>, UserHotkeyFunction][] = useMemo(
    () => [
      [starRef, UserHotkeyFunction.UserHotkeyQuoteAddStar],
      [doubleStarRef, UserHotkeyFunction.UserHotkeyQuoteAddDoubleStar],
      [ocoRef, UserHotkeyFunction.UserHotkeyOCO],
      [packageRef, UserHotkeyFunction.UserHotkeyPackageKey]
    ],
    [doubleStarRef, ocoRef, packageRef, starRef]
  );

  const onBindHotkeys = useCallback(() => {
    pairs.forEach(([refs, func]) => {
      userHotkeyManager.register(
        func,
        () => {
          // 如果当前方向未获取焦点，则不模拟点击
          if (isFocusing?.()) refs.current?.click();
        },
        side.toString()
      );
    });
  }, [isFocusing, pairs, side]);

  const onUnBindHotkeys = useCallback(() => {
    pairs.forEach(([, func]) => {
      userHotkeyManager.unRegister(func);
    });
  }, [pairs]);

  useEffect(() => {
    if (!disabled) onBindHotkeys();
    return () => {
      onUnBindHotkeys();
    };
  }, [onBindHotkeys, onUnBindHotkeys, disabled]);
};
