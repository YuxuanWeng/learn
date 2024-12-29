import { atom } from 'jotai';

export const addBrokerMdlCancelTimestampAtom = atom<number>(Date.now());
