import { Side } from '@fepkg/services/types/enum';
import { atom } from 'jotai';
import { OptimalTableColumn } from './types';

export const selectedSideAtom = atom<Side | undefined>(undefined);
export const hoverOptimalCellAtom = atom<OptimalTableColumn | undefined>(undefined);
export const deepQuoteModalPositionAtom = atom<[number, number, number, number] | undefined>(undefined);
