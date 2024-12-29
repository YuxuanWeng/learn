import { SetStateAction } from 'react';
import { atom, useAtomValue, useSetAtom } from 'jotai';

export const traderManagementSearchingAtom = atom<string>('');

export const useTraderManegeMentSearchingValue: () => [string, (a: SetStateAction<string>) => void] = () => {
  return [useAtomValue(traderManagementSearchingAtom), useSetAtom(traderManagementSearchingAtom)];
};
