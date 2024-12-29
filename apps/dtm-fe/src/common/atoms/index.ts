import { atom, useAtomValue, useSetAtom } from 'jotai';

export const GLOBAL_SCOPE = Symbol('global-score');

export const flagSearchChildAtom = atom(true);
export const useFlagSearchChild = () => useAtomValue(flagSearchChildAtom, GLOBAL_SCOPE);
export const useSetFlagSearchChild = () => useSetAtom(flagSearchChildAtom, GLOBAL_SCOPE);
