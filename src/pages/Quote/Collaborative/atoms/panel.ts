import { PopoverPosition } from '@fepkg/common/types';
import { atom } from 'jotai';

export const ctxMenuVisibleAtom = atom(false);
export const ctxMenuPositionAtom = atom<PopoverPosition>({ x: 0, y: 0 });
