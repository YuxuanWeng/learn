import { RefObject, useEffect, useRef } from 'react';
import { UserHotkeyFunction } from '@fepkg/services/types/enum';
import { userHotkeyManager } from '@/common/utils/hotkey';

export const useDateHotkeyRefs = () => {
  const plus0Ref = useRef<HTMLInputElement>(null);
  const plus1Ref = useRef<HTMLInputElement>(null);
  const tomorrowPlus0Ref = useRef<HTMLInputElement>(null);
  const tomorrowPlus1Ref = useRef<HTMLInputElement>(null);
  const mondayRef = useRef<HTMLInputElement>(null);
  const tuesdatyRef = useRef<HTMLInputElement>(null);
  const wednesdayRef = useRef<HTMLInputElement>(null);
  const thursdayRef = useRef<HTMLInputElement>(null);
  const fridayRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const pairs: [RefObject<HTMLElement>, UserHotkeyFunction][] = [
      [plus0Ref, UserHotkeyFunction.UserHotkeyQuoteAddZero],
      [plus1Ref, UserHotkeyFunction.UserHotkeyQuoteAddOne],
      [tomorrowPlus0Ref, UserHotkeyFunction.UserHotkeyQuoteTomorrowAddZero],
      [tomorrowPlus1Ref, UserHotkeyFunction.UserHotkeyQuoteTomorrowAddOne],
      [mondayRef, UserHotkeyFunction.UserHotkeyQuoteMonday],
      [tuesdatyRef, UserHotkeyFunction.UserHotkeyQuoteTuesday],
      [wednesdayRef, UserHotkeyFunction.UserHotkeyQuoteWednesday],
      [thursdayRef, UserHotkeyFunction.UserHotkeyQuoteThursday],
      [fridayRef, UserHotkeyFunction.UserHotkeyQuoteFriday]
    ];

    pairs.forEach(([ref, func]) => {
      userHotkeyManager.register(Number(func), () => {
        ref.current?.click();
      });
    });

    return () =>
      pairs.forEach(([, func]) => {
        userHotkeyManager.unRegister(func);
      });
  }, [
    plus0Ref,
    plus1Ref,
    tomorrowPlus0Ref,
    tomorrowPlus1Ref,
    mondayRef,
    tuesdatyRef,
    wednesdayRef,
    thursdayRef,
    fridayRef
  ]);

  return [
    plus0Ref,
    plus1Ref,
    tomorrowPlus0Ref,
    tomorrowPlus1Ref,
    mondayRef,
    tuesdatyRef,
    wednesdayRef,
    thursdayRef,
    fridayRef
  ];
};
