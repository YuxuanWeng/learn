import { atom } from 'jotai';

export const draggableAtom = atom<
  | {
      dragStart: () => void;
      dragEnd: () => void;
    }
  | undefined
>(undefined);
