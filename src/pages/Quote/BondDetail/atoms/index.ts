import { atom, useAtomValue } from 'jotai';

export const pollingActiveAtom = atom(true);
export const usePollingActiveValue = () => useAtomValue(pollingActiveAtom);
